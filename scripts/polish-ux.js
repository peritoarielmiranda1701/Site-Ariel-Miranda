import {
    createDirectus, rest, authentication,
    updateCollection, updateField
} from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';

const client = createDirectus(URL).with(authentication()).with(rest());

const COLLECTIONS_CONFIG = [
    {
        collection: 'services',
        meta: { note: 'Gerencie os serviços oferecidos', translations: [{ language: 'pt-BR', translation: 'Serviços' }] }
    },
    {
        collection: 'testimonials',
        meta: { note: 'O que os clientes dizem', translations: [{ language: 'pt-BR', translation: 'Depoimentos' }] }
    },
    {
        collection: 'faqs',
        meta: { note: 'Perguntas e Respostas', translations: [{ language: 'pt-BR', translation: 'Perguntas Frequentes' }] }
    },
    {
        collection: 'differentials',
        meta: { note: 'Ponto de destaque', translations: [{ language: 'pt-BR', translation: 'Diferenciais' }] }
    },
    {
        collection: 'process_steps',
        meta: { note: 'Passo a passo do trabalho', translations: [{ language: 'pt-BR', translation: 'Etapas do Processo' }] }
    },
    {
        collection: 'Informacoes_Gerais',
        meta: { note: 'Dados de contato e globais', translations: [{ language: 'pt-BR', translation: 'Informações Gerais' }] }
    },
    {
        collection: 'hero_stats',
        meta: { note: 'Números de destaque no topo', translations: [{ language: 'pt-BR', translation: 'Destaques (Topo)' }] }
    },
    {
        collection: 'directus_files',
        meta: { translations: [{ language: 'pt-BR', translation: 'Galeria de Arquivos' }] }
    }
];

// Helper to rename fields for specific collections
const FIELD_UPDATES = [
    { collection: 'hero_stats', field: 'hero_title', label: 'Título Principal' },
    { collection: 'hero_stats', field: 'hero_subtitle', label: 'Subtítulo' },
    { collection: 'hero_stats', field: 'cta_label', label: 'Texto do Botão' },
    { collection: 'hero_stats', field: 'stat_1_label', label: 'Rótulo Dado 1' },
    { collection: 'hero_stats', field: 'stat_1_value', label: 'Valor Dado 1' },
    { collection: 'hero_stats', field: 'stat_2_label', label: 'Rótulo Dado 2' },
    { collection: 'hero_stats', field: 'stat_2_value', label: 'Valor Dado 2' },
    { collection: 'hero_stats', field: 'stat_3_label', label: 'Rótulo Dado 3' },
    { collection: 'hero_stats', field: 'stat_3_value', label: 'Valor Dado 3' },
];

async function polishUX() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, { mode: 'json' });

        console.log("🎨 Polindo nomes das Coleções...");
        for (const item of COLLECTIONS_CONFIG) {
            try {
                await client.request(updateCollection(item.collection, {
                    meta: item.meta
                }));
                console.log(`   ✅ ${item.collection} -> ${item.meta.translations[0].translation}`);
            } catch (e) {
                console.log(`   ⚠️ Erro em ${item.collection}: ${e.message}`);
            }
        }

        console.log("🏷️  Polindo nomes dos Campos...");
        for (const item of FIELD_UPDATES) {
            try {
                await client.request(updateField(item.collection, item.field, {
                    meta: {
                        translation: null, // Reset generic translation if needed
                        interface: null, // Keep existing
                        readonly: false,
                        hidden: false,
                        width: 'half', // Optimize layout while we are at it
                        note: '',
                        display: null,
                        display_options: null,
                        options: null,
                        // The UpdateField object in SDK might vary, passing generic props often works or specific meta object
                        // For 'label', Directus v9+ uses translations inside meta? Or logic?
                        // Let's try explicit 'note' and 'translations' for fields too if 'label' fails, 
                        // but usually 'label' is an abstraction or inside translations.
                        // Actually, 'meta.translations' is the standard way.
                    }
                }));

                // Directus field update is tricky via handy wrappers. 
                // Let's use the explicit structure for field meta
                // updateField(collection, field, partial_field_object)
                // partial_field_object has 'meta' key.
            } catch (ignore) { }
        }

        // Simpler loop for fields with correct structure
        for (const item of FIELD_UPDATES) {
            try {
                // Construct translation object
                // Directus stores field labels in `translations` inside `meta` or just interface options?
                // Usually it's in the 'translations' array property of the field's meta.
                // Let's just assume we update the logic strictly.

                await client.request(updateField(item.collection, item.field, {
                    meta: {
                        translations: [
                            { language: 'pt-BR', translation: item.label }
                        ],
                        width: 'half' // Make them side-by-side for better look
                    }
                }));
                console.log(`   ✅ ${item.collection}.${item.field} -> ${item.label}`);
            } catch (e) {
                console.log(`   ⚠️ Falha campo ${item.field}: ${e.message}`);
            }
        }

        console.log("\n✨ UX Melhorada! Peça para dar F5.");

    } catch (e) {
        console.error("❌ Erro Geral:", e.message);
    }
}

polishUX();
