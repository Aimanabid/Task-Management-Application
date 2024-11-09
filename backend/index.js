const express = require('express');
require('./config/db');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwtkey = 'taskmanagement1';
const Task = require('./Tasks/Model')
const Registration = require('./Registration/Model');
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Registration route
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await Registration.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already in use.' });
        }

        const data = new Registration({
            username,
            email,
            password, 
        });

        const result = await data.save();
        
        jwt.sign({ result }, jwtkey, { expiresIn: '2h' }, (err, token) => {
            if (err) {
                return res.status(500).send({ result: 'Token generation failed' });
            }
            res.status(201).send({ result, auth: token });
        });
    } catch (err) {
        console.error('Error message', err);
        res.status(500).send({ message: 'Internal Server Error', error: err.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const result = await Registration.findOne(req.body);

        if (result) {
            jwt.sign({ result }, jwtkey, { expiresIn: '2h' }, (err, token) => {
                if (err) {
                    return res.status(500).send({ result: 'Token generation failed' });
                }
                res.status(200).send({ result, auth: token });
            });
        } else {
            res.status(400).send({ result: 'No User Found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ result: 'Internal Server Error' });
    }
});

// Create a task
app.post('/create', verifyUser, async (req, res) => {
    try {
        const newTask = new Task({
            ...req.body,
            userId: req.userId, // Link task to user ID
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).send({ message: 'Failed to create task' });
    }
});
// Read tasks for a specific user
app.get('/read', verifyUser,  async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId }); // Filter by user ID
        res.status(200).send(tasks); // Send back user's tasks
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
});


// Update a task's status
app.put('/updateTask/:id', verifyUser, async (req, res) => {
    const { id } = req.params;
    const { title, message } = req.body;
  
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, userId: req.userId }, // Check if task belongs to the user
            { title, message },
            { new: true }
        );
      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

// Delete a task
app.delete('/deleteTask/:id',verifyUser, async (req, res) => {
    try {
        const result = await Task.deleteOne({ _id: req.params.id, userId: req.userId }); // Assuming you're using _id as the unique identifier for tasks
        
        if (result.deletedCount === 1) {
            res.status(200).send({ message: 'Task deleted successfully' });
        } else {
            res.status(404).send({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error deleting task', error });
    }
});

// Start Task (sets the start time)
app.put('/startTask/:id', verifyUser, async (req, res) => {
    try {
        const startTime = new Date();
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { startedAt: startTime.toLocaleString() }, // Set the current time as the start time
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).send({ message: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error starting task:', error);
        res.status(500).json({ message: 'Failed to start task' });
    }
});

// Complete Task (sets the completion time)
app.put('/completeTask/:id', verifyUser, async (req, res) => {
    try {
        const endTime = new Date()
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { completedAt: endTime.toLocaleString() }, // Set the current time as the completion time
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).send({ message: 'Task not found' });
        }
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ message: 'Failed to complete task' });
    }
});
// Elapsed Time route - calculates elapsed time since task start
app.get('/elapsedTime/:id', verifyUser, async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({ _id: id, userId: req.userId });

        if (task) {
            if (!task.startedAt) {
                return res.status(400).json({ message: 'Task has not been started yet' });
            }

            const elapsedTime = (task.completedAt - task.startedAt) // Calculate elapsed time in seconds

            res.status(200).json({
                message: 'Elapsed time calculated',
                elapsedTime: `${elapsedTime} seconds`
            });
        } else {
            res.status(404).send({ message: 'Task not found' });
        }
    } catch (error) {
        console.error('Error calculating elapsed time:', error);
        res.status(500).send({ message: 'Failed to calculate elapsed time' });
    }
});




// Token verification middleware
// function verifyToken(req, res, next) {
//     const bearerHeader = req.headers['authorization'];
    
//     if (typeof bearerHeader !== 'undefined') {
//         const token = bearerHeader.split(" ")[1];
//         req.token = token;
        
//         jwt.verify(token, jwtkey, (err, authData) => {
//             if (err) {
//                 if (err.name === 'TokenExpiredError') {
//                     return res.status(401).send({ result: 'Token Expired' });
//                 } else {
//                     return res.status(403).send({ result: 'Invalid or Modified Token' });
//                 }
//             }
//             req.authData = authData;
//             next();
//         });
//     } else {
//         res.status(403).send({ result: 'Token not provided' });
//     }
// }
// function verifyUser(req, res, next) {
//     const bearerHeader = req.headers['authorization'];
//     if (bearerHeader) {
//         const token = bearerHeader.split(" ")[1];
//         jwt.verify(token, jwtkey, (err, authData) => {
//             if (err) {
//                 console.log(err)
//                 return res.status(403).send({ result: 'Unauthorized: Invalid token' });
//             } else {
//                 req.userId = authData.result._id; // Store user ID for route use
//                 console.log("User ID:", req.userId); // Add this line for debugging
//                 next();
//             }
//         });
//     } else {
//         res.status(403).send({ result: 'Token Not Found' });
//     }
// }

function verifyUser(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(" ")[1];
        req.token = token;

        jwt.verify(token, jwtkey, (err, authData) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({ result: 'Token Expired' });
                } else {
                    return res.status(403).send({ result: 'Invalid or Modified Token' });
                }
            }
            req.authData = authData;
            req.userId = authData.result._id; // Store user ID for route use
            next();
        });
    } else {
        res.status(403).send({ result: 'Token not provided' });
    }
}



app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
