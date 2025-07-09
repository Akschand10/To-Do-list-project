# NodeandReactproject
Task Manager App
A full-stack Task Manager built with **React.js**, **Node.js**, **Express**, and **MySQL**.  
Allows users to create, update, mark as completed/in progress, and delete tasks.

---

Features
- Add new tasks
- Edit task title and description
- Toggle task status between `in_progress` and `completed`
- Delete tasks
- Stores data in MySQL with persistent backend

---

Technologies Used

Frontend        Backend             Database 

React.js        Node.js             MySQL    
Axios (API)     Express.js                
CSS             CORS, BodyParser         

---

Create a database and table in phpMyAdmin:

CREATE DATABASE task_db;

USE task_db;

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'in_progress'
);

