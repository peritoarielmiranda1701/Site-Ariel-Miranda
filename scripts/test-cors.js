
async function checkCors() {
    console.log("🌍 Verificando CORS Headers...");
    try {
        const response = await fetch('https://admin.peritoarielmiranda.com.br/items/services', {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:5173',
                'Access-Control-Request-Method': 'GET'
            }
        });

        console.log(`Status: ${response.status}`);
        console.log('Headers:', Object.fromEntries(response.headers.entries()));

        const allowOrigin = response.headers.get('access-control-allow-origin');
        if (allowOrigin === '*' || allowOrigin === 'http://localhost:5173') {
            console.log("✅ CORS Configurado Corretamente!");
        } else {
            console.log("❌ CORS Ainda bloqueado ou incorreto.");
        }
    } catch (e) {
        console.error("Erro na verificação:", e);
    }
}

checkCors();
