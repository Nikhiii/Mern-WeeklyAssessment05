const express = require('express');
const app = express();
const path = require('path'); // Import the 'path' module to handle file paths
const fs = require('fs');
const bodyParser = require('body-parser');


const getReq = require("./methods/getRequest");
const postReq = require("./methods/postRequest");
const putReq = require("./methods/putRequest");
const deleteReq = require("./methods/deleteRequest");
let employees = require("./data/employees.json");

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the directory where EJS templates are located

// Serve static assets from the "views" directory
app.use(express.static('views'));

// Middleware to make 'employees' available in requests
app.use((req, res, next) => {
  req.employees = employees;
  next();
});

app.post('/api/employees', postReq);
app.get('/api/employees', getReq);
app.get('/api/employees/:id', getReq);
app.put('/api/employees/:id', putReq);
app.delete('/api/employees/:id', deleteReq);


app.get('/add-employee', (req, res) => {
  res.render('addEmployee');
});

app.get('/get-employee', (req, res) => {
  res.render('getEmployee', { employees: req.employees }); // Pass the employees array to the template
});

app.get('/updateEmployee', (req, res) => {
  const employeeId = req.query.employeeId;
  const employeesData = fs.readFileSync('./data/employees.json', 'utf8');
  const employees = JSON.parse(employeesData);
  const employee = employees.find(cust => cust.id === employeeId);
  res.render('updateEmployee', { employee });
});

app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle the POST request
app.post('/update-employee', (req, res) => {
  const employeeId = req.body.employeeId;

  fs.readFile('./data/employees.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading employee data file');
    }

    const employeeData = JSON.parse(data);
    const employeeIndex = employeeData.findIndex((c) => c.id === employeeId);

    if (employeeIndex === -1) {
      return res.status(404).send('Employee not found');
    }

    // Update the employee's information with the new values
    employeeData[employeeIndex].name = req.body.name;
    employeeData[employeeIndex].email = req.body.email;
    employeeData[employeeIndex].phone = req.body.phone;
    employeeData[employeeIndex].department = req.body.department;
    employeeData[employeeIndex].status = req.body.status;

    fs.writeFile('./data/employees.json', JSON.stringify(employeeData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing employee data file');
      }

      // Update req.employees with the new data (optional)
      req.employees = employeeData;

      // Redirect to the updated employee page
      res.render('getEmployee', { employees: employeeData });
    });
  });
});

app.get('/deleteEmployee', (req, res) => {
  const employeeId = req.query.employeeId;

  // Find the index of the employee with the specified employeeId
  const employeeIndex = employees.findIndex((employee) => employee.id === employeeId);

  if (employeeIndex === -1) {
    return res.status(404).send('Employee not found');
  }

  // Remove the employee from the employees array
  employees.splice(employeeIndex, 1);

  // Update the employees.json file with the modified employees array
  fs.writeFile('./data/employees.json', JSON.stringify(employees, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing employee data file');
    }

    // Redirect to the updated employee page
    res.render('getEmployee', { employees });
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