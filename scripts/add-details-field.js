import { createDirectus, rest, authentication, createField, readFields } from '@directus/sdk';

const URL = 'https://admin.peritoarielmiranda.com.br';
const EMAIL = 'admin@example.com';
const PASSWORD = 'Perito2025Aa@';

const client = createDirectus(URL).with(authentication()).with(rest());

async function addField() {
    console.log(`🔌 Conectando como Admin...`);
    try {
        await client.login({ email: EMAIL, password: PASSWORD }, { mode: 'json' });
        console.log('✅ Login realizado!');

        const collection = 'services';
        const fieldName = 'details';

        console.log(`🔍 Verificando campo '${fieldName}' em '${collection}'...`);

        try {
            const fields = await client.request(readFields(collection));
            const exists = fields.find(f => f.field === fieldName);

            if (exists) {
                console.log(`ℹ️  Campo '${fieldName}' já existe.`);
                return;
            }
        } catch (e) {
            console.log("Erro ao ler campos (pode ser que coleção não exista?)", e.message);
        }

        console.log(`🆕 Criando campo '${fieldName}'...`);
        await client.request(createField(collection, {
            field: fieldName,
            type: 'text',
            meta: {
                interface: 'input-multiline',
                display: 'raw',
                width: 'full',
                note: 'Descrição detalhada para o modal (Rich Text opcional, aqui multiline)',
                label: 'Detalhes / Descrição Completa'
            }
        }));

        console.log(`✅ Campo '${fieldName}' criado com sucesso!`);

    } catch (e) {
        console.error("❌ Erro:", e.message);
        if (e.errors) console.error(JSON.stringify(e.errors, null, 2));
    }
}

addField();
