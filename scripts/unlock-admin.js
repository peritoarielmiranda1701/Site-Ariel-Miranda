
import { createDirectus, rest, authentication, updateRole } from '@directus/sdk';

const DIRECTUS_URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Perito2025Aa@';
const ROLE_ID = '5dabdd0f-0941-4e60-ae15-93279fb36da9';

async function unlock() {
    try {
        console.log('🔓 Attempting to unlock Admin role...');
        const client = createDirectus(DIRECTUS_URL).with(authentication()).with(rest());
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

        await client.request(updateRole(ROLE_ID, {
            admin_access: true,
            app_access: true
        }));

        console.log('✅ Success! Role updated. Admin should now have full access.');
    } catch (e) {
        console.error('❌ Failed to update role:', e);
    }
}

unlock();
