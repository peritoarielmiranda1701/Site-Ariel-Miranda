import { useState, useEffect } from 'react';
import { directus } from '../lib/directus';
import { readItems, readSingleton } from '@directus/sdk';
import * as Icons from 'lucide-react';
import { Service, Testimonial, FAQItem, ProcessStep, Differential } from '../types';
import { SERVICES as DEFAULT_SERVICES, FAQS as DEFAULT_FAQS, TESTIMONIALS as DEFAULT_TESTIMONIALS, PROCESS_STEPS as DEFAULT_PROCESS_STEPS, CONTACT_INFO as DEFAULT_CONTACT, STATS as DEFAULT_STATS, DIFFERENTIALS as DEFAULT_DIFFERENTIALS } from '../constants';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const getIcon = (name: string): any => {
    // @ts-ignore
    return Icons[name] || Icons.HelpCircle;
};

export function useSiteData() {
    const { loading: authLoading } = useAuth(); // Wait for Auth Check
    const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
    const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
    const [differentials, setDifferentials] = useState<Differential[]>(DEFAULT_DIFFERENTIALS);
    const [faqs, setFaqs] = useState<FAQItem[]>(DEFAULT_FAQS);
    const [processSteps, setProcessSteps] = useState<ProcessStep[]>(DEFAULT_PROCESS_STEPS);
    const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);
    const [stats, setStats] = useState(DEFAULT_STATS);
    const [hero, setHero] = useState({
        title: 'Excelência Técnica a\n*Serviço da Verdade*',
        subtitle: '*Perito Ariel Miranda* — Especialista em perícias judiciais e extrajudiciais.',
        cta: 'Solicitar Orçamento'
    });
    const [about, setAbout] = useState({
        title: 'Perito Ariel Miranda',
        subtitle: 'Engenharia, Segurança & Forense Digital',
        text_1: 'No complexo cenário das perícias técnicas...',
        text_2: 'Com atuação nacional...',
        image: '', // will be populated
        badge_title: 'Perito Especialista',
        badge_subtitle: 'Atuação Nacional'
    });

    const [seo, setSeo] = useState({
        title: 'Perito Ariel Miranda | Engenharia Elétrica & Segurança',
        description: 'Perícia Técnica Especializada, Laudos Judiciais e Consultoria em Engenharia Elétrica.',
        keywords: 'perito, engenharia, elétrica, laudos, judicial, segurança do trabalho',
        ogImage: '',
        ogTitle: ''
    });
    const [customization, setCustomization] = useState({
        logo: '',
        colors: {
            primary: '',
            accent: ''
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for AuthContext to finish checking token validity
        if (authLoading) return;

        async function fetchData() {
            try {
                const [servicesData, testimonialsData, faqsData, processData, infoData, heroData, differentialsData, aboutData, seoData] = await Promise.all([
                    directus.request(readItems('services')),
                    directus.request(readItems('testimonials')),
                    directus.request(readItems('faqs')),
                    directus.request(readItems('process_steps')),
                    directus.request(readSingleton('Informacoes_Gerais')),
                    directus.request(readSingleton('hero_stats')),
                    directus.request(readItems('differentials')),
                    directus.request(readSingleton('about_section' as any)),
                    directus.request(readSingleton('seo_config' as any))
                ]);

                if (servicesData) {
                    setServices(servicesData.map(s => ({
                        id: String(s.id),
                        title: s.title,
                        description: s.description,
                        icon: getIcon(s.icon),
                        features: s.features,
                        details: s.details
                    })));
                }

                if (testimonialsData) {
                    setTestimonials(testimonialsData.map(t => ({
                        id: String(t.id),
                        name: t.name,
                        role: t.role,
                        content: t.content
                    })));
                }

                if (differentialsData) {
                    setDifferentials(differentialsData.map(d => ({
                        id: String(d.id),
                        title: d.title,
                        description: d.description,
                        icon: getIcon(d.icon)
                    })));
                }

                if (faqsData) {
                    setFaqs(faqsData.map(f => ({
                        id: String(f.id),
                        question: f.question,
                        answer: f.answer
                    })));
                }

                if (processData) {
                    setProcessSteps(processData.map(p => ({
                        id: String(p.id),
                        number: p.number,
                        title: p.title,
                        description: p.description,
                        icon: getIcon(p.icon)
                    })));
                }

                if (infoData) {
                    const info = infoData as any;
                    setContactInfo({
                        whatsapp: info.phone_display || DEFAULT_CONTACT.whatsapp,
                        email: info.email,
                        address: info.address,
                        instagram: info.instagram,
                        social: {
                            instagram: info.instagram,
                            linkedin: info.linkedin,
                            whatsapp: info.whatsapp
                        }
                    });
                }

                if (seoData) {
                    const seo = seoData as any;
                    setSeo({
                        title: seo.site_title || 'Perito Ariel Miranda | Engenharia Elétrica & Segurança',
                        description: seo.site_description || 'Perícia Técnica Especializada em todo o Brasil.',
                        keywords: seo.site_keywords || 'engenharia, pericia, laudos',
                        ogImage: seo.og_image,
                        ogTitle: seo.og_title
                    });
                } else if (infoData) {
                    // Fallback to General Info if SEO config is empty (legacy support)
                    const info = infoData as any;
                    setSeo({
                        title: info.site_title || 'Perito Ariel Miranda | Engenharia Elétrica & Segurança',
                        description: info.site_description || 'Perícia Técnica Especializada em todo o Brasil.',
                        keywords: info.site_keywords || 'engenharia, pericia, laudos',
                        ogImage: info.og_image,
                        ogTitle: info.og_title
                    });

                    // Site Customization (Colors & Logo)
                    if (info.site_logo || info.primary_color || info.accent_color || info.contact_email) {
                        setContactInfo(prev => ({
                            ...prev,
                            // If user set a specific contact email for form, use it. Otherwise keep default (or fallback to info.email)
                            recipient_email: info.contact_email || info.email || prev.email,
                            // Also update display email if it matches logic (optional, but keep separate for safety)
                        }));

                        setCustomization({
                            logo: info.site_logo,
                            colors: {
                                primary: info.primary_color,
                                accent: info.accent_color
                            }
                        });
                    }
                }

                // ... (existing hero logic) ...


                if (heroData) {
                    const hero = heroData as any;
                    setHero(prev => ({
                        ...prev,
                        title: hero.hero_title || prev.title,
                        subtitle: hero.hero_subtitle || prev.subtitle,
                        cta: hero.cta_text || hero.cta || prev.cta,
                        bg: hero.hero_bg
                    }));

                    setStats([
                        { value: hero.stat_1_value || "12+", label: hero.stat_1_label || "Anos de Experiência" },
                        { value: hero.stat_2_value || "850+", label: hero.stat_2_label || "Laudos Emitidos" },
                        { value: hero.stat_3_value || "100%", label: hero.stat_3_label || "Compromisso Ético" },
                        { value: hero.stat_4_value || "BR", label: hero.stat_4_label || "Atuação Nacional" },
                    ]);
                }

                if (aboutData) {
                    const about = aboutData as any;
                    setAbout({
                        title: about.title || 'Perito Ariel Miranda',
                        subtitle: about.subtitle || 'Engenharia, Segurança & Forense Digital',
                        text_1: about.text_1 || 'Texto padrão...',
                        text_2: about.text_2 || '',
                        image: about.image,
                        badge_title: about.badge_title || 'Perito Especialista',
                        badge_subtitle: about.badge_subtitle || 'Atuação Nacional'
                    });
                }

            } catch (error) {
                console.error("❌ Failed to fetch CMS data, using defaults:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [authLoading]);

    // Debug log to verify data source
    useEffect(() => {
        if (!loading) {
            console.log("📊 Site Data State:", {
                source: services !== DEFAULT_SERVICES ? 'CMS' : 'Constants',
                services,
                differentials
            });
        }
    }, [loading, services, differentials]);

    return { services, testimonials, differentials, faqs, processSteps, contactInfo, stats, hero, seo, about, customization, loading };
}
