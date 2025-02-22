const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 4000;

app.use(express.static("public"));

app.get("/stats", (req, res) => {
    const db = new sqlite3.Database("./data/active_proxies.db");
    db.all("SELECT * FROM proxies ORDER BY last_checked DESC LIMIT 100", (err, rows) => {
        res.json(rows);
    });
});

app.listen(port, () => console.log(`📊 Dashboard berjalan di http://localhost:${port}`));
