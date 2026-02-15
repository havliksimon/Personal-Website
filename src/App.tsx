import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from './sections/Hero';
import About from './sections/About';
import Timeline from './sections/Timeline';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Analyses from './sections/Analyses';
import China from './sections/China';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import InteractiveNav from './components/InteractiveNav';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // Refresh ScrollTrigger after all content loads
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <InteractiveNav />
      <main className="relative cursor-none md:cursor-none">
        <ScrollProgress />
        <section id="hero">
          <Hero />
        </section>
        <About />
        <Timeline />
        <Skills />
        <Projects />
        <Analyses />
        <China />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

export default App;
