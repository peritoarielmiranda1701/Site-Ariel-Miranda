
import { createDirectus, rest, authentication, readMe, readRole, readSingleton } from '@directus/sdk';

const DIRECTUS_URL = 'https://admin.peritoarielmiranda.com.br';

async function diagnose(email, password) {
    console.log(`\n🔍 Diagnosing ${email}...`);
    try {
        const client = createDirectus(DIRECTUS_URL).with(authentication()).with(rest());
        await client.login({ email, password });
        const me = await client.request(readMe());
        console.log(`User ID: ${me.id}`);
        console.log(`Role ID: ${me.role}`);

        if (me.role) {
            try {
                const role = await client.request(readRole(me.role, {
                    fields: ['name', 'admin_access', 'app_access']
                }));
                console.log('Role Details:', {
                    name: role.name,
                    admin_access: role.admin_access,
                    app_access: role.app_access
                });
            } catch (roleError) {
                console.error('❌ Could not read own role:', roleError.message);
            }
        } else {
            console.log('User has NO role (Public?) or is Super Admin');
        }

        console.log('Checking Content Access...');
        try {
            const about = await client.request(readSingleton('about_section'));
            console.log('✅ Read about_section:', about ? 'Success' : 'Empty');
        } catch (e) {
            console.error('❌ Failed to read about_section:', e.message || e.errors || e);
        }

        try {
            const hero = await client.request(readSingleton('hero_stats'));
            console.log('✅ Read hero_stats:', hero ? 'Success' : 'Empty');
        } catch (e) {
            console.error('❌ Failed to read hero_stats:', e.message);
        }

    } catch (e) {
        console.error('❌ Login failed or error:', e.message);
    }
}

async function run() {
    await diagnose('admin@example.com', 'Perito2025Aa@');
    await diagnose('ariel@peritoarielmiranda.com.br', 'Cliente123!');
}

run();
