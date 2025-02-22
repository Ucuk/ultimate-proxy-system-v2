const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const app = express();
const PORT = 3000;
const db = new sqlite3.Database("./data/active_proxies.db");

// Auto buat tabel kalau belum ada
db.run(`CREATE TABLE IF NOT EXISTS proxies (
    ip TEXT, port INTEGER, type TEXT, speed INTEGER, last_checked TIMESTAMP
)`);

// API untuk ambil proxy aktif
app.get("/proxy", (req, res) => {
    db.get("SELECT ip, port FROM proxies ORDER BY RANDOM() LIMIT 1", (err, row) => {
        if (row) res.json({ proxy: `${row.ip}:${row.port}` });
        else res.status(500).json({ error: "❌ Tidak ada proxy aktif" });
    });
});

// API untuk akses proxy dalam format TXT (bisa buat scraping orang lain 🤣)
app.get("/proxy-list", (req, res) => {
    db.all("SELECT ip, port FROM proxies", (err, rows) => {
        res.send(rows.map(row => `${row.ip}:${row.port}`).join("\n"));
    });
});

// API untuk upload proxy baru ke database (biar bisa sharing HAHA)
app.post("/add-proxy", express.json(), (req, res) => {
    const { ip, port, type, speed } = req.body;
    db.run("INSERT INTO proxies VALUES (?, ?, ?, ?, datetime('now'))", [ip, port, type, speed]);
    res.send({ message: "✅ Proxy ditambahkan!" });
});

app.listen(PORT, () => console.log(`🔥 Proxy Server berjalan di http://localhost:${PORT}`));
