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
      const result = await axios.get('http://localhost:5000/read');
      setTasks(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  // Update task in the database
  const handleUpdateTask = async (taskId) => {
    try {
      const response = await axios.put(`http://localhost:5000/updateTask/${taskId}`, editTask);
      setTasks(tasks.map((task) => (task._id === taskId ? response.data : task)));
      setEditMode(null); // Exit edit mode
      setEditTask({ title: '', message: '' }); // Reset edit form
    } catch (error) {
      console.error('Error updating task:', error);
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
                          className="btn btn-warning btn-sm"
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
