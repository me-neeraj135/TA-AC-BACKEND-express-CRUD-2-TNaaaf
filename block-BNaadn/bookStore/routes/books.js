/** @format */

var express = require("express");

var router = express.Router();
let Book = require(`../models/book`);
let Author = require(`../models/author`);
let multer = require("multer");
let fs = require(`fs`);
let path = require(`path`);
let imagePath = path.join(__dirname, `../`, `public/images`);

//set storage engine

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagePath);
  },
  filename: function (req, file, cb) {
    const fileExtension = Date.now() + `-` + file.originalname;

    cb(null, fileExtension);
  },
});

const upload = multer({ storage: storage });

// add new book
router.get(`/new`, (req, res, next) => {
  res.render(`bookForm`);
});

router.post(`/`, upload.single(`image`), (req, res, next) => {
  req.body.image = req.file.filename;

  Author.create(req.body, (err, author) => {
    if (err) return next(err);
    req.body.author = author._id;
    Book.create(req.body, (err, book) => {
      if (err) return next(err);
      author.bookId = author.bookId + [book.id];
      author.save((err, author) => {
        if (err) return next(err);
        res.redirect(`/books`);
      });
    });
  });
});

// list all books

router.get(`/`, (req, res, next) => {
  Book.find({})
    .populate(`author`)
    .exec((err, books) => {
      if (err) return next(err);
      Book.distinct(`category`, (err, uniqueCategory) => {
        if (err) return next(err);
        Author.distinct(`name`, (err, uniqueAuthor) => {
          if (err) return next(err);
          console.log(uniqueAuthor);
          Book.distinct(`title`, (err, uniqueTitle) => {
            if (err) return next(err);
            res.render(`books`, {
              books,
              uniqueCategory,
              uniqueAuthor,
              uniqueTitle,
            });
          });
        });
      });
    });
});

// edit book

router.get(`/:id/edit`, (req, res, next) => {
  let id = req.params.id;
  Book.findById(id)
    .populate(`author`)
    .exec((err, book) => {
      if (err) return next(err);
      res.render(`bookEditForm`, { book });
    });
});

// update book

router.post(`/:id/update`, upload.single(`image`), (req, res, next) => {
  let id = req.params.id;
  req.body.image = req.file.filename;
  Book.findByIdAndUpdate(id, req.body, (err, book) => {
    Author.findByIdAndUpdate(book.author, req.body, (err, author) => {
      author.bookId = author.bookId + [id];

      if (err) return next(err);
      res.redirect(`/books/` + id);
    });
  });
});

// deleting  book

router.get(`/:id/delete`, (req, res, next) => {
  let id = req.params.id;

  Book.findByIdAndDelete(id, (err, book) => {
    let filePath = imagePath + `/${book.image}`;
    fs.unlink(filePath, err => {
      if (err) return next(err);

      Author.findByIdAndDelete(book.author, (err, author) => {
        if (err) return next(err);
        res.redirect(`/books`);
      });
    });
  });
});

// search book

router.post(`/search`, (req, res, next) => {
  let title = req.body.title;
  let category = req.body.category;
  if (title) {
    Book.find({ title: req.body.title }, (err, book) => {
      let id = book[0].id;
      if (err) return next(err);
      res.redirect(`/books/` + id);
    });
  }
  if (category) {
    // Book.find({ category: category })
    //   .populate(`author`)
    //   .exec((err, books) => {
    //     console.log(err, books);
    //     if (err) return next(err);
    //     res.redirect(`/books`);
    //   });

    Book.find({ category: category })
      .populate(`author`)
      .exec((err, books) => {
        if (err) return next(err);
        Book.distinct(`category`, (err, uniqueCategory) => {
          if (err) return next(err);
          Author.distinct(`name`, (err, uniqueAuthor) => {
            if (err) return next(err);
            console.log(uniqueAuthor);
            Book.distinct(`title`, (err, uniqueTitle) => {
              if (err) return next(err);
              res.render(`books`, {
                books,
                uniqueCategory,
                uniqueAuthor,
                uniqueTitle,
              });
            });
          });
        });
      });
  }
});

// find single book

router.get(`/:id`, (req, res, next) => {
  let id = req.params.id;
  Book.findById(id)
    .populate(`author`)
    .exec((err, book) => {
      if (err) return next(err);
      res.render(`book`, { book });
    });
});

module.exports = router;
