import { createDirectus, rest, readCollections, authentication } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const EMAIL = 'admin@example.com';
const PASSWORD = 'Perito2025Aa@';

const client = createDirectus(URL).with(authentication()).with(rest());

async function list() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: EMAIL, password: PASSWORD }, { mode: 'json' });
        console.log('✅ Login realizado!');

        console.log("🔍 Listando coleções...");
        const collections = await client.request(readCollections());
        console.log("📂 Coleções encontradas:");
        collections.forEach(c => {
            // Only show user collections
            if (!c.collection.startsWith('directus_')) {
                console.log(`   - "${c.collection}" (Type: ${c.meta?.singleton ? 'Singleton' : 'List'})`);
            }
        });
    } catch (e) {
        console.error("❌ Erro ao listar:", e.message);
    }
}

list();
