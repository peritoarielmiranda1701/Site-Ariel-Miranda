
import { createDirectus, rest, authentication, createField } from '@directus/sdk';

const directus = createDirectus('https://admin.peritoarielmiranda.com.br')
    .with(authentication())
    .with(rest());

async function run() {
    try {
        // Use admin credentials to modify schema
        await directus.login({ email: 'admin@example.com', password: 'Perito2025Aa@' });
        console.log('Authenticated as Admin.');

        console.log('Adding site_favicon field...');
        await directus.request(createField('Informacoes_Gerais', {
            field: 'site_favicon',
            type: 'uuid',
            meta: {
                interface: 'file-image',
                special: ['file'],
                note: 'Ícone que aparece na aba do navegador (Favicon)'
            },
            schema: {
                is_nullable: true
            }
        }));

        console.log('✅ Success: site_favicon field created!');

    } catch (error) {
        if (error.errors?.[0]?.extensions?.code === 'FIELD_DUPLICATE') {
            console.log('Field already exists.');
        } else {
            console.error('❌ Error adding field:', error);
        }
    }
}

run();
