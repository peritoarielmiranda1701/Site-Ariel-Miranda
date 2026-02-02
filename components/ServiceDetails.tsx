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
    const { id } = useParams<{ id: string }>();
    const { services, contactInfo, customization } = useSiteData();
    const [isModalOpen, setModalOpen] = useState(false);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const service = services.find(s => s.id === id);

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
                            <div className="lg:col-span-2 space-y-12">
                                <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-slate-100">
                                    <h2 className="text-2xl font-bold text-navy-900 mb-6 font-heading">Detalhes do Serviço</h2>

                                    {/* Features Grid (MOVED UP) */}
                                    {service.features && service.features.length > 0 && (
                                        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-slate-100 mb-8">
                                            <h3 className="text-xl font-bold text-navy-900 mb-8 font-heading flex items-center gap-3">
                                                <span className="w-1 h-6 bg-gold-500 rounded-full"></span>
                                                O que está incluído
                                            </h3>
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                {service.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
                                                        <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center">
                                                            <Check size={14} strokeWidth={3} />
                                                        </div>
                                                        <span className="text-slate-700 font-medium">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dynamic Content with CTA Parser (Original Styling Wrapper) */}
                                    <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-slate-100">
                                        <div className="prose prose-slate prose-lg max-w-none text-slate-600">
                                            {(() => {
                                                const content = service.details || service.description || '';
                                                // Regex to find [[CTA: Button Label]]
                                                const parts = content.split(/(\[\[CTA:.*?\]\])/g);

                                                return parts.map((part, index) => {
                                                    const ctaMatch = part.match(/\[\[CTA:\s*(.*?)\]\]/);

                                                    if (ctaMatch) {
                                                        const buttonLabel = ctaMatch[1] || 'Solicitar Orçamento';
                                                        return (
                                                            <div key={index} className="my-8 flex justify-center not-prose">
                                                                <button
                                                                    onClick={() => setModalOpen(true)}
                                                                    className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold uppercase tracking-widest rounded-lg transition-colors shadow-lg shadow-gold-500/20"
                                                                >
                                                                    {buttonLabel}
                                                                </button>
                                                            </div>
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

            <Contact data={contactInfo} logo={customization.logo} />

            <RequestQuoteModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                serviceTitle={service.title}
            />
        </div >
    );
};

export default ServiceDetails;
