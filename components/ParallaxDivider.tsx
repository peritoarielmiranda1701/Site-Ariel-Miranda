import React from 'react';

const ParallaxDivider: React.FC = () => {
  return (
    <section className="relative py-32 lg:py-48 bg-navy-900 bg-fixed bg-center bg-cover bg-no-repeat" style={{ backgroundImage: "url('https://www.cache2net3.com//Repositorio/19349/Conteudos/133159/SLIDES%202.png')" }}>
      <div className="absolute inset-0 bg-navy-950/60 mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950 opacity-80"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Content can be added here if needed, currently serves as visual break */}
        <div className="w-24 h-1 bg-gold-500 mx-auto rounded-full shadow-[0_0_15px_rgba(230,198,109,0.6)]"></div>
      </div>
    </section>
  );
};

export default ParallaxDivider;