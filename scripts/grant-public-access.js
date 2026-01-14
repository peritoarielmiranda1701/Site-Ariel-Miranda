
import { createDirectus, rest, authentication, createPermission, readPermissions, updatePermission } from '@directus/sdk';

const DIRECTUS_URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'ariel@peritoarielmiranda.com.br';
const ADMIN_PASSWORD = 'Cliente123!';

const client = createDirectus(DIRECTUS_URL).with(authentication()).with(rest());

async function grantPublicAccess() {
    try {
        console.log('🔌 Connecting...');
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
        console.log('✅ Authenticated');

        const collections = ['about_section', 'seo_config', 'hero_stats'];

        for (const collection of collections) {
            console.log(`\n🔍 Checking Public Read access for "${collection}"...`);

            // Public role is null. We look for permissions where role is null and collection is match
            const existing = await client.request(readPermissions({
                filter: {
                    role: { _null: true },
                    collection: { _eq: collection }
                }
            })).catch(e => {
                console.warn(`   ⚠️ Could not read permissions: ${e.message}`);
                return [];
            });

            if (existing && existing.length > 0) {
                console.log(`   ✅ Permission already exists for ${collection}.`);
                // Optional: Ensure it allows read?
                // skipping update for safety unless confirmed broken
            } else {
                console.log(`   🔸 Permission missing. Attempting to create...`);
                try {
                    await client.request(createPermission({
                        role: null,
                        collection: collection,
                        action: 'read',
                        permissions: {}, // Full access
                        fields: ['*']
                    }));
                    console.log(`   🎉 SUCCESS: Granted Public Read to ${collection}`);
                } catch (err) {
                    console.error(`   ❌ FAILED to grant permission: ${err.message}`);
                    if (err.errors) console.error('   Errors:', JSON.stringify(err.errors, null, 2));
                }
            }
        }

    } catch (e) {
        console.error('❌ Script failed:', e);
    }
}

grantPublicAccess();
