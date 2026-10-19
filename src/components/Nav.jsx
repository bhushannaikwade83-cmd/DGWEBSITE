import { useEffect, useState } from "react";
import { NAV_LINKS } from "../site.config.js";

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav id="brandnav" className={`${solid ? "solid" : ""} ${open ? "open" : ""}`}>
      <a className="brand" href="#top-of-page" aria-label="Digitrix Media home">
        <img src="/assets/logo.png" alt="Digitrix Media" />
      </a>
      <div className="links" id="navlinks" onClick={() => setOpen(false)}>
        {NAV_LINKS.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        <a className="navcta mobile-only" href="#contact">Start a project</a>
      </div>
      <a className="navcta desktop-only" href="#contact">Start a project</a>
      <button id="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span /><span />
      </button>
    </nav>
  );
}
