const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2008",
  database: "josei"
});

db.connect((err) => {
  if (err) {
    console.error("Koneksi gagal:", err);
    return;
  }

  console.log("MySQL terhubung!");
});

module.exports = db;