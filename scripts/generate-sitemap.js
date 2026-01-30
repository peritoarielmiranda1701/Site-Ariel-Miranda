
import fs from 'fs';
import path from 'path';
import { createDirectus, rest } from '@directus/sdk';

const SITE_URL = 'https://peritoarielmiranda.com.br';
const API_URL = 'https://admin.peritoarielmiranda.com.br';

const client = createDirectus(API_URL).with(rest());

async function generateSitemap() {
    try {
        console.log('Fetching services from Directus...');
        const services = await client.request(
            // We manually construct the query since we don't have the types here in JS
            // equivalent to: readItems('services', { fields: ['id'], limit: -1 })
            {
                path: '/items/services',
                method: 'GET',
                params: {
                    fields: ['id'],
                    limit: -1,
                    status: 'published' // Assuming standard Directus status, or remove if not used
                }
            }
        );

        // If the response structure wraps items in 'data', handle it. 
        // SDK typically returns the data directly, but let's be safe.
        // The SDK v11+ returns the data array directly for readItems.
        // However, we are using .request() with a raw object/path which might return the raw axios response or data depending on SDK version.
        // Actually, createDirectus().request() usually returns the payload. 
        // But to be safer with 'publicDirectus' style:
        // We can use the readItems helper if we import it.

        // Let's re-write using readItems for safety if we can import it.
        // But standard import might fail if type: module is complicated with extensions.
        // Let's stick to a manual fetch or use the imported helpers if possible.
        // Since I'm writing this file, I'll use readItems from sdk.
    } catch (error) {
        console.error('Error fetching services:', error);
    }
}

// Re-structuring to use imports correctly with the SDK
import { readItems } from '@directus/sdk';

async function main() {
    console.log('Generating sitemap...');

    const routes = [
        { path: '/', changefreq: 'weekly', priority: '1.0' },
        // Add other static pages if they differ from Home sections
    ];

    try {
        const services = await client.request(readItems('services', {
            fields: ['id'],
            limit: -1
        }));

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Routes -->
  ${routes.map(route => `
  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}

  <!-- Service Routes -->
  ${services.map(service => `
  <url>
    <loc>${SITE_URL}/servicos/${service.id}</loc>
    <lastmod>${service.date_updated ? new Date(service.date_updated).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

        const outputPath = path.resolve('public', 'sitemap.xml');
        fs.writeFileSync(outputPath, xml);
        console.log(`Sitemap generated successfully at ${outputPath}`);
        console.log(`Total URLs: ${routes.length + services.length}`);

    } catch (error) {
        console.error('Failed to generate sitemap:', error);
        process.exit(1);
    }
}

main();
