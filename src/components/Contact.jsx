import { SITE } from "../site.config.js";

export default function Contact() {
  const info = [
    SITE.email && <a key="e" href={`mailto:${SITE.email}`}>{SITE.email}</a>,
    SITE.phone && <a key="p" href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>,
    SITE.address && <span key="a">{SITE.address}</span>,
  ].filter(Boolean);

  const submit = (e) => {
    e.preventDefault();
    if (!SITE.email) { alert("Set SITE.email in src/site.config.js first."); return; }
    const f = new FormData(e.target);
    const subject = `${f.get("topic")} enquiry from ${f.get("name")}`;
    const body = `${f.get("msg")}\n\n${f.get("name")} <${f.get("email")}>`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="bp ctaband" id="contact">
      <div data-reveal>
        <img src="/assets/logo.png" alt="" />
        <h2>Have something to build?</h2>
        <p className="lead" style={{ marginInline: "auto" }}>Tell us about it. We'll reply with a plan.</p>
        {info.length > 0 && <div className="cinfo">{info}</div>}
        <form className="contact" onSubmit={submit}>
          <input name="name" placeholder="Your name" required />
          <input name="email" type="email" placeholder="Email" required />
          <select name="topic"><option>Website</option><option>AI model</option><option>Mobile app</option><option>Something else</option></select>
          <textarea name="msg" rows="4" placeholder="What are you building?" required />
          <button className="cta" type="submit">Send message</button>
        </form>
      </div>
    </section>
  );
}
