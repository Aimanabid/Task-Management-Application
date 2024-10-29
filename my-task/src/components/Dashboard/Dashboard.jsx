import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Import the CSS file for styling
import Sidebar from '../Sidebar/Sidebar';

const Dashboard = () => {
  const [task, setTask] = useState({ title: '', message: '', status: false });
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/read'); // Read tasks
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async () => {
    if (task.title && task.message) {
      try {
        const response = await fetch('http://localhost:5000/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });

        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setTask({ title: '', message: '', status: false }); // Reset form
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/deleteTask/${taskId}`, { // Use the new delete endpoint
        method: 'DELETE',
      });
      setTasks(tasks.filter(t => t._id !== taskId)); // Remove from state using taskId
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container-fluid">
    <div>
      <div className="row">
        <Sidebar/>
        <div className="col-10 main-content">
          <header className="header">
            <h3 className='text-center p-3 welcomeheading'>Welcome to the Task Management Dashboard</h3>
          </header>
          <div>
            <label htmlFor="title" className='form-label text-center w-75'>Task Title:</label>
            <input 
              id="title" 
              value={task.title} 
              onChange={(e) => setTask({ ...task, title: e.target.value })} 
              className='form-control border-dark w-100'
            />
            <label htmlFor="message" className='form-label text-center w-75 mt-2'>Task Message:</label>
            <textarea 
              id="message" 
              value={task.message} 
              onChange={(e) => setTask({ ...task, message: e.target.value })} 
              className='form-control border-dark w-100' 
             
            />
            <button className='btn btn-primary mt-2' onClick={handleAddTask}>Add Task</button>
          </div>
          <div className="task-list mt-4">
            <h4>Your Tasks Title:</h4>
            <ul className='list-group'>
              {tasks.map((t) => (
                <li key={t._id} className='list-group-item d-flex justify-content-between align-items-center'>
                  <span>
                    {t.title} 
                  </span>
                  <div>
                    <button className='btn btn-danger btn-sm ml-2' onClick={() => handleDeleteTask(t._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};


export default Dashboard;
