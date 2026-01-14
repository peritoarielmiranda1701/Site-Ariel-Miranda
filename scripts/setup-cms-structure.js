
import { createDirectus, rest, authentication, staticToken, createCollection, createField, readCollections, readFields, updatePermission, createPermission, readRoles, readPermissions } from '@directus/sdk';

const DIRECTUS_URL = 'https://admin.peritoarielmiranda.com.br';
const ADMIN_EMAIL = 'ariel@peritoarielmiranda.com.br';
const ADMIN_PASSWORD = 'Cliente123!';

const client = createDirectus(DIRECTUS_URL).with(authentication()).with(rest());

async function setupStructure() {
    try {
        console.log('🔌 Connecting to Directus...');
        await client.login({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
        console.log('✅ Authenticated as Admin');

        // --- 1. Check/Create about_section Singleton ---
        console.log('\n--- Checking "about_section" ---');
        const collections = await client.request(readCollections());
        const aboutExists = collections.some(c => c.collection === 'about_section');

        if (!aboutExists) {
            console.log('⚠️ "about_section" missing. Creating...');
            await client.request(createCollection({
                collection: 'about_section',
                meta: {
                    hidden: false,
                    singleton: true,
                    icon: 'person',
                    note: 'Conteúdo da seção Sobre / Quem Sou',
                    display_template: '{{title}}'
                },
                schema: {} // managed by directus
            }));
            console.log('✅ "about_section" created.');
        } else {
            console.log('✅ "about_section" already exists.');
        }

        // --- 2. Ensure Fields in about_section ---
        const aboutFieldsToCheck = [
            { field: 'title', type: 'string', interface: 'input', width: 'half' },
            { field: 'subtitle', type: 'string', interface: 'input', width: 'half' },
            { field: 'text_1', type: 'text', interface: 'input-multiline', width: 'full' },
            { field: 'text_2', type: 'text', interface: 'input-multiline', width: 'full' },
            { field: 'image', type: 'uuid', interface: 'file-image', width: 'half', note: 'Foto do Perito' }, // Correct type for file relation is uuid usually, but let's check
            { field: 'badge_title', type: 'string', interface: 'input', width: 'half' },
            { field: 'badge_subtitle', type: 'string', interface: 'input', width: 'half' },
        ];

        const existingAboutFields = await client.request(readFields('about_section')).catch(() => []);

        for (const f of aboutFieldsToCheck) {
            if (!existingAboutFields.some(ef => ef.field === f.field)) {
                console.log(`➕ Adding field "${f.field}" to about_section...`);
                // For image, we need a special relation field, but for simplicity in directus sdk script we might just create standard fields. 
                // However, for image upload to work, it really should be a relation to directus_files.
                // Let's create it as a simple string first if we are unsure, but ideally it is a uuid.
                // Actually Directus requires specific createField payload.

                if (f.field === 'image') {
                    await client.request(createField('about_section', {
                        field: 'image',
                        type: 'uuid',
                        schema: {
                            is_nullable: true,
                        },
                        meta: {
                            interface: 'file-image',
                            special: ['file'] // This marks it as a file
                        }
                    }));
                } else {
                    await client.request(createField('about_section', {
                        field: f.field,
                        type: f.type,
                        meta: {
                            interface: f.interface,
                            width: f.width,
                            note: f.note
                        }
                    }));
                }
                console.log(`   ✅ Added ${f.field}`);
            }
        }

        // --- 3. ensure hero_bg in hero_stats ---
        console.log('\n--- Checking "hero_stats" for hero_bg ---');
        const heroFields = await client.request(readFields('hero_stats'));
        if (!heroFields.some(f => f.field === 'hero_bg')) {
            console.log('➕ Adding "hero_bg" to hero_stats...');
            await client.request(createField('hero_stats', {
                field: 'hero_bg',
                type: 'uuid',
                schema: { is_nullable: true },
                meta: {
                    interface: 'file-image',
                    special: ['file']
                }
            }));
            console.log('✅ Added hero_bg');
        } else {
            console.log('✅ "hero_bg" already exists.');
        }


        // --- 4. PERMISSIONS ---
        try {
            console.log('\n--- Updating Permissions ---');
            const roles = await client.request(readRoles());
            const targetRoles = roles.filter(r => ['Editor', 'Cliente', 'Gestor'].includes(r.name));

            async function robustGrant(roleId, collection, action = 'read') {
                const roleFilter = roleId ? { _eq: roleId } : { _null: true };
                try {
                    const permissions = await client.request(readPermissions({
                        filter: {
                            role: roleFilter,
                            collection: { _eq: collection },
                            action: { _eq: action }
                        }
                    }));
                    if (permissions.length === 0) {
                        console.log(`granting ${action} on ${collection} to ${roleId || 'Public'}`);
                        await client.request(createPermission({
                            role: roleId,
                            collection: collection,
                            action: action,
                            fields: ['*']
                        }));
                        console.log(`   ✅ Granted ${action} on ${collection} to ${roleId || 'Public'}`);
                    } else {
                        console.log(`Permission ${action} on ${collection} exists for ${roleId || 'Public'}.`);
                    }
                } catch (e) {
                    console.warn(`⚠️ Error managing perm for ${collection} ${action} ${roleId}. Ignored.`, e.errors || e);
                }
            }

            // Grant permissions
            await robustGrant(null, 'about_section', 'read');
            await robustGrant(null, 'hero_stats', 'read'); // This will just check existence

            for (const r of targetRoles) {
                console.log(`Configuring permissions for role: ${r.name}`);
                await robustGrant(r.id, 'about_section', 'read');
                await robustGrant(r.id, 'about_section', 'update');
                await robustGrant(r.id, 'hero_stats', 'update');
            }
        } catch (permError) {
            console.error("❌ Permission setup block failed completely:", permError);
        }

        console.log('\n✅ Structure Setup Complete!');
    } catch (error) {
        console.error('❌ Error during setup:', error);
    }
}

setupStructure();
