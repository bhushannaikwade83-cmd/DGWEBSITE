import { SERVICES, WHY, TECH, INDUSTRIES, STEPS, GLANCE, FAQ } from "../site.config.js";

export const Manifesto = () => (
  <section className="bp manifesto" id="top">
    <div data-reveal><p className="kicker">Digitrix Media</p><h2>Great software should feel inevitable.</h2></div>
  </section>
);

export const About = () => (
  <section className="bp" id="about">
    <div className="split">
      <div data-reveal>
        <p className="kicker">About us</p>
        <h2>A small team with a big standard.</h2>
        <p className="lead">Digitrix Media Pvt. Ltd. designs and builds websites, AI models and mobile apps. We started in 2026 with one belief: your product should look as good as it works.</p>
        <p className="lead">Strategy, design and engineering sit in one team, so nothing gets lost between an idea and the finished product.</p>
      </div>
      <div className="aboutmark" data-reveal><img src="/assets/logo.png" alt="Digitrix Media logo" /></div>
    </div>
  </section>
);

export const Services = () => (
  <section className="bp" id="what">
    <div data-reveal><p className="kicker">Services</p><h2>Three disciplines.<br />One standard.</h2></div>
    <div className="cards">
      {SERVICES.map((s) => (
        <div className="card" data-reveal key={s.no}>
          <span className="no">{s.no}</span><h3>{s.title}</h3><p>{s.text}</p>
          <ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      ))}
    </div>
  </section>
);

export const Why = () => (
  <section className="bp" id="why">
    <div data-reveal><p className="kicker">Why Digitrix</p><h2>Built differently.</h2></div>
    <div className="grid4">
      {WHY.map(([t, p]) => (
        <div className="feat" data-reveal key={t}><div className="ic">◆</div><h4>{t}</h4><p>{p}</p></div>
      ))}
    </div>
  </section>
);

export const Tech = () => (
  <section className="bp" id="tech">
    <div data-reveal><p className="kicker">Technology</p><h2>Tools we build with.</h2>
      <p className="lead">We pick the right tool for the job, not the trendy one.</p></div>
    <div className="chips" data-reveal>{TECH.map((t) => <span key={t}>{t}</span>)}</div>
  </section>
);

export const Industries = () => (
  <section className="bp" id="industries">
    <div data-reveal><p className="kicker">Who we work with</p><h2>Built for any industry.</h2></div>
    <div className="chips big" data-reveal>{INDUSTRIES.map((t) => <span key={t}>{t}</span>)}</div>
  </section>
);

export const Process = () => (
  <section className="bp" id="process">
    <div data-reveal><p className="kicker">Process</p><h2>From idea to launch.</h2></div>
    <div className="steps">
      {STEPS.map(([n, t, p]) => (
        <div className="step" data-reveal key={n}><div className="n">{n}</div><h4>{t}</h4><p>{p}</p></div>
      ))}
    </div>
  </section>
);

export const Glance = () => (
  <section className="bp specs" id="stack">
    <div data-reveal>
      <p className="kicker" style={{ textAlign: "center" }}>At a glance</p>
      <table><tbody>{GLANCE.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}</tbody></table>
    </div>
  </section>
);

export const Faq = () => (
  <section className="bp" id="faq">
    <div data-reveal><p className="kicker">FAQ</p><h2>Good questions.</h2></div>
    <div className="faq" data-reveal>
      {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
    </div>
  </section>
);
