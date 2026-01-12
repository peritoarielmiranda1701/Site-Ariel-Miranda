import React from 'react';
import { DIFFERENTIALS } from '../constants';
import { SectionId } from '../types';

const Testimonials: React.FC = () => {
  return (
    <section id={SectionId.TESTIMONIALS} className="py-28 bg-navy-950 text-white relative overflow-hidden">
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-navy-900 via-navy-950 to-navy-950 opacity-80"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-20 max-w-4xl mx-auto reveal">
          <h2 className="text-gold-500 font-bold tracking-[0.3em] uppercase text-xs mb-4">Por que nos escolher?</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Diferenciais Competitivos</h3>
          <p className="text-slate-400 font-light text-lg">
            A prova técnica pericial é o alicerce da decisão judicial. Garantimos técnica apurada e estratégia processual.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {DIFFERENTIALS.map((item, index) => (
            <div 
              key={item.id} 
              className={`reveal reveal-delay-${(index + 1) * 150} bg-navy-900/50 backdrop-blur-sm p-10 rounded-lg border border-navy-800 hover:border-gold-500/50 transition-all duration-500 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold-900/10`}
            >
              <div className="w-16 h-16 bg-navy-950 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gold-500 transition-colors duration-500 shadow-lg border border-navy-800 group-hover:border-gold-400 rotate-3 group-hover:rotate-0">
                <item.icon size={28} className="text-gold-500 group-hover:text-navy-950 transition-colors duration-500" />
              </div>
              
              <h4 className="text-2xl font-bold text-white mb-4 font-heading group-hover:text-gold-400 transition-colors">
                {item.title}
              </h4>
              
              <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;