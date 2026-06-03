const express = require("express");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || "josei_secret_key";

app.use(cors());
app.use(express.json());

// ================== HOME ==================
app.get("/", (req, res) => {
  res.send("JOSEI Backend Aktif 🚀");
});

// ================== PRODUCTS ==================
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post("/products", (req, res) => {
  const { nama, harga, gambar } = req.body;

  db.query(
    "INSERT INTO products (nama, harga, gambar) VALUES (?, ?, ?)",
    [nama, harga, gambar],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Produk berhasil ditambahkan",
        id: result.insertId
      });
    }
  );
});

// ================== REGISTER ==================
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, provider) VALUES (?, ?, ?, 'local')",
    [name, email, hash],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "User berhasil dibuat" });
    }
  );
});

// ================== LOGIN ==================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const user = results[0];

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user
    });
  });
});

// ================== CHECKOUT (FIXED POSITION) ==================
app.post("/checkout", (req, res) => {
  const { nama, alamat, total } = req.body;

  db.query(
    "INSERT INTO orders (nama, alamat, total) VALUES (?, ?, ?)",
    [nama, alamat, total],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Checkout berhasil",
        order_id: result.insertId
      });
    }
  );
});

// ================== START SERVER ==================
app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});