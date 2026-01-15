import React, { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogTitle?: string;
}

const SEOHeader = ({ title, description, keywords, ogImage, ogTitle }: SEOProps) => {
    useEffect(() => {
        // --- Title ---
        if (title) {
            document.title = title;
        }

        // --- Meta Tags Helper ---
        const setMeta = (name: string, content: string) => {
            if (!content) return;
            let element = document.querySelector(`meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        const setOg = (property: string, content: string) => {
            if (!content) return;
            let element = document.querySelector(`meta[property="${property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', property);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // --- Apply Metas ---
        setMeta('description', description || '');
        setMeta('keywords', keywords || '');

        // --- Open Graph (Facebook/WhatsApp) ---
        setOg('og:title', ogTitle || title || '');
        setOg('og:description', description || '');
        setOg('og:type', 'website');
        setOg('og:url', window.location.href);
        setOg('og:site_name', 'Perito Ariel Miranda');

        if (ogImage) {
            // Ensure full URL if it's just an ID
            const imageUrl = ogImage.startsWith('http')
                ? ogImage
                : `https://admin.peritoarielmiranda.com.br/assets/${ogImage}`;

            setOg('og:image', imageUrl);
            setOg('og:image:secure_url', imageUrl); // HTTPS preference
            setOg('og:image:width', '1200'); // Standard preview size guide
            setOg('og:image:height', '630');

            // Twitter Card
            setMeta('twitter:card', 'summary_large_image');
            setMeta('twitter:title', ogTitle || title || '');
            setMeta('twitter:description', description || '');
            setMeta('twitter:image', imageUrl);
        } else {
            // Fallback for Twitter if no image
            setMeta('twitter:card', 'summary');
            setMeta('twitter:title', ogTitle || title || '');
            setMeta('twitter:description', description || '');
        }

    }, [title, description, keywords, ogImage, ogTitle]);

    return null; // Logic only, no visible UI
};

export default SEOHeader;
