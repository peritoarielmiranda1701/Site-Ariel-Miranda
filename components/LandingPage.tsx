import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Stats from './Stats';
import About from './About';
import Services from './Services';
import Process from './Process';
import Testimonials from './Testimonials'; // This is "Differentials" visually
import FAQ from './FAQ';
import ClientFeedback from './ClientFeedback';
import CTA from './CTA';
import Contact from './Contact';
import SEOHeader from './SEOHeader';

import { useSiteData } from '../hooks/useSiteData';

function LandingPage() {
    const {
        services,
        testimonials,
        differentials,
        faqs,
        processSteps,
        contactInfo,
        stats,
        hero,
        seo,

        about,
        customization // New
    } = useSiteData();

    // Inject Custom Colors & Favicon
    React.useEffect(() => {
        // Colors
        if (customization.colors.primary) {
            document.documentElement.style.setProperty('--color-primary', customization.colors.primary);
            const style = document.createElement('style');
            style.innerHTML = `
                .text-gold-500, .text-gold-400, .text-gold-600 { color: ${customization.colors.primary} !important; }
                .bg-gold-500, .bg-gold-600 { background-color: ${customization.colors.primary} !important; }
                .from-gold-600 { --tw-gradient-from: ${customization.colors.primary} !important; }
                .to-gold-500 { --tw-gradient-to: ${customization.colors.primary} !important; }
                
                .bg-navy-950 { background-color: ${customization.colors.accent} !important; }
            `;
            document.head.appendChild(style);
            // Cleanup function for style tag not strictly necessary for SPA root unless navigation away heavily
            // but good practice:
            // return () => { document.head.removeChild(style); }; 
        }

        // Favicon
        if (customization.favicon) {
            // Remove existing favicons to force update
            const existingFavicons = document.querySelectorAll("link[rel*='icon']");
            existingFavicons.forEach(el => el.remove());

            const link = document.createElement('link');
            // @ts-ignore
            link.type = 'image/png';
            // @ts-ignore
            link.rel = 'icon';
            // @ts-ignore
            link.href = `https://admin.peritoarielmiranda.com.br/assets/${customization.favicon}`;
            document.head.appendChild(link);
        }
    }, [customization]);

    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative overflow-x-hidden w-full">
            <SEOHeader {...seo} />
            <div className="bg-noise"></div>
            <Header logo={customization.logo} />
            <main className="flex-grow">
                <Hero data={hero} />
                <Stats data={stats} />
                <About data={about} />
                <Services data={services} />
                <Process data={processSteps} />
                <Testimonials data={differentials} />
                <FAQ data={faqs} />
                <ClientFeedback data={testimonials} />
                <CTA />
            </main>
            <Contact data={contactInfo} logo={customization.logo} />
        </div>
    );
}

export default LandingPage;
