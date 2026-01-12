import React from 'react';
import { SERVICES } from '../constants';
import { SectionId } from '../types';
import { Check } from 'lucide-react';

const Services: React.FC = () => {
  return (
    <section id={SectionId.SERVICES} className="py-28 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 reveal gap-6">
          <div className="max-w-2xl">
            <h2 className="text-gold-600 font-bold uppercase tracking-[0.3em] text-xs mb-4">Expertise Técnica</h2>
            <h3 className="text-4xl md:text-5xl font-heading font-extrabold text-navy-900 tracking-tight leading-tight">
              Soluções <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy-900 to-navy-600">Periciais</span>
            </h3>
          </div>
          <div className="md:max-w-xs">
            <p className="text-slate-500 text-sm leading-relaxed border-l-2 border-gold-500 pl-4">
               Soluções completas em Engenharia Elétrica, Segurança do Trabalho e Forense Digital.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <div 
              key={service.id} 
              className={`reveal reveal-delay-${(index + 1) * 100} group relative bg-white p-8 rounded-sm hover:shadow-2xl hover:shadow-navy-900/5 transition-all duration-500 border border-slate-100 hover:border-gold-200 hover:-translate-y-1 flex flex-col h-full`}
            >
              <div className="mb-6">
                 <service.icon size={36} className="text-gold-500 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              </div>
              
              <h4 className="text-xl font-bold text-navy-900 mb-2 font-heading group-hover:text-gold-600 transition-colors">
                {service.title}
              </h4>
              
              <p className="text-slate-600 text-sm leading-relaxed mb-6 opacity-80">
                {service.description}
              </p>

              {/* Feature List */}
              <div className="mt-auto space-y-3 mb-8">
                {service.features && service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="mt-1 w-3 h-3 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                      <Check size={8} className="text-gold-600" strokeWidth={3} />
                    </div>
                    <span className="text-xs text-slate-500 font-medium leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-slate-50">
                <a href="#contact" className="inline-flex items-center gap-2 text-[10px] font-bold text-navy-900 uppercase tracking-widest group-hover:text-gold-600 transition-colors">
                  Solicitar Avaliação
                  <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;