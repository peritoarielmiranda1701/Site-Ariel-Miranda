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

    // Inject Custom Colors
    React.useEffect(() => {
        if (customization.colors.primary) {
            document.documentElement.style.setProperty('--color-primary', customization.colors.primary);
            // We might need to map this to Tailwind if we can't update config. 
            // Since we can't easily find tailwind config, we will assume standard classes are used 
            // but we can override specific sensitive elements or use style tags.

            // Actually, let's try to override the specific gold/navy vars if they existed as CSS vars. 
            // But they likely don't.
            // A robust way without rebuilding is to inject a <style> tag.
            const style = document.createElement('style');
            style.innerHTML = `
                .text-gold-500, .text-gold-400, .text-gold-600 { color: ${customization.colors.primary} !important; }
                .bg-gold-500, .bg-gold-600 { background-color: ${customization.colors.primary} !important; }
                .from-gold-600 { --tw-gradient-from: ${customization.colors.primary} !important; }
                .to-gold-500 { --tw-gradient-to: ${customization.colors.primary} !important; }
                
                .bg-navy-950 { background-color: ${customization.colors.accent} !important; }
            `;
            if (customization.colors.primary || customization.colors.accent) {
                document.head.appendChild(style);
                return () => { document.head.removeChild(style); };
            }
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
