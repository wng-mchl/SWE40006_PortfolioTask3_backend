require('dotenv').config();
const express = require("express");
const cors = require("cors");
const APP_NAME = process.env.APP_NAME || "Finance API"; 
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

let transactions = []; // temporary storage

app.get('/health', (req, res) => {
  res.send(`${APP_NAME} up. Server live.`)
})

// GET all transactions
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

// POST new transaction
app.post("/transactions", (req, res) => {
  const newTransaction = req.body;
  transactions.push(newTransaction);
  res.json(newTransaction);
});

// DELETE transaction
app.delete("/transactions/:id", (req, res) => {
  const id = parseInt(req.params.id);
  transactions = transactions.filter(t => t.id !== id);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

