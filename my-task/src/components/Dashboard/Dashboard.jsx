import React, { useState, useEffect } from 'react';
import './Dashboard.css'; // Import the CSS file for styling
import Sidebar from '../Sidebar/Sidebar';
import { toast, ToastContainer } from 'react-toastify';

const Dashboard = () => {
  const [task, setTask] = useState({ title: '', message: '', status: false });
  const [tasks, setTasks] = useState([]);
  const [taskCompletionStatus, setTaskCompletionStatus] = useState({}); // Track completion for each task

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from local storage
        const response = await fetch('http://localhost:5000/read', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token in the header
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Fetched tasks:', data); // Log the data to see the structure
        // Assuming your response is structured like { tasks: [...] }
        setTasks(Array.isArray(data) ? data : data.tasks || []); // Set to empty array if not an array

        // Check localStorage for task completion statuses
        const updatedStatus = {};
        data.forEach(task => {
          updatedStatus[task._id] = localStorage.getItem(`taskCompletedTime_${task._id}`) !== null;
        });
        setTaskCompletionStatus(updatedStatus); // Update completion status
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
        const token = localStorage.getItem('token'); // Get the token from local storage
        const response = await fetch('http://localhost:5000/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, // Pass the token in the header
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });

        if (!response.ok) {
          throw new Error('Failed to add task');
        }

        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setTask({ title: '', message: '', status: false }); // Reset form
      } catch (error) {
        console.error('Error adding task:', error);
      }
    } else {
      console.warn('Please provide both title and message for the task.');
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
      await fetch(`http://localhost:5000/deleteTask/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Pass the token in the header
        },
      });
      setTasks(tasks.filter(t => t._id !== taskId)); // Remove from state using taskId
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const startTaskTimer = async (taskId) => {
    toast.info('Task Started!');
    const token = localStorage.getItem('token'); // Get the token from local storage
    let result = await fetch(`http://localhost:5000/startTask/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`, // Pass the token in the header
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    const data = await result.json();
    if (data.startedAt) {
      const startTime = new Date(data.startedAt).toLocaleTimeString();
      console.log(startTime);
      localStorage.setItem(`taskStartTime_${taskId}`, startTime);
      setTaskCompletionStatus(prevState => ({
        ...prevState,
        [taskId]: false, // Mark this task as in progress
      }));
    }
  };

  const completeTaskTimer = async (taskId) => {
    toast.success('Task Completed!');
    const token = localStorage.getItem('token');
    let result = await fetch(`http://localhost:5000/completeTask/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`, // Pass the token in the header
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    const data = await result.json();
    localStorage.setItem(`taskCompletedTime_${taskId}`, data.completedAt);
    if (data.completedAt) {
      console.log(data.completedAt);
      console.log(data.startedAt);

      const completedAtTime = new Date(data.completedAt).getTime();
      const startedAtTime = new Date(data.startedAt).getTime();
      const elapsed = parseInt((completedAtTime - startedAtTime) / 1000);

      localStorage.setItem(`elapsedTime${taskId}`, elapsed)
      setTaskCompletionStatus(prevState => ({
        ...prevState,
        [taskId]: true, // Mark this task as complete
      }));
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container-fluid">
        <div>
          <div className="row">
            <Sidebar />
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
                  {Array.isArray(tasks) && tasks.map((t) => (
                    <li key={t._id} className='list-group-item d-flex justify-content-between align-items-center'>
                      <span>{t.title}</span>
                      <div>
                        
                        {localStorage.getItem(`elapsedTime${t._id}`) ? (
                          <span className='me-1 text-primary'>
                            {`Task Completion Time: ${localStorage.getItem(`elapsedTime${t._id}`)} seconds`}
                          </span>
                        ):localStorage.getItem(`taskStartTime_${t._id}`) && <span className='me-1 text-success'>{`Task Started At: ${localStorage.getItem(`taskStartTime_${t._id}`)}`}</span>}
                        <button
                          className={`btn btn-success btn-sm mx-1 ${taskCompletionStatus[t._id] ? 'disabled' : ''}`}
                          onClick={() => startTaskTimer(t._id)}
                          disabled={taskCompletionStatus[t._id]}
                        >
                          Start Task
                        </button>
                        <button
                          className={`btn btn-warning btn-sm mx-1 ${taskCompletionStatus[t._id] ? 'disabled' : ''}`}
                          onClick={() => completeTaskTimer(t._id)}
                          disabled={taskCompletionStatus[t._id]}
                        >
                          Task Completed
                        </button>
                        <button className='btn btn-danger btn-sm mx-1' onClick={() => handleDeleteTask(t._id)}>
                          Delete Task
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
    </>
  );
};

export default Dashboard;
