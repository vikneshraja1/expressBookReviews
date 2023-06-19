const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a user
public_users.post("/register", (req, res) => {
    // Gather credentials from request body.
    const username = req.body.username;
    const password = req.body.password;
      
    // First, check if there exists a value for the username and password.
    if (username.length > 0 && password.length > 0) {
      // Next, check if the username already exists in our system.
      if (isValid(username)) {
        users.push({ username: username, password: password });
        return res
          .status(200)
          .json({ message: "User successfully registered!" });
      } else {
        return res.status(406).json({ message: "Unable to register user: User already exists!" });
      }
    }
    return res.status(406).json({ message: "Unable to register user: No username and/or password provided." });
  });


// Implementing a promise to getting the available books in the shop
public_users.get("/", function (req, res) {
  const getBooks = new Promise(() => {
    res.send(JSON.stringify({ books }));
  });

  getBooks.then(() => console.log(" Task 10 Promise resolved."))
});


// Implement a promise for getting book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Promise to get the book.
  const getBook = new Promise(() => {
    const bookISBN = req.params.isbn;
    res.send(books[bookISBN]);
  });

  getBook.then(() => console.log("Task 11 Promise resolved."))
});

// Get book details based on author

public_users.get("/author/:author", function (req, res) {
  const getAuthorsBooks = new Promise(() => {
    const author = req.params.author;
  
    // Get all keys.
    const allBooksByAuthor = Object.entries(books);
    const finalBooks = [];
  
    // Find which values match the given author.
    for (const [key, value] of allBooksByAuthor) {
      if (value.author === author) {
        finalBooks.push(value);
      }
    }
    res.send(finalBooks);
  })

  getAuthorsBooks.then(() => console.log("Task 12 Promise resolved."))
});

// Get all books based on title

public_users.get("/title/:title", function (req, res) {
  const getBookTitles = new Promise(() => {
    const title = req.params.title;
  
    // Get all keys.
    const allBooksByTitle = Object.entries(books);
    const finalBooks = [];
  
    // Find which values match the given title.
    for (const [key, value] of allBooksByTitle) {
      if (value.title === title) {
        finalBooks.push(value);
      }
    }
    res.send(finalBooks);
  });

  getBookTitles.then(() => console.log("Task 13 Promise resolved."))
});

//  Task 5 - Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"])
});

module.exports.general = public_users;
