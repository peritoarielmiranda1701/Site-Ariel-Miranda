
import { createDirectus, rest, readFiles } from '@directus/sdk';

const directus = createDirectus('https://admin.peritoarielmiranda.com.br')
    .with(rest());

async function run() {
    console.log('Testing Public Access to directus_files...');
    try {
        const files = await directus.request(readFiles({ limit: 1 }));
        console.log('✅ Access Successful!');
        console.log('Files Found:', files.length);
    } catch (error) {
        console.error('❌ Access Failed:', error.errors || error.message || error);
    }
}

run();
