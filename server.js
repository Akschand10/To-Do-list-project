const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 5050;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", 
  database: "todolist",
  port: 8889, 
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Error:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.post("/register", (req, res) => {
  const username = req.body.username?.trim();

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  db.query(
    "INSERT INTO users (username) VALUES (?)",
    [username],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Username already exists" });
        }
        console.error("Register error:", err);
        return res.status(500).json({ error: "Server error" });
      }
      console.log("User registered:", username);
      res.status(200).json({ message: "User registered", userId: result.insertId });
    }
  );
});


// Login user
app.post("/login", (req, res) => {
  const username = req.body.username?.trim();

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  db.query(
    "SELECT * FROM users WHERE LOWER(username) = LOWER(?)",
    [username],
    (err, results) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid username" });
      }

      console.log("Login successful:", username);
      res.json({ userId: results[0].id, username: results[0].username });
    }
  );
});

app.get("/tasks/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT * FROM tasks WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching tasks:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    }
  );
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { title, description, status, user_id } = req.body;

  if (!title || !user_id) {
    return res.status(400).json({ error: "Title and user ID are required" });
  }

  db.query(
    "INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)",
    [title, description || '', status || 'pending', user_id],
    (err, result) => {
      if (err) {
        console.error("Error adding task:", err);
        return res.status(500).json({ error: "Failed to add task" });
      }
      res.status(200).json({ id: result.insertId });
    }
  );
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const { title, description, status } = req.body;

  db.query(
    "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
    [title, description, status, taskId],
    (err) => {
      if (err) {
        console.error("Error updating task:", err);
        return res.status(500).json({ error: "Failed to update task" });
      }
      res.sendStatus(200);
    }
  );
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  db.query("DELETE FROM tasks WHERE id = ?", [taskId], (err) => {
    if (err) {
      console.error("Error deleting task:", err);
      return res.status(500).json({ error: "Failed to delete task" });
    }
    res.sendStatus(200);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
