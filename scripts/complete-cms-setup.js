
import { createDirectus, rest, authentication, createCollection, createField, readCollections, readFields, updateSingleton, readSingleton, createPermission, readPermissions } from '@directus/sdk';

const DIRECTUS_URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'ariel@peritoarielmiranda.com.br';
const ADMIN_PASSWORD = 'Cliente123!';

const client = createDirectus(DIRECTUS_URL).with(authentication()).with(rest());

async function setup() {
    try {
        console.log('🔌 Connecting...');
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
        console.log('✅ Authenticated');

        // --- 1. HERO STATS (Ensure text fields exist) ---
        console.log('\n--- Checking Hero Stats Fields ---');
        // We assume hero_stats collection exists (checked previously)
        const heroFields = await client.request(readFields('hero_stats'));
        const heroFieldNames = heroFields.map(f => f.field);

        const heroTextFields = [
            { field: 'title', type: 'string', meta: { interface: 'input', display: 'raw', width: 'full', note: 'Título Principal' } },
            { field: 'subtitle', type: 'string', meta: { interface: 'input', display: 'raw', width: 'full', note: 'Subtítulo' } },
            { field: 'cta_text', type: 'string', meta: { interface: 'input', display: 'raw', width: 'half', note: 'Texto do Botão' } }
        ];

        for (const f of heroTextFields) {
            if (!heroFieldNames.includes(f.field)) {
                console.log(`Creating field hero_stats.${f.field}...`);
                await client.request(createField('hero_stats', f));
            }
        }

        console.log('Populating Hero Data...');
        await client.request(updateSingleton('hero_stats', {
            title: 'Excelência Técnica a Serviço da Verdade',
            subtitle: 'Perito Ariel Miranda — Especialista em perícias judiciais e extrajudiciais.',
            cta_text: 'Solicitar Orçamento'
        }));


        // --- 2. ABOUT SECTION (Populate) ---
        console.log('\n--- Populating About Section ---');
        // Collection created in previous script. Just update content.
        await client.request(updateSingleton('about_section', {
            title: 'Perito Ariel Miranda',
            subtitle: 'Engenharia, Segurança & Forense Digital',
            text_1: 'No complexo cenário das perícias técnicas, o Perito Ariel Miranda se destaca pela precisão e imparcialidade de seus laudos.',
            text_2: 'Com atuação nacional e equipe multidisciplinar, somos referência em Engenharia Elétrica e Segurança do Trabalho.',
            badge_title: 'Perito Especialista',
            badge_subtitle: 'Atuação Nacional'
        }));


        // --- 3. SEO CONFIG (Create & Populate) ---
        console.log('\n--- Setting up SEO Config ---');
        try {
            await client.request(readSingleton('seo_config'));
            console.log('✅ "seo_config" already exists.');
        } catch (e) {
            console.log('Creating "seo_config" singleton...');
            await client.request(createCollection({
                collection: 'seo_config',
                schema: {},
                meta: { singleton: true, hidden: false, icon: 'search', note: 'Configurações de SEO' }
            }));
        }

        const seoFields = await client.request(readFields('seo_config')).catch(() => []);
        const seoFieldNames = seoFields.map(f => f.field);

        const seoSchema = [
            { field: 'site_title', type: 'string', meta: { interface: 'input', width: 'full', note: 'Título do Site (<title>)' } },
            { field: 'site_description', type: 'text', meta: { interface: 'textarea', width: 'full', note: 'Meta Description' } },
            // { field: 'og_image', type: 'uuid', meta: { interface: 'file-image', width: 'half', note: 'Imagem de Compartilhamento' } } // Skipping image for now
        ];

        for (const f of seoSchema) {
            if (!seoFieldNames.includes(f.field)) {
                console.log(`Creating field seo_config.${f.field}...`);
                await client.request(createField('seo_config', f));
            }
        }

        console.log('Populating SEO Data...');
        await client.request(updateSingleton('seo_config', {
            site_title: 'Perito Ariel Miranda | Engenharia e Perícias',
            site_description: 'Perito Judicial e Assistente Técnico. Engenharia Elétrica, Segurança do Trabalho, Forense Digital e Cálculos Trabalhistas. Atendimento Nacional 24h.'
        }));

        // --- 4. Permissions for SEO ---
        // Try to grant public read (might fail as before, but worth trying for consistency)
        // Authenticated user (Ariel) should have access since he created fields? No, Ariel is admin-ish.
        // We'll leave permissions as is, assuming Ariel can read what he created.

        console.log('✅ Content Migration Complete!');

    } catch (e) {
        console.error('❌ Error during content setup:', e);
    }
}

setup();
