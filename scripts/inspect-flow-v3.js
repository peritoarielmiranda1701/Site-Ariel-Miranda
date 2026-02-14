import { createDirectus, rest, authentication, readFlows, readOperations } from '@directus/sdk';

async function main() {
    console.log("=== Inspecionando Fluxo V3 (Atual) ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });

        const flows = await client.request(readFlows({
            filter: {
                name: { _contains: 'Notificação de Nova Mensagem (v3)' }
            }
        }));

        if (flows.length === 0) {
            console.log("❌ Fluxo V3 não encontrado!");
            return;
        }

        const flow = flows[0];
        console.log(`\nFluxo: ${flow.name} (${flow.id})`);
        console.log(`User: ${flow.user}`);
        console.log(`Trigger Options:`, JSON.stringify(flow.options));

        const operations = await client.request(readOperations({
            filter: {
                flow: { _eq: flow.id }
            }
        }));

        console.log("\n--- OPERAÇÕES ---");
        operations.forEach(op => {
            console.log(`\nOp: ${op.name} (${op.key}) - Type: ${op.type}`);
            if (op.key === 'send_email') {
                console.log("📧 CONFIGURAÇÃO DE EMAIL:");
                console.log("To:", op.options.to);
                console.log("Has Attachment Field?", !!op.options.attachments);
                console.log("Attachment Value:", JSON.stringify(op.options.attachments));
            } else if (op.key === 'read_file') {
                console.log("📂 READ FILE OPTIONS:");
                console.log(JSON.stringify(op.options));
            }
        });

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
