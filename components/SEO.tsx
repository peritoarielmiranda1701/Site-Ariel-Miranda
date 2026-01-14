
import React, { useEffect } from 'react';

interface SeoProps {
    data: {
        title?: string;
        description?: string;
        keywords?: string;
        ogTitle?: string;
        ogImage?: string;
    }
}

const SEO: React.FC<SeoProps> = ({ data }) => {
    useEffect(() => {
        if (data.title) {
            document.title = data.title;
        }

        if (data.description) {
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', data.description);
            } else {
                const meta = document.createElement('meta');
                meta.name = 'description';
                meta.content = data.description;
                document.head.appendChild(meta);
            }
        }

        if (data.keywords) {
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute('content', data.keywords);
            } else {
                const meta = document.createElement('meta');
                meta.name = 'keywords';
                meta.content = data.keywords;
                document.head.appendChild(meta);
            }
        }
    }, [data]);

    return null;
};

export default SEO;
