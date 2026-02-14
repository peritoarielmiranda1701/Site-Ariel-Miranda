import https from 'https';
import { Buffer } from 'buffer';

const HOST = 'admin.peritoarielmiranda.com.br';

function request(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: HOST,
            port: 443,
            path: path,
            method: method,
            headers: {
                'User-Agent': 'Node/TestScript'
            }
        };

        if (body) {
            options.headers['Content-Type'] = 'application/json';
            options.headers['Content-Length'] = Buffer.byteLength(body);
        }

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', (e) => reject(e));

        if (body) req.write(body);
        req.end();
    });
}

async function test() {
    console.log(`Testing Connectivity to ${HOST}...`);

    try {
        // 1. Root
        console.log("\n1. GET /");
        const root = await request('/');
        console.log(`Status: ${root.statusCode}`);
        // console.log(`Preview: ${root.body.substring(0, 50)}...`);

        // 2. Ping
        console.log("\n2. GET /server/ping");
        const ping = await request('/server/ping');
        console.log(`Status: ${ping.statusCode}`);
        console.log(`Body: ${ping.body}`);

        // 3. Auth
        console.log("\n3. POST /auth/login");
        const creds = JSON.stringify({ email: "admin@example.com", password: "Perito2025Aa@" });
        const login = await request('/auth/login', 'POST', creds);
        console.log(`Status: ${login.statusCode}`);
        if (login.statusCode !== 200) console.log(`Body: ${login.body.substring(0, 200)}`);

        if (login.statusCode === 200) {
            console.log("✅ AUTH WORKING via Node HTTPS");
        } else {
            console.log("❌ AUTH FAILED via Node HTTPS");
        }

    } catch (e) {
        console.error("FATAL NETWORK ERROR:", e);
    }
}

test();
