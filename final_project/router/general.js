const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if(isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login."})
        } else {
            return res.status(400).json({message: "User already exists!"});
        }
    } 

    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if(books[isbn]){
    res.send(books[isbn]);
  } else {
    res.status(404).send({message: `Book with ISBN ${isbn} not found.`});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];

  const bookKeys = Object.keys(books);

  bookKeys.forEach((key) => {
    if (books[key].author === author){
        booksByAuthor.push(books[key]);
    }
  });

  if (booksByAuthor.length > 0){
    res.send(booksByAuthor);
  } else {
    res.status(404).send({message: `No books found by the author ${author}.`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];

  const bookKeys = Object.keys(books);

  bookKeys.forEach((key) => {
    if (books[key].title === title){
        booksByTitle.push(books[key]);
    } 
  });

  if (booksByTitle.length > 0) {
    res.send(booksByTitle);
  } else {
    res.status(404).send({message: `No books found with the title ${title}.`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]){
    res.send(books[isbn].reviews);
  } else {
    res.status(404).send({message: `Book with ISBN ${isbn} not found.`});
  }
});

module.exports.general = public_users;
