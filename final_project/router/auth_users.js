const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
      username: "test",
      password: "test123",
    },
  ];

  const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
    let matchingUsers = users.filter((user) => {
      return user.username === username;
    });
    if (matchingUsers.length > 0) {
      return false;
    }
    return true;
  };
  
  const authenticatedUser = (username, password) => {
    //returns boolean
    //write code to check if username and password match the one we have in records.
    let matchingUsers = users.filter((user) => {
      return user.username === username && user.password === password;
    });
  
    if (matchingUsers.length > 0) {
      return true;
    }
    return false;
  };
 

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // If no username and/or password was provided.
  if (!username || !password) {
    return res.status(404).send("There was an issue while trying to log in.");
  }

  // Check if the user is registered in our system.
  if (authenticatedUser(username, password)) {
    // Generate a JWT token.
    let accessToken = jwt.sign(
      {
        pw: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Create the user's session.
    req.session.authenticated = {
      accessToken,
      username,
    };

    return res.status(200).send("User successfully logged in.");
  } else {
    return res
      .status(208)
      .send("The provided username or password was not valid.");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  if (filtered_book) {
      let review = req.query.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          filtered_book['reviews'][reviewer] = review;
          books[isbn] = filtered_book;
      }
      res.send(`Review for the book with ISBN ${isbn} has been added/updated.`);
  }
  else{
      res.send("Unable to find this ISBN!");
  }
});

// Deleting a book review

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let reviewer = req.session.authorization['username'];
    let filtered_review = books[isbn]["reviews"];

    if (filtered_review[reviewer]){
        delete filtered_review[reviewer];
        res.send(`Reviews for the ISBN  ${isbn}  deleted.`);
    }
    else{
        res.send("Can't delete, as this review has been posted by a different user");
    }
    });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
