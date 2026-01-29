import React from 'react';
import { ArrowRight, Scale, ShieldCheck, Zap } from 'lucide-react';
import { SectionId } from '../types';
import { getOptimizedImageUrl } from '../lib/directus';

// Imagem fixa para o background (Substitua por sua URL se necessário)
// Esta imagem remete a engenharia elétrica e industrial
const HERO_IMAGE = "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=1920";

interface HeroProps {
  data?: {
    title?: string;
    subtitle?: string;
    cta?: string;
    bg?: string;
    hero_bg?: string;
  }
}

const Hero: React.FC<HeroProps> = ({ data }) => {

  const bgImageId = data?.hero_bg || data?.bg;
  // Fallback static image if no dynamic image is set
  const fallbackBg = HERO_IMAGE;

  // Responsive optimized images
  const bgImageMobile = bgImageId ? getOptimizedImageUrl(bgImageId, { width: 800, quality: 75, format: 'webp' }) : fallbackBg;
  const bgImageDesktop = bgImageId ? getOptimizedImageUrl(bgImageId, { width: 1920, quality: 80, format: 'webp' }) : fallbackBg;


  // Extract specific parts matching the 'bold/gold' syntax
  const renderRichText = (text: string, isTitle: boolean = false) => {
    if (!text) return null;

    // Split by newlines first
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
      // For each line, parse *bold* segments
      const parts = line.split(/(\*[^*]+\*)/g); // split by *text*

      // Styling logic: First line is standard (large), subsequent lines are smaller
      const lineClass = isTitle
        ? ""
        : lineIndex === 0
          ? "block text-lg md:text-xl leading-relaxed text-slate-300"
          : "block text-sm md:text-base mt-3 font-normal text-slate-400 opacity-90";

      return (
        <span key={lineIndex} className={lineClass}>
          {parts.map((part, partIndex) => {
            if (part.startsWith('*') && part.endsWith('*')) {
              const content = part.slice(1, -1);
              if (isTitle) {
                return (
                  <span key={partIndex} className="text-gradient-gold drop-shadow-2xl">
                    {content}
                  </span>
                );
              } else {
                return (
                  <strong key={partIndex} className="text-white font-medium">
                    {content}
                  </strong>
                );
              }
            }
            return part;
          })}
        </span>
      );
    });
  };

  const defaultTitle = "Excelência Técnica a\n*Serviço da Verdade*";
  const defaultSubtitle = "*Perito Ariel Miranda* — Especialista em perícias judiciais e extrajudiciais.";
  const defaultSubtitle2 = "Laudos técnicos em Engenharia Elétrica, Segurança do Trabalho e Forense Digital.";

  return (
    <section
      id={SectionId.HOME}
      className="relative min-h-[95vh] flex items-center pt-24 pb-20 overflow-hidden"
    >
      {/* Background with Optimized Image & Srcset for Mobile/Desktop */}
      <img
        src={bgImageDesktop}
        srcSet={`${bgImageMobile} 800w, ${bgImageDesktop} 1920w`}
        sizes="(max-width: 768px) 800px, 100vw"
        alt="Engenharia e Perícias Técnicas"
        className="absolute inset-0 w-full h-full object-cover object-center"
        fetchPriority="high"
        loading="eager"
        width="1920"
        height="1080"
      />

      {/* Heavy Overlay for Legibility - Gradient Improved */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/40 z-0"></div>

      {/* Decorative Gold Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 z-20"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          <div className="flex-1 space-y-10 max-w-4xl">
            {/* Badge */}
            <div className="reveal flex items-start">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-gold-500/30 rounded-full text-[#F5EBC4] font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] backdrop-blur-md shadow-lg shadow-gold-900/10 hover:bg-white/10 transition-colors">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                </span>
                Atendimento Nacional 24h
              </div>
            </div>

            {/* Title */}
            <div className="reveal reveal-delay-100">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black leading-[1.05] text-white tracking-tight">
                {renderRichText(data?.title || defaultTitle, true)}
              </h1>
            </div>

            {/* Description */}
            <div className="reveal reveal-delay-200 pl-8 border-l-4 border-gold-500">
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-light max-w-2xl">
                {renderRichText(data?.subtitle || defaultSubtitle)}
              </p>
              {!data?.subtitle && (
                <p className="text-slate-400 text-sm md:text-base mt-2 font-light">
                  {defaultSubtitle2}
                </p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="reveal reveal-delay-300 flex flex-col sm:flex-row gap-5 pt-4">
              <a
                href="#contact"
                className="shine-effect group inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-heading font-bold uppercase tracking-widest rounded-md transition-all transform hover:-translate-y-1 shadow-2xl shadow-gold-900/30 text-xs md:text-sm"
              >
                {data?.cta || 'Solicitar Orçamento'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent border border-white/10 hover:border-gold-400/50 hover:bg-white/5 text-white font-heading font-bold uppercase tracking-widest rounded-md transition-all text-xs md:text-sm backdrop-blur-sm"
              >
                Nossos Serviços
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="reveal reveal-delay-400 pt-6 flex items-center gap-8 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-gold-500" size={16} />
                <span>Rigor Científico</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="text-gold-500" size={16} />
                <span>Assistência Técnica</span>
              </div>
            </div>
          </div>

          {/* Floating Cards Graphic */}
          <div className="hidden lg:block w-full max-w-sm relative reveal reveal-delay-200 animate-float">
            {/* Abstract Decor Elements */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-gold-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>

            <div className="relative grid grid-cols-1 gap-8">
              <div className="bg-navy-900/40 backdrop-blur-md border border-white/10 p-8 rounded-lg shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-gold-400 to-gold-600 p-3.5 rounded-lg text-white shadow-lg shadow-gold-500/20">
                    <Zap size={28} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold font-heading text-lg">Laudos Técnicos</h3>
                    <p className="text-gold-400 text-[10px] font-bold uppercase tracking-widest">Precisão & Técnica</p>
                  </div>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-light">
                  Emissão de pareceres fundamentados para processos judiciais e extrajudiciais com validade jurídica.
                </p>
              </div>

              <div className="bg-navy-900/40 backdrop-blur-md border border-white/10 p-8 rounded-lg shadow-2xl translate-x-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-navy-500 to-navy-700 p-3.5 rounded-lg text-white shadow-lg">
                    <Scale size={28} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold font-heading text-lg">Multidisciplinar</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Engenharia & Forense</p>
                  </div>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-light">
                  Atuação em Engenharia Elétrica, Segurança do Trabalho e Forense Digital em todo o Brasil.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;