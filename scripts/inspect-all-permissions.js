import { createDirectus, rest, authentication, readPermissions, readFlows } from '@directus/sdk';

async function main() {
    console.log("=== Auditoria: Permissões e Fluxos (JS Filter) ===");

    const email = "admin@example.com";
    const password = "Perito2025Aa@";

    const client = createDirectus('https://admin.peritoarielmiranda.com.br')
        .with(authentication('json'))
        .with(rest());

    try {
        await client.login({ email, password });
        console.log("✅ Login realizado.");

        // 1. Check Permissions
        console.log("\n--- PERMISSÕES (messages) ---");
        const permissions = await client.request(readPermissions({
            filter: { collection: { _eq: 'messages' } },
            limit: 100
        }));

        permissions.forEach(p => {
            console.log(`ID: ${p.id} | Role: ${p.role ? p.role : 'NULL (Public)'} | Action: ${p.action} | Fields: ${JSON.stringify(p.fields)}`);
        });

        // 2. Check Flows (Fetch All and Filter JS)
        console.log("\n--- FLUXOS (messages) ---");
        const flows = await client.request(readFlows({
            limit: 100
        }));

        const messageFlows = flows.filter(f => {
            if (!f.options) return false;
            // Check collection in options or trigger
            // For Event triggers, collection is often in options.collection
            return (f.options.collection === 'messages');
        });

        if (messageFlows.length === 0) {
            console.log("Nenhum fluxo encontrado para 'messages'.");
        }

        messageFlows.forEach(f => {
            console.log(`ID: ${f.id} | Name: ${f.name} | Status: ${f.status} | Trigger: ${f.trigger}`);
            console.log(`Options: ${JSON.stringify(f.options)}`);
        });

    } catch (error) {
        console.error("Erro:", error);
    }
}

main();
