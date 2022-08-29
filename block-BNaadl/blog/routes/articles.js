/** @format */

var express = require("express");
var router = express.Router();
var Article = require(`../models/articles`);

// get articles

router.get(`/`, (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);

    res.render(`articles`, { articles: articles });
  });
});

// get  form to add article

router.get(`/new`, (req, res, next) => {
  res.render(`articleForm`);
});

router.post(`/`, (req, res, next) => {
  req.body.tats = req.body.tags.trim().split(`  `);
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    res.redirect(`/articles`);
  });
});

// get form to edit article
router.get(`/:id/edit`, (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    article.tags = article.tags.join(` `);
    if (err) return next(err);
    res.render(`editForm`, { article: article });
  });
});

// update article
router.post(`/:id/update`, (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, req.body, (err, article) => {
    req.body.tats = req.body.tags.trim().split(`  `);

    if (err) return next(err);
    res.redirect(`/articles/${id}`);
  });
});

// delete article
router.get(`/:id/delete`, (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndDelete(id, (err, article) => {
    if (err) return next(err);
    res.redirect(`/articles`);
  });
});

router.get(`/:id/inc`, (req, res, next) => {
  let id = req.params.id;

  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect(`/articles/${id}`);
  });
});

router.get(`/:id/dec`, (req, res, next) => {
  let id = req.params.id;

  Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect(`/articles/${id}`);
  });
});

// get single article

router.get(`/:id`, (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render(`article`, { article: article });
  });
});
module.exports = router;
