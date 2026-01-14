
import { createDirectus, rest, authentication, createPermission, readPermissions, updatePermission } from '@directus/sdk';

const directus = createDirectus('https://admin.peritoarielmiranda.com.br')
    .with(authentication())
    .with(rest());

async function run() {
    try {
        await directus.login({ email: 'admin@example.com', password: 'Perito2025Aa@' });
        console.log('Authenticated for Permission Check.');

        // Check existing permissions for Public (role = null) on Informacoes_Gerais
        const existing = await directus.request(readPermissions({
            filter: {
                role: { _null: true },
                collection: { _eq: 'Informacoes_Gerais' }
            }
        }));

        if (existing.length > 0) {
            console.log('Permission already exists. ID:', existing[0].id);
            console.log('Current Fields:', existing[0].fields);

            if (existing[0].fields !== '*' && !existing[0].fields.includes('primary_color')) {
                console.log('Updating permission to include all fields (*)...');
                await directus.request(updatePermission(existing[0].id, {
                    fields: ['*']
                }));
                console.log('Updated to *');
            } else {
                console.log('Permission fields look correct (either * or specific list). Force updating to * just in case...');
                await directus.request(updatePermission(existing[0].id, {
                    fields: ['*']
                }));
                console.log('Forced update to * completed.');
            }
        } else {
            console.log('Creating Public Read Permission for Informacoes_Gerais...');
            await directus.request(createPermission({
                role: null,
                collection: 'Informacoes_Gerais',
                action: 'read',
                fields: ['*']
            }));
            console.log('Created!');
        }

        // --- CHECK FILES PERMISSION ---
        const existingFiles = await directus.request(readPermissions({
            filter: {
                role: { _null: true },
                collection: { _eq: 'directus_files' }
            }
        }));

        if (existingFiles.length > 0) {
            console.log('Public Read for directus_files already exists.');
        } else {
            console.log('Creating Public Read Permission for directus_files...');
            await directus.request(createPermission({
                role: null,
                collection: 'directus_files',
                action: 'read',
                fields: ['*']
            }));
            console.log('Granted Public Read to Files!');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

run();
