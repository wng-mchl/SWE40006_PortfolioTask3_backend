require('dotenv').config();
const express = require("express");
const cors = require("cors");
const APP_NAME = process.env.APP_NAME || "Finance API";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      name TEXT,
      amount FLOAT,
      type TEXT,
      date TEXT
    );
  `);
};

initDB();


app.get('/health', (req, res) => {
  res.send(`${APP_NAME} up. Server live.`)
})

// GET all transactions
app.get("/transactions", async (req, res) => {
  const result = await pool.query("SELECT * FROM transactions");
  res.json(result.rows);
});

// POST new transaction
app.post("/transactions", async (req, res) => {
  const { name, amount, type, date } = req.body;

  const result = await pool.query(
    "INSERT INTO transactions (name, amount, type, date) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, amount, type, date]
  );

  res.json(result.rows[0]);
});

// DELETE transaction
app.delete("/transactions/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  await pool.query("DELETE FROM transactions WHERE id = $1", [id]);

  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

