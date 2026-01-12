import React from 'react';
import { SectionId } from '../types';
import { PROCESS_STEPS } from '../constants';

const Process: React.FC = () => {
  return (
    <section id={SectionId.PROCESS} className="py-28 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 skew-x-12 opacity-50 -z-10"></div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-20 reveal">
          <h2 className="text-gold-600 font-bold uppercase tracking-[0.3em] text-xs mb-4">Fluxo de Trabalho</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-extrabold text-navy-900 mb-4">Como Funciona</h3>
          <p className="text-slate-500 max-w-2xl mx-auto font-light">Do primeiro contato até a entrega do laudo técnico.</p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) - Enhanced with Gold Gradient */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-200 to-transparent -z-10"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.id} className={`reveal reveal-delay-${(index + 1) * 100} relative group`}>
                <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center border-4 border-slate-50 mb-8 relative z-10 shadow-lg group-hover:border-gold-300 group-hover:shadow-gold-500/20 transition-all duration-500">
                  <div className="w-20 h-20 bg-navy-50 rounded-full flex items-center justify-center text-navy-900 group-hover:bg-gold-500 group-hover:text-white transition-all duration-500 transform group-hover:rotate-12">
                     <step.icon size={32} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-navy-900 rounded-full flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow-md">
                    {step.number}
                  </div>
                </div>
                
                <div className="text-center px-4">
                  <h4 className="text-xl font-bold text-navy-900 mb-3 font-heading group-hover:text-gold-600 transition-colors">{step.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;