import React, { useRef, useState, useEffect } from 'react';
import { TESTIMONIALS } from '../constants';
import { SectionId } from '../types';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const ClientFeedback: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth; // Scroll one view width
      
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, children } = scrollRef.current;
      if (children.length > 0) {
          const itemWidth = children[0].clientWidth;
          const newIndex = Math.round(scrollLeft / itemWidth);
          setActiveIndex(newIndex);
      }
    }
  };

  return (
    <section id={SectionId.FEEDBACK} className="py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 reveal">
          <h2 className="text-gold-600 font-bold uppercase tracking-[0.3em] text-xs mb-4">Depoimentos</h2>
          <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-navy-900 mb-6">O Que Dizem Nossos Clientes</h3>
          <p className="text-slate-600 max-w-2xl mx-auto font-light">
            Confiança conquistada com resultados técnicos comprovados.
          </p>
        </div>

        <div className="relative group">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-6 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-navy-900 hover:text-gold-500 hover:scale-110 transition-all disabled:opacity-50"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-6 z-20 w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-navy-900 hover:text-gold-500 hover:scale-110 transition-all"
            aria-label="Próximo"
          >
            <ChevronRight size={24} />
          </button>

          {/* Carousel Container */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 pt-4 px-2 no-scrollbar scroll-smooth [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TESTIMONIALS.map((testimonial, index) => (
               <div 
                key={testimonial.id} 
                className="snap-center flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="bg-slate-50 p-8 rounded-lg border border-slate-100 relative group-hover:shadow-xl hover:shadow-navy-900/5 transition-all duration-300 h-full flex flex-col">
                  <Quote className="text-gold-200 absolute top-6 right-6" size={48} />
                  <p className="text-slate-600 leading-relaxed mb-8 relative z-10 italic flex-grow">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy-900 to-navy-800 flex items-center justify-center text-gold-500 font-bold text-lg shadow-md border-2 border-white flex-shrink-0">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-navy-900 text-sm">{testimonial.name}</p>
                      <p className="text-gold-600 text-xs font-bold uppercase tracking-wide">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
               </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-2">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollRef.current && scrollRef.current.children.length > 0) {
                    const itemWidth = scrollRef.current.children[0].clientWidth;
                    scrollRef.current.scrollTo({ left: itemWidth * index, behavior: 'smooth' });
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? 'w-6 bg-gold-500' 
                    : 'w-2 bg-slate-200 hover:bg-gold-300'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientFeedback;