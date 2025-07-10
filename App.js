import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Login from "./login";
import Register from "./Register";

const API_URL = "http://localhost:5050/tasks";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [showRegister, setShowRegister] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", id: null });

  const fetchTasks = async () => {
    try {
      if (userId) { 
        const res = await axios.get(`${API_URL}/${userId}`);
        setTasks(res.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Task title cannot be empty.");
      return;
    }
    try {
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, { ...form, user_id: userId });
      } else {
        await axios.post(API_URL, {
          ...form,
          status: "in_progress",
          user_id: userId,
        });
      }
      setForm({ title: "", description: "", id: null }); 
      fetchTasks(); 
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save task. Please try again.");
    }
  };

  const handleEdit = (task) => {
    setForm(task);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === "completed" ? "in_progress" : "completed";
      await axios.put(`${API_URL}/${task.id}`, {
        ...task,
        status: newStatus,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    setTasks([]); 
  };

  if (!userId) {
    return showRegister ? (
      <Register
        onRegister={(id) => setUserId(id)}
        switchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={(id) => setUserId(id)}
        switchToRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="app-container"> 
      <div className="app">
        <button onClick={handleLogout} className="logout-button"> 
          Logout
        </button>
        <h2>Task Manager</h2>

        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit">{form.id ? "Update" : "Add"} Task</button>
        </form>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.status === "completed" ? "done" : ""}>
              <div>
                <strong>{task.title}</strong> <br />
                <span>{task.description}</span>
              </div>
              <div className="actions">
                <button onClick={() => handleToggleStatus(task)}>
                  {task.status === "completed" ? "Mark In Progress" : "Mark Completed"}
                </button>
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
