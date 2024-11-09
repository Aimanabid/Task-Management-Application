import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(null); // Track which task is being edited
  const [editTask, setEditTask] = useState({ title: '', message: '' }); // Track edit inputs

  // Fetch tasks from API
  const getdata = async () => {
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
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  // Update task in the database
  const handleUpdateTask = async (taskId) => {
<<<<<<< HEAD
=======
    console.log('Saving task with ID:', taskId);
    console.log('Edit task data:', editTask); // Log the editTask object
>>>>>>> c5e08f40d85544538d87006b203b59cb5ccb3b46

    try {
        // Get the token from local storage
        const token = localStorage.getItem('token');

        // Make the PUT request with the token in headers
        const response = await axios.put(`http://localhost:5000/updateTask/${taskId}`, editTask, {
            headers: {
                'Authorization': `Bearer ${token}`, // Pass the token in the header
                'Content-Type': 'application/json', // Ensure the correct content type is set
            },
        });
        console.log('Updated task response:', response.data); // Log response

        // Update the tasks state with the newly updated task
        const updatedTask = { ...response.data }; // Ensure you have the updated task
        setTasks((prevTasks) =>
            prevTasks.map((task) => (task._id === taskId ? updatedTask : task))
        );

        // Exit edit mode and reset the edit form
        setEditMode(null);
        setEditTask({ title: '', message: '' });
    } catch (error) {
        console.error('Error updating task:', error.response?.data || error.message);
    }
};




  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar />
        
        {/* Main Content */}
        <div className="col-10 main-content">
          <header className="header">
            <h3 className='text-center p-3 welcomeheading'>My Tasks</h3>
          </header>
          
          {/* Task Cards */}
          <div className="row mt-4">
            {tasks.map((task) => (
              <div className="col-md-6 mb-4" key={task._id}>
                <div className="card shadow">
                  <div className="card-body">
                    {editMode === task._id ? (
                      // Edit form
                      <>
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={editTask.title}
                          onChange={(e) =>
                            setEditTask({ ...editTask, title: e.target.value })
                          }
                          placeholder="Edit title"
                        />
                        <textarea
                          className="form-control mb-2"
                          value={editTask.message}
                          onChange={(e) =>
                            setEditTask({ ...editTask, message: e.target.value })
                          }
                          placeholder="Edit message"
                        />
                        <button
                          className="btn btn-primary btn-sm mx-2"
                          onClick={() => handleUpdateTask(task._id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm ml-2"
                          onClick={() => setEditMode(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      // Display task details
                      <>
                        <h5 className="card-title">{task.title}</h5>
                        <p className="card-text">{task.message}</p>
                        
                        <button
                          className={`btn btn-warning btn-sm ${task.createdAt==null?' ': 'disabled'}`}
                          onClick={() => {
                            setEditMode(task._id);
                            setEditTask({ title: task.title, message: task.message });
                          }}
                        >
                        
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
