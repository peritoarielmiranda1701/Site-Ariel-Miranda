import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Services from './components/Services';
import Process from './components/Process';
import Testimonials from './components/Testimonials'; // This is now the "Differentials" section visually
import FAQ from './components/FAQ';
import ClientFeedback from './components/ClientFeedback';
import CTA from './components/CTA';
import Contact from './components/Contact';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative overflow-x-hidden w-full">
      <div className="bg-noise"></div>
      <Header />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <About />
        <Services />
        <Process />
        <Testimonials /> 
        <FAQ />
        <ClientFeedback />
        <CTA />
      </main>
      <Contact />
    </div>
  );
}

export default App;