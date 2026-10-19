import { useEffect } from "react";
import Film from "./components/Film.jsx";
import Nav from "./components/Nav.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import { Manifesto, About, Services, Why, Tech, Industries, Process, Glance, Faq } from "./sections/Sections.jsx";

// fade-and-rise reveal for every [data-reveal] block
function useReveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll("[data-reveal]")];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.18 }
    );
    els.forEach((el) => io.observe(el));
    // IntersectionObserver can skip instant jumps / background tabs: also reveal on scroll
    const now = () => els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!el.classList.contains("in") && r.top < innerHeight * 0.92 && r.bottom > 0) el.classList.add("in");
    });
    window.addEventListener("scroll", now, { passive: true });
    now();
    return () => { io.disconnect(); window.removeEventListener("scroll", now); };
  }, []);
}

export default function App() {
  useReveal();
  return (
    <>
      <Nav />
      <div id="top-of-page" />
      <Film />
      <Manifesto />
      <About />
      <Services />
      <Why />
      <Tech />
      <Industries />
      <Process />
      <Glance />
      <Faq />
      <Contact />
      <Footer />
    </>
  );
}
