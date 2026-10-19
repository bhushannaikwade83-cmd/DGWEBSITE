import { SITE } from "../site.config.js";

export default function Footer() {
  const social = Object.entries(SITE.social).filter(([, url]) => url);
  const hasContact = SITE.email || SITE.phone || SITE.address;
  return (
    <footer>
      <div className="cols">
        <div className="fbrand">
          <img src="/assets/logo.png" alt="Digitrix Media" />
          <p className="lead" style={{ fontSize: 13 }}>Websites, AI models and apps, built properly.</p>
          {social.length > 0 && (
            <div className="social">
              {social.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name}</a>)}
            </div>
          )}
        </div>
        <div><h4>Services</h4><a href="#what">Websites</a><a href="#what">AI Models</a><a href="#what">Mobile Apps</a><a href="#tech">Technology</a></div>
        <div><h4>Company</h4><a href="#about">About</a><a href="#why">Why Digitrix</a><a href="#process">Process</a><a href="#faq">FAQ</a></div>
        <div>
          <h4>Contact</h4>
          {hasContact && (
            <>
              {SITE.email && <a href={`mailto:${SITE.email}`}>{SITE.email}</a>}
              {SITE.phone && <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>}
              {SITE.address && <a style={{ pointerEvents: "none" }}>{SITE.address}</a>}
            </>
          )}
          <a href="#contact">Send us a message</a>
        </div>
      </div>
      <div className="fbar">
        <p className="fine">© 2026 Digitrix Media Pvt. Ltd. All rights reserved.</p>
        <div className="flegal"><a href="#">Privacy Policy</a><a href="#">Terms</a><a href="#top-of-page">Back to top ↑</a></div>
      </div>
    </footer>
  );
}
