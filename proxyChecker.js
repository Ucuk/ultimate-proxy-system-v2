const fs = require("fs");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const { checkProxySpeed } = require("./aiAnalyzer");

const db = new sqlite3.Database("./data/active_proxies.db");

// Buat tabel kalau belum ada
db.run("CREATE TABLE IF NOT EXISTS proxies (ip TEXT, port INTEGER, type TEXT, speed INTEGER, score REAL, last_checked TIMESTAMP)");

// Fungsi cek proxy
async function checkProxy(proxy) {
    const [ip, port] = proxy.split(":");
    try {
        const start = Date.now();
        await axios.get("https://www.google.com", { proxy: { host: ip, port: parseInt(port) }, timeout: 5000 });
        const speed = Date.now() - start;
        const score = checkProxySpeed(speed);
        db.run("INSERT INTO proxies VALUES (?, ?, ?, ?, ?, datetime('now'))", [ip, port, "HTTP", speed, score]);
        return { ip, port, speed, score };
    } catch {
        return null;
    }
}

// Cek semua proxy
async function checkAllProxies() {
    const proxies = fs.readFileSync("./data/proxy_list.txt", "utf8").split("\n").filter(p => p.trim());
    const results = await Promise.all(proxies.map(checkProxy));
    console.log("✅ Proxy aktif tersimpan di database.");
}

checkAllProxies();
