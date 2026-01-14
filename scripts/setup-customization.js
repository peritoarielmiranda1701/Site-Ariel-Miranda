
import { createDirectus, rest, authentication, createField, readFields, updateSingleton } from '@directus/sdk';

const DIRECTUS_URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'ariel@peritoarielmiranda.com.br';
const ADMIN_PASSWORD = 'Cliente123!';

const client = createDirectus(DIRECTUS_URL).with(authentication()).with(rest());

async function setup() {
    try {
        console.log('🔌 Connecting...');
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
        console.log('✅ Authenticated');

        const COLLECTION = 'Informacoes_Gerais';
        console.log(`\n--- Checking Fields for ${COLLECTION} ---`);

        const existingFields = await client.request(readFields(COLLECTION));
        const existingFieldNames = existingFields.map(f => f.field);

        const newFields = [
            // Visual Identity
            { field: 'site_logo', type: 'uuid', meta: { interface: 'file-image', width: 'half', note: 'Logo do Site (Barra de Navegação)' } },
            { field: 'primary_color', type: 'string', meta: { interface: 'color', width: 'half', note: 'Cor Principal (Ex: #D4AF37)' } },
            { field: 'accent_color', type: 'string', meta: { interface: 'color', width: 'half', note: 'Cor de Destaque (Ex: #0F172A)' } },

            // Contact Settings
            { field: 'contact_email', type: 'string', meta: { interface: 'input', width: 'full', note: 'E-mail para receber mensagens do formulário' } }
        ];

        for (const f of newFields) {
            if (!existingFieldNames.includes(f.field)) {
                console.log(`Creating field ${f.field}...`);
                await client.request(createField(COLLECTION, f));
            } else {
                console.log(`Field ${f.field} already exists.`);
            }
        }

        console.log('\n--- Populating Default Values ---');
        // We do not want to overwrite if already set, but since we just created them...
        // directus defaults to null.
        // Let's set some sensible defaults if they are null.

        // Actually, updateSingleton merges.
        await client.request(updateSingleton(COLLECTION, {
            primary_color: '#D4AF37', // Gold
            accent_color: '#020617', // Navy-950
            contact_email: 'contato@peritoarielmiranda.com.br'
        }));

        console.log('✅ Customization Setup Complete!');

    } catch (e) {
        console.error('❌ Error:', e);
    }
}

setup();
