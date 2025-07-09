import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5050/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", id: null });

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, form);
      } else {
        await axios.post(API_URL, { ...form, status: "in_progress" });
      }
      setForm({ title: "", description: "", id: null });
      fetchTasks();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (task) => {
    setForm(task);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
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
    }
  };

  return (
    <div className="app">
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
          placeholder="Description"
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
  );
}

export default App;
