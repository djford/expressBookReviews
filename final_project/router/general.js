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
public_users.get('/', async function (req, res) {
    try {
        const booksData = await new Promise((resolve) => resolve(books));
        res.send(booksData);
    } catch (error) {
        res.status(500).send({message: "Error fetching books."});
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const book = await new Promise((resolve, reject) => {
            if(books[isbn]){
                resolve(books[isbn]);
            } else {
                reject(`Book with ISBN ${isbn} not found.`);
            }
        });
        res.send(book);
    }  catch (error) {
        res.status(404).send({ message: error });
    }  
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;

    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
            let filteredBooks = [];

            const bookKeys = Object.keys(books);

            bookKeys.forEach((key) => {
                if (books[key].author === author){
                    filteredBooks.push(books[key]);
                }
            });

            if (filteredBooks.length > 0){
                resolve(filteredBooks);
            } else {
                reject(`No books found by the author ${author}.`);
            }
        });

        res.send(booksByAuthor);
    } catch {
        res.status(404).send({ message: error });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    
    try {
        const booksByTitle = await new Promise((resolve, reject) => {
            let filteredBooks = [];

            const bookKeys = Object.keys(books);

            bookKeys.forEach((key) => {
                if (books[key].title === title){
                    filteredBooks.push(books[key]);
                }
            });

            if (filteredBooks.length > 0){
                resolve(filteredBooks);
            } else {
                reject(`No books found with the title ${title}.`);
            }
        });

        res.send(booksByTitle);
    } catch {
        res.status(404).send({ message: error });
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
