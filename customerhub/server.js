const express = require('express');
const app = express();
const path = require('path'); // Import the 'path' module to handle file paths
const fs = require('fs');
const bodyParser = require('body-parser');

const getReq = require('./methods/getRequest');
const postReq = require('./methods/postRequest');
const putReq = require('./methods/putRequest');
const deleteReq = require('./methods/deleteRequest');
let customers = require('./data/customer.json');

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the directory where EJS templates are located

// Serve static assets from the "views" directory
app.use(express.static('views'));

// Middleware to make 'customers' available in requests
app.use((req, res, next) => {
  req.customers = customers;
  next();
});

// Routes for handling different HTTP methods
app.get('/api/customers', getReq);
app.get('/api/customers/:id', getReq);
app.post('/api/customers', postReq);
app.put('/api/customers/:id', putReq);
app.delete('/api/customers/:id', deleteReq);

app.get('/add-customer', (req, res) => {
  res.render('addCustomer');
});

app.get('/get-customer', (req, res) => {
  res.render('getCustomer', { customers: req.customers }); // Pass the customers array to the template
  
});

app.get('/updateCustomer', (req, res) => {
  const customerId = req.query.customerId;
  const customersData = fs.readFileSync('./data/customer.json', 'utf8');
  const customers = JSON.parse(customersData);
  const customer = customers.find(cust => cust.id === customerId);
  res.render('updateCustomer', { customer });
});

app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle the POST request
app.post('/update-customer', (req, res) => {
  const customerId = req.body.customerId;

  fs.readFile('./data/customer.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading customer data file');
    }

    const customerData = JSON.parse(data);
    const customerIndex = customerData.findIndex((c) => c.id === customerId);

    if (customerIndex === -1) {
      return res.status(404).send('Customer not found');
    }

    // Update the customer's information with the new values
    customerData[customerIndex].name = req.body.name;
    customerData[customerIndex].email = req.body.email;
    customerData[customerIndex].phone = req.body.phone;
    customerData[customerIndex].address = req.body.address;
    customerData[customerIndex].accountNumber = req.body.accountNumber;

    fs.writeFile('./data/customer.json', JSON.stringify(customerData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing customer data file');
      }

      // Update req.customers with the new data (optional)
      req.customers = customerData;

      // Redirect to the updated customer page
      res.render('getCustomer', { customers: customerData });
    });
  });
});

app.get('/deleteCustomer', (req, res) => {
  const customerId = req.query.customerId;

  // Find the index of the customer with the specified customerId
  const customerIndex = customers.findIndex((customer) => customer.id === customerId);

  if (customerIndex === -1) {
    return res.status(404).send('Customer not found');
  }

  // Remove the customer from the customers array
  customers.splice(customerIndex, 1);

  // Update the customer.json file with the modified customers array
  fs.writeFile('./data/customer.json', JSON.stringify(customers, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing customer data file');
    }

    // Redirect to the updated customer page
    res.render('getCustomer', { customers });
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
