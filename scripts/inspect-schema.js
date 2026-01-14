
import { createDirectus, rest, authentication, readFieldsByCollection, readSingleton } from '@directus/sdk';

const directus = createDirectus('https://admin.peritoarielmiranda.com.br')
    .with(authentication())
    .with(rest());

async function run() {
    try {
        await directus.login({ email: 'ariel@peritoarielmiranda.com.br', password: 'Cliente123!' });
        console.log('Authenticated.');

        console.log('--- Fields in Informacoes_Gerais ---');
        const fields = await directus.request(readFieldsByCollection('Informacoes_Gerais'));
        fields.forEach(f => {
            console.log(`- ${f.field} (Type: ${f.type})`);
        });

        console.log('\n--- Current Data in Informacoes_Gerais ---');
        const data = await directus.request(readSingleton('Informacoes_Gerais'));
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

run();
