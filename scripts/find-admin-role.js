
import { createDirectus, rest, authentication, readRoles } from '@directus/sdk';

const DIRECTUS_URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';

async function listRoles() {
    try {
        const client = createDirectus(DIRECTUS_URL).with(authentication()).with(rest());
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

        console.log('Reading roles...');
        const roles = await client.request(readRoles({
            fields: ['id', 'name', 'admin_access', 'app_access']
        }));

        console.table(roles);
    } catch (e) {
        console.error(e);
    }
}

listRoles();
