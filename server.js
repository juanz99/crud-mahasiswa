const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "database_kampus"
});

db.connect((err) => {
    if  (err) {
        console.error("Koneksi gagal:", err.message);
        return;
    }
    console.log("Terhubung ke database MySQL!");
});

app.get("/api/mahasiswa", (req, res) => {
    db.query("SELECT * FROM mahasiswa ORDER BY id DESC", (err, results) => {
        if (err) return res.status(500).json({
            success: false,
            message: err.message
        });
        res.json(results)
    });
});

app.post("/api/mahasiswa", (req, res) => {
    const {nim, nama, jurusan, email} = req.body;
    const sql = "INSERT INTO mahasiswa (nim, nama, jurusan, email) VALUES (?, ?, ?, ?)";
    db.query(sql, [nim, nama, jurusan, email], (err, results) => {
        if (err) return res.status(500).json({
            success: false,
            message: err.message
        });
        res.json({
            success: true,
            message: "Data mahasiswa berhasil ditambahkan",
            data: results
        });
    });
});

app.put("/api/mahasiswa/:id", (req, res) => {
    const {id} = req.params;
    const {nim, nama, jurusan, email} = req.body;
    const sql = "UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ?, email = ? WHERE id = ?";
    db.query(sql, [nim, nama, jurusan, email, id], (err, results) => {
        if (err) return res.status(500).json({
            success: false,
            message: err.message
        });
        res.json({
            success: true,
            message: "Data mahasiswa berhasil diperbarui",
            data: results
        });
    });
});

app.delete("/api/mahasiswa/:id", (req, res) => {
    const {id} = req.params;
    db.query("DELETE FROM mahasiswa WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({
            success: false,
            message: err.message
        });
        res.json({
            success: true,
            message: "Data mahasiswa berhasil dihapus",
            data: results
        });
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});