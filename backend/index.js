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
app.post('/create', async (req, res) => {
    try {
        const taskData = new Task(req.body);
        const result = await taskData.save();
        res.status(201).json(result); // 201 Created
    } catch (error) {
        res.status(400).json({ message: error.message }); // 400 Bad Request
    }
});

// Read all tasks
app.get('/read', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json(tasks); // 200 OK
    } catch (error) {
        res.status(500).json({ message: error.message }); // 500 Internal Server Error
    }
});

// Update a task's status
app.put('/updateTask/:id', async (req, res) => {
    const { id } = req.params;
    const { title, message } = req.body;
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        id,
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
app.delete('/deleteTask/:id', async (req, res) => {
    try {
        const result = await Task.deleteOne({ _id: req.params.id }); // Assuming you're using _id as the unique identifier for tasks
        
        if (result.deletedCount === 1) {
            res.status(200).send({ message: 'Task deleted successfully' });
        } else {
            res.status(404).send({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error deleting task', error });
    }
});



// Token verification middleware
function verifyToken(req, res, next) {
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
            next();
        });
    } else {
        res.status(403).send({ result: 'Token not provided' });
    }
}


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
