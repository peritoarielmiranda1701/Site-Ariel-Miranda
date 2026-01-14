
import { createDirectus, rest, readSingleton } from '@directus/sdk';

const directus = createDirectus('https://admin.peritoarielmiranda.com.br')
    .with(rest());

async function run() {
    console.log('Testing Public Access to Informacoes_Gerais...');
    try {
        const data = await directus.request(readSingleton('Informacoes_Gerais'));
        console.log('✅ Access Successful!');
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('❌ Access Failed:', error.errors || error.message || error);
    }
}

run();
