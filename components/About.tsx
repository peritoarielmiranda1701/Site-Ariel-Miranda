import React from 'react';
import { Award, BookOpen, Scale, CheckCircle2 } from 'lucide-react';
import { SectionId } from '../types';
import { getOptimizedImageUrl } from '../lib/directus';

const About: React.FC<{ data?: any }> = ({ data }) => {
  // Default values fallback
  const title = data?.title || 'Perito Ariel Miranda';
  const subtitle = data?.subtitle || 'Engenharia, Segurança & Forense Digital';
  const text1 = data?.text_1 || 'No complexo cenário das perícias técnicas, o Perito Ariel Miranda se destaca pela precisão e imparcialidade de seus laudos.';
  const text2 = data?.text_2 || 'Com atuação nacional e equipe multidisciplinar, somos referência em Engenharia Elétrica e Segurança do Trabalho.';

  // Optimize image if it exists in Directus
  const imageId = data?.image;
  // Fallback static URL
  const fallbackImage = "https://www.cache2net3.com//Repositorio/19349/Conteudos/133153/QUEM%20SOU.png";

  const imageUrl = imageId
    ? getOptimizedImageUrl(imageId, { width: 600, quality: 80, format: 'webp' })
    : fallbackImage;

  const badgeTitle = data?.badge_title || 'Perito Especialista';
  const badgeSubtitle = data?.badge_subtitle || 'Atuação Nacional';

  return (
    <section id={SectionId.ABOUT} className="py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-16 lg:gap-24 items-center">

          <div className="w-full md:w-5/12 reveal">
            <div className="relative group perspective-1000">
              {/* Decorative Frame */}
              <div className="absolute -inset-4 border-2 border-gold-500/30 rounded-sm transform translate-x-4 translate-y-4 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
              <div className="absolute -inset-4 border-2 border-navy-900/10 rounded-sm transform -translate-x-4 -translate-y-4"></div>

              <div className="relative z-10 overflow-hidden rounded-sm shadow-2xl">
                <div className="absolute inset-0 bg-navy-900/20 group-hover:bg-transparent transition-colors duration-500 z-20"></div>
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  width="600"
                  height="800"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded shadow-xl z-30 border-l-4 border-gold-500 hidden lg:block">
                <p className="font-heading font-bold text-navy-900 text-lg">{badgeTitle}</p>
                <p className="text-slate-500 text-xs uppercase tracking-wide mt-1">{badgeSubtitle}</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-7/12">
            <div className="reveal reveal-delay-200">
              <span className="text-gold-600 font-bold uppercase tracking-[0.2em] text-xs mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-gold-600"></span>
                Quem Sou
              </span>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-navy-900 mb-2 leading-tight">
                {title}
              </h2>
              <h3 className="text-xl md:text-2xl text-slate-400 font-light mb-8">
                {subtitle}
              </h3>

              <div className="space-y-6 text-slate-700 text-base leading-relaxed text-justify font-light">
                <p>{text1}</p>
                {text2 && <p>{text2}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 pt-8 border-t border-slate-100">
                <div className="flex gap-4">
                  <div className="bg-navy-50 p-2 rounded h-fit text-gold-600">
                    <Scale size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-navy-900 text-sm uppercase">Multidisciplinar</h5>
                    <p className="text-slate-500 text-xs mt-1">Elétrica, Segurança e Forense.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-navy-50 p-2 rounded h-fit text-gold-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-navy-900 text-sm uppercase">Ética e Rigor</h5>
                    <p className="text-slate-500 text-xs mt-1">Compromisso com a verdade técnica.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;