import fs from 'fs';
import { Blob } from 'buffer';
// We will use native fetch for everything to debug the 404
// The SDK might be obscuring the path or error.

const BASE_URL = 'https://admin.peritoarielmiranda.com.br';

async function main() {
    console.log("=== Debug Auth & Storage (Native Fetch) ===");

    try {
        // 1. Test Ping/Health
        console.log(`1. Testing Health: ${BASE_URL}/server/health`);
        const healthRes = await fetch(`${BASE_URL}/server/health`);
        console.log(`Health Status: ${healthRes.status} ${healthRes.statusText}`);

        // 2. Login (Raw Fetch)
        console.log("\n2. Tentando Login via Fetch (POST /auth/login)...");
        const loginPayload = {
            email: "admin@example.com",
            password: "Perito2025Aa@"
        };

        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginPayload)
        });

        console.log(`Login Status: ${loginRes.status} ${loginRes.statusText}`);

        if (!loginRes.ok) {
            const errText = await loginRes.text();
            console.error("Login Body:", errText.substring(0, 500));
            return; // Stop if login fails
        }

        const loginData = await loginRes.json();
        const token = loginData.data?.access_token || loginData.data?.token; // Handle variations
        console.log("✅ Token recebido!");

        // 3. Upload File
        console.log("\n3. Uploading File...");
        const fileName = "debug_storage.txt";
        fs.writeFileSync(fileName, "Debug Content " + Date.now());

        // Native FormData in Node 18+
        const formData = new FormData();
        const fileBuffer = fs.readFileSync(fileName);
        const fileBlob = new Blob([fileBuffer], { type: 'text/plain' });
        formData.append('file', fileBlob, fileName);

        const uploadRes = await fetch(`${BASE_URL}/files`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }, // FormData boundary handling is automatic
            body: formData
        });

        console.log(`Upload Status: ${uploadRes.status}`);

        if (!uploadRes.ok) {
            console.error("Upload Error:", await uploadRes.text());
            return;
        }

        const uploadData = await uploadRes.json();
        const fileId = uploadData.data.id;
        console.log(`✅ File ID: ${fileId}`);

        // 4. Download File
        const downloadUrl = `${BASE_URL}/assets/${fileId}`;
        console.log(`\n4. Downloading: ${downloadUrl}`);
        const dlRes = await fetch(downloadUrl);

        if (dlRes.ok) {
            console.log("✅ Download OK! Status 200.");
            const content = await dlRes.text();
            console.log("Content Preview:", content.substring(0, 50));
            console.log(">>> STORAGE IS WORKING <<<");
        } else {
            console.error(`❌ Download Failed: ${dlRes.status}`);
            console.log(">>> STORAGE ACCESS ISSUE DETECTED <<<");
        }

        // 5. Cleanup (Optional, good practice)
        // await fetch(`${BASE_URL}/files/${fileId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });

    } catch (e) {
        console.error("Critical Error:", e);
    } finally {
        if (fs.existsSync("debug_storage.txt")) fs.unlinkSync("debug_storage.txt");
    }
}

main();
