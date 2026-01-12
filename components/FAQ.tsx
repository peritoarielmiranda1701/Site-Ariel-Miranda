import React, { useState } from 'react';
import { SectionId } from '../types';
import { FAQS } from '../constants';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id={SectionId.FAQ} className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="text-center mb-16 reveal">
          <h2 className="text-gold-600 font-bold uppercase tracking-[0.3em] text-xs mb-4">Tira-Dúvidas</h2>
          <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-navy-900 mb-6">Perguntas Frequentes</h3>
          <p className="text-slate-600">Esclareça as principais dúvidas sobre nossos serviços de perícia técnica e judicial.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={faq.id} 
              className={`reveal reveal-delay-${(index % 3) * 100} bg-white rounded-lg border border-slate-200 overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-lg border-gold-200 ring-1 ring-gold-100' : 'hover:border-slate-300'}`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className={`font-bold font-heading text-lg ${openIndex === index ? 'text-navy-900' : 'text-slate-700'}`}>
                  {faq.question}
                </span>
                <div className={`p-1 rounded-full ${openIndex === index ? 'bg-gold-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                   {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50 bg-slate-50/50">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;