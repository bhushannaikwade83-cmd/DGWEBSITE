import { useEffect, useRef } from "react";

const BG = "#09090b";
const NCH = 6; // chapters in the film (replaced by frames.json when present)
const KEEP = 120; // decoded bitmaps kept around the playhead
const AHEAD = 30; // decode this many frames ahead
const FETCH_AHEAD = 90; // download this many frames ahead of the playhead
const MAX_INFLIGHT = 14; // parallel frame downloads

// Captions: `ch` = chapter index (timing comes from frames.json automatically).
const CAPTIONS = [
  { pos: "center", t: [-0.05, 0.02, 0.07], body: (<><h1>DIGITRIX <span className="gold">MEDIA</span></h1><p>Websites. AI models. Apps.</p></>) },
  { pos: "left", ch: 1, body: (<><h2>One core.<br /><span className="gold">Everything built on it.</span></h2><p>Strategy, design and engineering in a single team.</p></>) },
  { pos: "right", ch: 2, body: (<><h2>Websites that<br /><span className="gold">feel premium.</span></h2><p>Fast, cinematic, built to convert.</p></>) },
  { pos: "left", ch: 3, body: (<><h2>AI models that<br /><span className="gold">do real work.</span></h2><p>Custom models and automation shaped around your business.</p></>) },
  { pos: "right", ch: 4, body: (<><h2>Apps people<br /><span className="gold">keep opening.</span></h2><p>Android and iOS, designed and shipped end to end.</p></>) },
  { pos: "left", ch: 5, body: (<><h2>Build with<br /><span className="gold">Digitrix.</span></h2><p>Let's make the next thing together.</p><a className="cta" href="#contact">Start a project</a></>) },
];

export default function Film() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    const canvas = el.querySelector("#film");
    const ctx = canvas.getContext("2d");
    const track = el.querySelector("#track");
    const loader = el.querySelector("#loader");
    const loadbar = el.querySelector("#loadbar");
    const cue = el.querySelector("#scroll-cue");
    const caps = [...el.querySelectorAll(".caption")];

    let chapters = Array.from({ length: NCH }, (_, i) => ({ start: i / NCH, end: (i + 1) / NCH }));
    const timings = caps.map((c, i) => ({ c, def: CAPTIONS[i] }));
    const applyTimings = () => {
      for (const { c, def } of timings) {
        if (def.t) { c.dataset.in = def.t[0]; c.dataset.hold = def.t[1]; c.dataset.out = def.t[2]; continue; }
        const ch = chapters[def.ch];
        if (!ch) continue;
        const len = ch.end - ch.start;
        c.dataset.in = ch.start + len * 0.18;
        c.dataset.hold = ch.start + len * 0.5;
        c.dataset.out = ch.start + len * 0.88;
      }
    };
    applyTimings();

    const st = { blobs: [], bitmaps: new Map(), decoding: new Set(), count: 0, pattern: "",
      current: -1, target: 0, smooth: 0, dir: 1, ready: false };
    let raf = 0, dead = false, lastT = performance.now();

    const progress = () => {
      const max = track.offsetHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const transformBase = (c) =>
      c.classList.contains("cap-center") ? "translate(-50%, -50%)"
        : c.classList.contains("cap-bottom") ? "translateX(-50%)" : "translateY(-50%)";

    const updateCaptions = (p) => {
      for (const c of caps) {
        const tIn = +c.dataset.in, tHold = +c.dataset.hold, tOut = +c.dataset.out;
        const rise = Math.max((tHold - tIn) * 0.4, 0.008);
        const fall = Math.max((tOut - tHold) * 0.6, 0.008);
        let o = 0;
        if (p >= tIn && p <= tOut) o = Math.min(Math.max(Math.min((p - tIn) / rise, 1) * Math.min((tOut - p) / fall, 1), 0), 1);
        c.style.opacity = o.toFixed(3);
        c.style.transform = `${transformBase(c)} translateY(${((p - tHold) * -40).toFixed(1)}px)`;
      }
      cue.style.opacity = p < 0.015 ? 1 : 0;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      st.current = -1;
    };

    const frameURL = (i) => st.pattern.replace("%04d", String(i + 1).padStart(4, "0"));
    const inflight = new Map();
    const fetchBlob = (i) => {
      if (st.blobs[i]) return Promise.resolve(st.blobs[i]);
      if (!inflight.has(i)) {
        inflight.set(i, fetch(frameURL(i)).then((r) => r.blob()).then((b) => { st.blobs[i] = b; return b; })
          .catch(() => null).finally(() => inflight.delete(i)));
      }
      return inflight.get(i);
    };
    // download what the user is about to need first (in scroll direction), a few behind too
    const prefetchAround = (center) => {
      for (let d = 0; d <= FETCH_AHEAD && inflight.size < MAX_INFLIGHT; d++) {
        const f = center + d * st.dir, b = center - Math.min(d, 20) * st.dir;
        if (f >= 0 && f < st.count && !st.blobs[f]) fetchBlob(f);
        if (b >= 0 && b < st.count && !st.blobs[b] && inflight.size < MAX_INFLIGHT) fetchBlob(b);
      }
    };
    const decode = async (i) => {
      if (st.bitmaps.has(i) || st.decoding.has(i) || !st.blobs[i]) return;
      st.decoding.add(i);
      try { st.bitmaps.set(i, await createImageBitmap(st.blobs[i])); } catch { /* retried next tick */ }
      st.decoding.delete(i);
    };
    const manageWindow = (center) => {
      for (let d = 0; d <= AHEAD; d++) {
        const f = center + d * st.dir, b = center - Math.min(d, 8) * st.dir;
        if (f >= 0 && f < st.count) decode(f);
        if (b >= 0 && b < st.count) decode(b);
      }
      if (st.bitmaps.size > KEEP * 2)
        for (const [idx, bmp] of st.bitmaps) if (Math.abs(idx - center) > KEEP) { bmp.close(); st.bitmaps.delete(idx); }
    };
    const nearest = (i) => {
      if (st.bitmaps.has(i)) return i;
      for (let d = 1; d < st.count; d++) {
        if (st.bitmaps.has(i - d)) return i - d;
        if (st.bitmaps.has(i + d)) return i + d;
      }
      return -1;
    };
    const draw = (i) => {
      const j = nearest(i);
      if (j < 0) return;
      const bmp = st.bitmaps.get(j), cw = canvas.width, ch = canvas.height;
      ctx.fillStyle = BG; ctx.fillRect(0, 0, cw, ch);
      const wide = cw / ch >= 1.2; // wide: fill the viewport; portrait phones: contain
      const s = (wide ? Math.max : Math.min)(cw / bmp.width, ch / bmp.height) * 1.02;
      const w = bmp.width * s, h = bmp.height * s;
      ctx.drawImage(bmp, (cw - w) / 2, (ch - h) / 2, w, h);
      st.current = j;
    };

    const tick = (now) => {
      if (dead) return;
      const dt = Math.min((now - lastT) / 1000, 0.5) || 0.016;
      lastT = now;
      if (st.ready) {
        const p = progress(), prev = st.target;
        st.target = p * (st.count - 1);
        if (st.target !== prev) st.dir = st.target >= prev ? 1 : -1;
        st.smooth += (st.target - st.smooth) * (1 - Math.exp(-dt * 14));
        if (Math.abs(st.target - st.smooth) < 0.5) st.smooth = st.target;
        const i = Math.round(st.smooth);
        prefetchAround(i);
        manageWindow(i);
        if (i !== st.current) draw(i);
        updateCaptions(p);
      }
      raf = requestAnimationFrame(tick);
    };

    // no frames yet: breathing gold core so the page still works
    const placeholder = () => {
      loader.classList.add("done");
      const loop = (t) => {
        if (dead) return;
        const cw = canvas.width, ch = canvas.height, p = progress();
        ctx.fillStyle = BG; ctx.fillRect(0, 0, cw, ch);
        const r = Math.min(cw, ch) * (0.16 + 0.05 * Math.sin(t / 900) + p * 0.2);
        const g = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, r * 3);
        g.addColorStop(0, "rgba(253,222,84,0.9)"); g.addColorStop(0.25, "rgba(247,210,81,0.35)"); g.addColorStop(1, "rgba(9,9,11,0)");
        ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);
        updateCaptions(p);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };

    const preload = async () => {
      const eager = Math.min(Math.ceil(st.count * 0.3), 200); // loader waits for the first ~30%
      let done = 0;
      await Promise.all(Array.from({ length: eager }, (_, i) => fetchBlob(i).then(() => {
        done++; loadbar.style.width = `${(done / eager) * 100}%`;
      })));
      await decode(0);
      st.ready = true;
      loader.classList.add("done");
      let next = eager;
      await Promise.all(Array.from({ length: 8 }, async () => {
        while (next < st.count && !dead) { const i = next++; await fetchBlob(i); }
      }));
    };

    window.addEventListener("resize", resize);
    resize();
    fetch("/frames/frames.json")
      .then((r) => { if (!r.ok) throw new Error("no manifest"); return r.json(); })
      .then((m) => {
        if (m.chapters) { chapters = m.chapters; applyTimings(); }
        st.count = m.count; st.pattern = "/" + m.pattern; st.blobs = new Array(m.count).fill(null);
        raf = requestAnimationFrame(tick);
        return preload();
      })
      .catch(placeholder);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      st.bitmaps.forEach((b) => b.close());
    };
  }, []);

  return (
    <div ref={root}>
      <div id="loader">
        <img src="/assets/logo.png" alt="Digitrix Media" />
        <div className="bar"><i id="loadbar" /></div>
      </div>
      <div id="track">
        <div id="stage">
          <canvas id="film" />
          <div id="vignette" />
          {CAPTIONS.map((c, i) => (
            <div key={i} className={`caption cap-${c.pos}`}>{c.body}</div>
          ))}
          <div id="scroll-cue">Scroll</div>
        </div>
      </div>
    </div>
  );
}
