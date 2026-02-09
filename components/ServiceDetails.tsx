import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Calendar, ArrowRight } from 'lucide-react';
import { useSiteData } from '../hooks/useSiteData';
import Header from './Header';
import Contact from './Contact';
import SEOHeader from './SEOHeader';
import { getOptimizedImageUrl } from '../lib/directus';
import RequestQuoteModal from './RequestQuoteModal';

const ServiceDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { services, contactInfo, customization } = useSiteData();
    const [isModalOpen, setModalOpen] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    const service = services.find(s => s.slug === slug);

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col bg-slate-50">
                <Header logo={customization.logo} />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-navy-900 mb-4">Serviço não encontrado</h2>
                        <Link to="/" className="text-gold-600 hover:underline">Voltar para a Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative overflow-x-hidden">
            <SEOHeader
                title={`${service.title} | Perito Ariel Miranda`}
                description={service.description}
            />

            <Header logo={customization.logo} />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative bg-navy-900 py-32 lg:py-40 overflow-hidden">
                    {service.hero_image ? (
                        <>
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={getOptimizedImageUrl(service.hero_image, { width: 1920, quality: 80, format: 'webp' })}
                                    alt={service.title}
                                    className="w-full h-full object-cover opacity-40"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/90 to-navy-900/40"></div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-noise opacity-10"></div>
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-500/10 to-transparent"></div>
                        </>
                    )}

                    <div className="container top-12 mx-auto px-4 sm:px-6 relative z-10">


                        <div className="max-w-4xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm text-gold-500">
                                    <service.icon size={32} />
                                </div>
                                <span className="text-gold-500 font-bold tracking-widest uppercase text-sm">Serviço Especializado</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6 leading-tight">
                                {service.title}
                            </h1>

                            <p className="text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="grid lg:grid-cols-3 gap-12">

                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8 md:space-y-12 min-w-0">

                                {/* 1. Features Grid (Now First) */}
                                {service.features && service.features.length > 0 && (
                                    <div className="bg-white p-6 md:p-12 rounded-lg shadow-sm border border-slate-100 mb-8">
                                        <h3 className="text-xl font-bold text-navy-900 mb-8 font-heading flex items-center gap-3">
                                            <span className="w-1 h-6 bg-gold-500 rounded-full"></span>
                                            O que está incluído
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {service.features.map((feature, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        const element = document.getElementById(`item-${idx + 1}`);
                                                        if (element) {
                                                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                        }
                                                    }}
                                                    className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:shadow-md hover:bg-white hover:border-gold-200 transition-all text-left w-full group cursor-pointer"
                                                >
                                                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-white transition-colors">
                                                        <span className="text-xs font-bold">{idx + 1}</span>
                                                    </div>
                                                    <span className="text-slate-700 font-medium break-words group-hover:text-navy-900 transition-colors">{feature}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 2. Detailed Landing Page Content (Content After Features) */}
                                {service.details && (
                                    <div className="bg-white p-5 md:p-12 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                                        {/* Decorative top gradient line */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300"></div>

                                        <h2 className="text-xl font-bold text-navy-900 mb-6 md:mb-8 font-heading relative inline-block">
                                            Detalhes e Informações
                                            <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gold-500 rounded-full"></span>
                                        </h2>

                                        <div className="ql-snow w-full max-w-full">
                                            <div className="ql-editor !p-0 !h-auto !overflow-visible prose prose-base md:prose-lg max-w-none w-full
                                                prose-headings:font-heading prose-headings:font-bold prose-headings:text-navy-900 
                                                prose-headings:break-words prose-headings:hyphens-auto
                                                prose-h1:text-2xl md:prose-h1:text-4xl
                                                prose-h2:text-xl md:prose-h2:text-3xl
                                                prose-p:text-slate-600 prose-p:leading-loose prose-p:font-light prose-p:break-words
                                                prose-strong:text-navy-800 prose-strong:font-bold
                                                prose-ul:space-y-2 prose-li:text-slate-600 prose-li:marker:text-gold-500
                                                prose-blockquote:border-l-4 prose-blockquote:border-gold-500 prose-blockquote:bg-gold-50/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:text-navy-800 prose-blockquote:rounded-r-lg
                                                break-words overflow-hidden
                                            ">
                                                {(() => {
                                                    const content = service.details || '';
                                                    // Regex to find [[CTA: Button Label]] or [[ITEM: number]]
                                                    const parts = content.split(/(\[\[(?:CTA:.*?|ITEM:\d+)\]\])/g);

                                                    return parts.map((part, index) => {
                                                        // Check for CTA
                                                        const ctaMatch = part.match(/\[\[CTA:\s*(.*?)\]\]/);
                                                        if (ctaMatch) {
                                                            const buttonLabel = ctaMatch[1] || 'Solicitar Orçamento';
                                                            return (
                                                                <div key={index} className="my-12 not-prose">
                                                                    <div className="relative group/cta overflow-hidden rounded-xl p-[2px] bg-gradient-to-r from-navy-900 via-gold-500 to-navy-900">
                                                                        <div className="bg-white rounded-[10px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                                                            {/* Background Pattern */}
                                                                            <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
                                                                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                                                                            <div className="relative z-10 text-center md:text-left">
                                                                                <h4 className="text-xl font-bold text-navy-900 font-heading mb-2">
                                                                                    Precisa de ajuda com isso?
                                                                                </h4>
                                                                                <p className="text-slate-500 text-sm max-w-md">
                                                                                    Solicite uma análise técnica especializada agora mesmo.
                                                                                </p>
                                                                            </div>

                                                                            <button
                                                                                onClick={() => setModalOpen(true)}
                                                                                className="relative z-10 w-full md:w-auto px-5 py-3 md:px-8 md:py-4 bg-navy-900 hover:bg-navy-800 text-white font-bold uppercase tracking-widest text-xs md:text-sm rounded-lg transition-all shadow-lg shadow-navy-900/20 hover:shadow-xl hover:-translate-y-1 group-hover/cta:scale-105 flex items-center justify-center gap-2 md:gap-3 h-auto min-h-[44px]"
                                                                            >
                                                                                <span className="leading-tight text-center whitespace-normal">{buttonLabel}</span>
                                                                                <ArrowRight size={16} className="text-gold-500 flex-shrink-0" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }

                                                        // Check for ITEM anchor
                                                        const itemMatch = part.match(/\[\[ITEM:\s*(\d+)\]\]/);
                                                        if (itemMatch) {
                                                            const itemNumber = itemMatch[1];
                                                            return (
                                                                <span
                                                                    key={index}
                                                                    id={`item-${itemNumber}`}
                                                                    className="block scroll-mt-32"
                                                                    aria-hidden="true"
                                                                ></span>
                                                            );
                                                        }

                                                        // Render standard HTML content
                                                        if (!part.trim()) return null;

                                                        return (
                                                            <div
                                                                key={index}
                                                                dangerouslySetInnerHTML={{ __html: part }}
                                                            />
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar CTA */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-24 space-y-6">
                                    <div className="bg-navy-900 p-8 rounded-lg shadow-xl text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                        <h3 className="text-2xl font-bold font-heading mb-4 relative z-10">Precisa deste serviço?</h3>
                                        <p className="text-slate-300 mb-8 relative z-10 font-light">
                                            Solicite um orçamento personalizado para sua necessidade específica.
                                        </p>

                                        <button
                                            onClick={() => setModalOpen(true)}
                                            className="w-full block text-center py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest rounded transition-colors shadow-lg shadow-gold-500/20"
                                        >
                                            Solicitar Orçamento
                                        </button>

                                        <div className="mt-8 pt-8 border-t border-white/10">
                                            <div className="flex items-center gap-3 text-slate-300 mb-2">
                                                <Calendar size={18} className="text-gold-500" />
                                                <span className="text-sm">Agendamento rápido</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-300">
                                                <Check size={18} className="text-gold-500" />
                                                <span className="text-sm">Atendimento Nacional</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Contact Info */}
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                                        <h4 className="font-bold text-navy-900 mb-4">Contato Direto</h4>
                                        <p className="text-slate-600 text-sm mb-4">
                                            Dúvidas? Fale diretamente com nossa equipe.
                                        </p>
                                        <a href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-gold-600 font-bold hover:underline flex items-center gap-2">
                                            WhatsApp <ArrowRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Contact
                data={contactInfo}
                logo={customization.logo}
                allowAttachments={service.allow_attachments}
            />

            <RequestQuoteModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                serviceTitle={service.title}
                allowAttachments={service.allow_attachments}
            />
        </div >
    );
};

export default ServiceDetails;
