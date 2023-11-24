const express = require('express');
const app = express();
const path = require('path'); // Import the 'path' module to handle file paths
const fs = require('fs');
const bodyParser = require('body-parser');

const getReq = require("./methods/getRequest");
const postReq = require("./methods/postRequest");
const putReq = require("./methods/putRequest");
const deleteReq = require("./methods/deleteRequest");
let laptops = require("./data/laptops.json");

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the directory where EJS templates are located

// Serve static assets from the "views" directory
app.use(express.static('views'));

// Middleware to make 'laptops' available in requests
app.use((req, res, next) => {
  req.laptops = laptops;
  next();
});

app.post('/api/laptops', postReq);
app.get('/api/laptops', getReq);
app.get('/api/laptops/:id', getReq);
app.put('/api/laptops/:id', putReq);
app.delete('/api/laptops/:id', deleteReq);


app.get('/add-laptop', (req, res) => {
  res.render('addLaptop');
});

app.get('/get-laptop', (req, res) => {
  res.render('getLaptop', { laptops: req.laptops }); // Pass the laptops array to the template
});

app.get('/updateLaptop', (req, res) => {
  const laptopId = req.query.laptopId;
  const laptopsData = fs.readFileSync('./data/laptops.json', 'utf8');
  const laptops = JSON.parse(laptopsData);
  const laptop = laptops.find(cust => cust.id === laptopId);
  res.render('updateLaptop', { laptop });
});


app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle the POST request
app.post('/update-laptop', (req, res) => {
  const laptopId = req.body.laptopId;

  fs.readFile('./data/laptops.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading laptop data file');
    }

    const laptopData = JSON.parse(data);
    const laptopIndex = laptopData.findIndex((c) => c.id === laptopId);

    if (laptopIndex === -1) {
      return res.status(404).send('Laptop not found');
    }

    // Update the laptop's information with the new values
    laptopData[laptopIndex].brand = req.body.brand;
    laptopData[laptopIndex].model = req.body.model;
    laptopData[laptopIndex].processor = req.body.processor;
    laptopData[laptopIndex].ram = req.body.ram;
    laptopData[laptopIndex].storage = req.body.storage;
    laptopData[laptopIndex].price = req.body.price;
    laptopData[laptopIndex].availability = req.body.availability;

    fs.writeFile('./data/laptops.json', JSON.stringify(laptopData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing laptop data file');
      }

      // Update req.laptops with the new data (optional)
      req.laptops = laptopData;

      // Redirect to the updated laptop page
      res.render('getLaptop', { laptops: laptopData });
    });
  });
});


app.get('/deleteLaptop', (req, res) => {
  const laptopId = req.query.laptopId;

  // Find the index of the laptop with the specified laptopId
  const laptopIndex = laptops.findIndex((laptop) => laptop.id === laptopId);

  if (laptopIndex === -1) {
    return res.status(404).send('Laptop not found');
  }

  // Remove the laptop from the laptops array
  laptops.splice(laptopIndex, 1);

  // Update the laptops.json file with the modified laptops array
  fs.writeFile('./data/laptops.json', JSON.stringify(laptops, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing laptop data file');
    }

    // Redirect to the updated laptop page
    res.render('getLaptop', { laptops });
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