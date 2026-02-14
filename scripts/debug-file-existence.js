import { createDirectus, rest, authentication, readItem } from '@directus/sdk';

async function main() {
    console.log("=== Debugging Arquivo Específico ===");

    const fileId = "c16d8a60-af49-4c64-841d-f8acecd38070"; // ID from user screenshot
    console.log(`Buscando Arquivo ID: ${fileId}`);

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });

        try {
            const file = await client.request(readItem('directus_files', fileId));
            console.log("✅ Arquivo encontrado!");
            console.log("Nome:", file.filename_download);
            console.log("Tipo:", file.type);
            console.log("Tamanho:", file.filesize);
            console.log("Storage:", file.storage);
            console.log("URL:", `https://admin.peritoarielmiranda.com.br/assets/${file.id}`);
        } catch (e) {
            console.error("❌ Arquivo NÃO encontrado ou inacessível:", e.errors || e.message);
        }

    } catch (error) {
        console.error("Erro Geral:", error);
    }
}

main();
