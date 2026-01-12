import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CONTACT_INFO } from '../constants';

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gold-600 to-gold-500 relative overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-multiply"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-6 drop-shadow-md">
          Precisa de um Laudo Técnico com Urgência?
        </h2>
        <p className="text-gold-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
          Solicite seu orçamento agora e receba atendimento 24h por profissionais certificados e experientes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <a 
             href={`https://wa.me/55${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`} 
             target="_blank" 
             rel="noopener noreferrer"
             className="shine-effect inline-flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 text-white font-bold uppercase tracking-wider rounded-md shadow-2xl hover:bg-navy-800 hover:-translate-y-1 transition-all"
           >
             Solicitar Orçamento
             <ArrowRight size={18} />
           </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;