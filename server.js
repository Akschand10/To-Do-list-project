const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 5050;

app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",          
  password: "root",    
  database: "todolist",
  port: 8889             
});

db.connect(err => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Get all tasks
app.get("/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add task
app.post("/tasks", (req, res) => {
  const { title, description, status } = req.body;
  db.query(
    "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)",
    [title, description, status],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ id: result.insertId });
    }
  );
});

// Update task
app.put("/tasks/:id", (req, res) => {
  const { title, description, status } = req.body;
  db.query(
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
    [title, description, status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.sendStatus(200);
    }
  );
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  db.query("DELETE FROM tasks WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
