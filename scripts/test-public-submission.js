import { createDirectus, rest, uploadFiles, createItem } from '@directus/sdk';

async function main() {
    console.log("=== Testando Submissão Pública (Simulando Frontend) ===");

    // Public Client (No Auth)
    const client = createDirectus('https://admin.peritoarielmiranda.com.br').with(rest());

    try {
        console.log("1. Tentando Upload de Arquivo como Público...");
        // Create a dummy file object (Blob/Buffer simulation)
        const fileContent = "Teste de anexo público";
        const file = new Blob([fileContent], { type: 'text/plain' });

        const formData = new FormData();
        formData.append('file', file, 'teste_publico.txt');

        const uploadResult = await client.request(uploadFiles(formData));
        console.log(`✅ Upload realizado! ID: ${uploadResult.id}`);

        console.log("2. Teste: Criar Mensagem SEM Anexo...");
        const payloadNoAttach = {
            name: "Teste Sem Anexo",
            email: "teste@noattach.com",
            phone: "11999999999",
            subject: "Teste Sem Anexo",
            message: "Teste básico de permissão."
        };
        try {
            const msgNoAttach = await client.request(createItem('messages', payloadNoAttach));
            console.log(`✅ Mensagem SEM anexo criada! ID: ${msgNoAttach.id}`);
        } catch (e) {
            console.error("❌ FALHA AO CRIAR SEM ANEXO:", e.errors || e.message);
        }

        console.log("3. Teste: Criar Mensagem COM Anexo...");
        const payload = {
            name: "Teste Script Público",
            email: "teste@script.com",
            phone: "11999999999",
            subject: "Teste Script Debug 403",
            message: "Essa é uma mensagem de teste do script.",
            attachment: uploadResult.id // Linking the file
        };

        const msgResult = await client.request(createItem('messages', payload));
        console.log(`✅ Mensagem criada com sucesso! ID: ${msgResult.id}`);

    } catch (error) {
        console.error("\n❌ ERRO NA SUBMISSÃO PÚBLICA:", error);
        if (error.errors) {
            console.error("Detalhes da API:", JSON.stringify(error.errors, null, 2));
        }
    }
}

// Node.js doesn't have native Blob/FormData in global scope for some versions, 
// using simple workaround or implying environment supports it (v18+).
// If needed, we can mock it, but Directus SDK expects FormData.
// Let's rely on Node 18+ valid globals.

main();
