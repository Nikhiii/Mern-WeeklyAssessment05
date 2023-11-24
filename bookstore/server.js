const express = require('express');
const app = express();
const path = require('path'); // Import the 'path' module to handle file paths
const fs = require('fs');
const bodyParser = require('body-parser');

const getReq = require("./methods/getRequest");
const postReq = require("./methods/postRequest");
const putReq = require("./methods/putRequest");
const deleteReq = require("./methods/deleteRequest");
let books = require("./data/books.json");

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the directory where EJS templates are located

// Serve static assets from the "views" directory
app.use(express.static('views'));

// Middleware to make 'books' available in requests
app.use((req, res, next) => {
  req.books = books;
  next();
});

app.post('/api/books', postReq);
app.get('/api/books', getReq);
app.get('/api/books/:id', getReq);
app.put('/api/books/:id', putReq);
app.delete('/api/books/:id', deleteReq);

app.get('/add-book', (req, res) => {
  res.render('addBook');
});

app.get('/get-book', (req, res) => {
  res.render('getBook', { books: req.books });
});


app.get('/updateBook', (req, res) => {
  const bookId = req.query.bookId;
  const booksData = fs.readFileSync('./data/books.json', 'utf8');
  const books = JSON.parse(booksData);
  const book = books.find(cust => cust.id === bookId);
  res.render('updateBook', { book });
});


app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle the POST request
app.post('/update-book', (req, res) => {
  const bookId = req.body.bookId;

  fs.readFile('./data/books.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading book data file');
    }

    const bookData = JSON.parse(data);
    const bookIndex = bookData.findIndex((c) => c.id === bookId);

    if (bookIndex === -1) {
      return res.status(404).send('Book not found');
    }

    // Update the book's information with the new values
    bookData[bookIndex].title = req.body.title;
    bookData[bookIndex].author = req.body.author;
    bookData[bookIndex].genre = req.body.genre;
    bookData[bookIndex].publishedYear = req.body.publishedYear;
    bookData[bookIndex].price = req.body.price;
    bookData[bookIndex].availability = req.body.availability;

    fs.writeFile('./data/books.json', JSON.stringify(bookData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error writing book data file');
      }

      // Update req.books with the new data (optional)
      req.books = bookData;

      // Redirect to the updated book page
      res.render('getBook', { books: bookData });
    });
  });
});


app.get('/deleteBook', (req, res) => {
  const bookId = req.query.bookId;

  // Find the index of the book with the specified bookId
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).send('Book not found');
  }

  // Remove the book from the books array
  books.splice(bookIndex, 1);

  // Update the books.json file with the modified books array
  fs.writeFile('./data/books.json', JSON.stringify(books, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error writing book data file');
    }

    // Redirect to the updated book page
    res.render('getBook', { books });
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