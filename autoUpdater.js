const fs = require("fs");
const axios = require("axios");
const cron = require("node-cron");
const express = require("express");

const app = express();
const PORT = 5000; // API Scraper Port
const outputFile = "./data/proxy_list.txt";

const proxySources = [
    "https://www.proxy-list.download/api/v1/get?type=http",
    "https://www.proxy-list.download/api/v1/get?type=https",
    "https://www.proxy-list.download/api/v1/get?type=socks4",
    "https://www.proxy-list.download/api/v1/get?type=socks5",
    "https://spys.me/proxy.txt",
    "https://free-proxy-list.net/",
    "https://www.proxyscrape.com/free-proxy-list",
    "https://hidemy.name/en/proxy-list/"
];

// Fungsi untuk scrape semua sumber
async function fetchProxies() {
    let proxies = new Set();
    for (const url of proxySources) {
        try {
            const res = await axios.get(url);
            res.data.split("\n").forEach(proxy => proxies.add(proxy.trim()));
        } catch (err) {
            console.log(`❌ Gagal fetch dari ${url}`);
        }
    }
    fs.writeFileSync(outputFile, [...proxies].join("\n"));
    console.log(`✅ Proxy list diperbarui (${proxies.size} proxy tersimpan).`);
}

// Auto update tiap 30 menit
cron.schedule("*/30 * * * *", fetchProxies);

// API untuk scrape manual
app.get("/scrape", async (req, res) => {
    await fetchProxies();
    res.send({ message: "✅ Scrape berhasil!", total: fs.readFileSync(outputFile, "utf8").split("\n").length });
});

// API untuk akses proxy langsung
app.get("/proxies", (req, res) => {
    res.sendFile(outputFile, { root: "." });
});

// Jalankan API Scraper
app.listen(PORT, () => console.log(`🔥 Scraper API berjalan di http://localhost:${PORT}`));

fetchProxies();
