const express = require('express');
const app = express();
const path = require('path'); // Import the 'path' module to handle file paths
const fs = require('fs');
const bodyParser = require('body-parser');

const getReq = require("./methods/getRequest");
const postReq = require("./methods/postRequest");
const putReq = require("./methods/putRequest");
const deleteReq = require("./methods/deleteRequest");
let appevents = require("./data/appevents.json");

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the directory where EJS templates are located

// Serve static assets from the "views" directory
app.use(express.static('views'));

// Middleware to make 'appevents' available in requests
app.use((req, res, next) => {
  req.appevents = appevents;
  next();
});

app.post('/api/events', postReq);
app.get('/api/events', getReq);
app.get('/api/events/:id', getReq);
app.put('/api/events/:id', putReq);
app.delete('/api/events/:id', deleteReq);

app.get('/add-event', (req, res) => {
  res.render('addEvent');
});

app.get('/get-event', (req, res) => {
  res.render('getEvent', { appevents: req.appevents }); // Pass the appevents array to the template
});

app.get('/updateEvent', (req, res) => {
  const appeventId = req.query.eventId;
  const appeventsData = fs.readFileSync('./data/appevents.json', 'utf8');
  const appevents = JSON.parse(appeventsData);
  const appevent = appevents.find(cust => cust.id === appeventId);
  res.render('updateEvent', { appevent });
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/update-event', (req, res) => {
  const eventId = req.body.eventId;

  const appeventsData = fs.readFileSync('./data/appevents.json', 'utf8');
  const appevents = JSON.parse(appeventsData);

  const appeventIndex = appevents.findIndex((event) => event.id === eventId);

  if (appeventIndex === -1) {
    return res.status(404).send('Event not found');
  }

  appevents[appeventIndex].eventName = req.body.eventName;
  appevents[appeventIndex].eventDate = req.body.eventDate;
  appevents[appeventIndex].eventLocation = req.body.eventLocation;
  appevents[appeventIndex].eventDescription = req.body.eventDescription;
  appevents[appeventIndex].eventOrganizer = req.body.eventOrganizer;
  appevents[appeventIndex].eventTicketPrice = req.body.eventTicketPrice;

  fs.writeFile('./data/appevents.json', JSON.stringify(appevents, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing appevents data file');
    }

    // Render the "getEvent" page with the updated data
    res.render('getEvent', { appevents: appevents });
  });
});

app.get('/deleteEvent', (req, res) => {
  const eventId = req.query.eventId;

  // Find the index of the event with the specified eventId in appevents
  const eventIndex = appevents.findIndex((event) => event.id === eventId);

  if (eventIndex === -1) {
    return res.status(404).send('Event not found');
  }

  // Remove the event from the appevents array
  appevents.splice(eventIndex, 1);

  // Update the appevents.json file with the modified appevents array
  fs.writeFile('./data/appevents.json', JSON.stringify(appevents, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing appevents data file');
    }

    // Redirect to the updated event page
    res.render('getEvent', { appevents });
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