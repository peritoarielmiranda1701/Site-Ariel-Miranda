import { createDirectus, rest, authentication, readOperations, updateOperation } from '@directus/sdk';

async function main() {
    console.log("=== Corretor de Fluxo do Directus (Automático) ===");

    // Credentials captured from previous user input
    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    console.log(`Conectando como: ${email}...`);

    // Initialize Client
    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        // FIX: Passing credentials as an OBJECT { email, password }
        // This time with CURLY BRACES!
        await client.login({ email, password });
        console.log("✅ Login realizado com sucesso!");

        console.log("Buscando operação de envio de e-mail...");

        // Check if readOperations is available or we need to use 'request'
        // SDK v11+ usage: client.request(readOperations(...))

        const operations = await client.request(readOperations({
            filter: {
                type: { _eq: 'mail' },
                key: { _eq: 'disparar_e_mail' }
            }
        }));

        if (operations.length === 0) {
            console.error("❌ ERRO: Não encontrei a operação 'disparar_e_mail'.");
            process.exit(1);
        }

        const operation = operations[0];
        console.log(`Operação encontrada: ${operation.name} (ID: ${operation.id})`);

        // Prepare update
        const currentOptions = operation.options || {};
        const newOptions = {
            ...currentOptions,
            attachments: "{{$trigger.payload.attachment}}" // THE FIX
        };

        console.log("Aplicando correção...");
        await client.request(updateOperation(operation.id, {
            options: newOptions
        }));

        console.log("\n✅ SUCESSO! A configuração foi atualizada via API.");
        console.log("Agora reinicie o container do Directus para garantir.");

    } catch (error) {
        console.error("\n❌ ERRO DETALHADO:", error);
        if (error.errors) {
            console.error("Erros da API:", JSON.stringify(error.errors, null, 2));
        }
        process.exit(1);
    }
}

main();
