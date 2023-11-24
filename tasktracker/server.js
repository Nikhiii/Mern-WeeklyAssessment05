const express = require('express');
const app = express();
const path = require('path'); // Import the 'path' module to handle file paths
const fs = require('fs');
const bodyParser = require('body-parser');

const getReq = require("./methods/getRequest");
const postReq = require("./methods/postRequest");
const putReq = require("./methods/putRequest");
const deleteReq = require("./methods/deleteRequest");
let tasks = require("./data/tasks.json");

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the directory where EJS templates are located

// Serve static assets from the "views" directory
app.use(express.static('views'));

// Middleware to make 'tasks' available in requests
app.use((req, res, next) => {
  req.tasks = tasks;
  next();
});

app.post('/api/tasks', postReq);
app.get('/api/tasks', getReq);
app.get('/api/tasks/:id', getReq);
app.put('/api/tasks/:id', putReq);
app.delete('/api/tasks/:id', deleteReq);

app.get('/add-task', (req, res) => {
  res.render('addTask');
});

app.get('/get-task', (req, res) => {
  res.render('getTask', { tasks: req.tasks }); // Pass the tasks array to the template
});

app.get('/updateTask', (req, res) => {
  const taskId = req.query.taskId;
  const tasksData = fs.readFileSync('./data/tasks.json', 'utf8');
  const tasks = JSON.parse(tasksData);
  const task = tasks.find(cust => cust.id === taskId);
  res.render('updateTask', { task });
});


app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle the POST request
app.post('/update-task', (req, res) => {
  const taskId = req.body.taskId;

  fs.readFile('./data/tasks.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading task data file');
    }

    const taskData = JSON.parse(data);
    const taskIndex = taskData.findIndex((c) => c.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).send('Task not found');
    }

    // Update the task's information with the new values
    taskData[taskIndex].taskTitle = req.body.taskTitle;
    taskData[taskIndex].taskDescription = req.body.taskDescription;
    taskData[taskIndex].taskPriority = req.body.taskPriority;
    taskData[taskIndex].taskStatus = req.body.taskStatus;
    taskData[taskIndex].taskDueDate = req.body.taskDueDate;

    fs.writeFile('./data/tasks.json', JSON.stringify(taskData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing task data file');
      }

      // Update req.tasks with the new data (optional)
      req.tasks = taskData;

      // Redirect to the updated task page
      res.render('getTask', { tasks: taskData });
    });
  });
});


app.get('/deleteTask', (req, res) => {
  const taskId = req.query.taskId;

  // Find the index of the task with the specified taskId
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).send('Task not found');
  }

  // Remove the task from the tasks array
  tasks.splice(taskIndex, 1);

  // Update the tasks.json file with the modified tasks array
  fs.writeFile('./data/tasks.json', JSON.stringify(tasks, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing task data file');
    }

    // Redirect to the updated task page
    res.render('getTask', { tasks });
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ title: 'Not Found', message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`);
});

module.exports = app;