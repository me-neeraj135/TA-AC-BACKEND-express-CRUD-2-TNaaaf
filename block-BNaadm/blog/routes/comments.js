/** @format */

let express = require(`express`);
const { route } = require("../app");

let router = express.Router();

let Article = require(`../models/article`);
let Comment = require(`../models/comment`);

router.get(`/:id/edit`, (req, res, next) => {
  let id = req.params.id;

  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render(`updateComment`, { comment });
  });
});

router.post(`/:id`, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
    if (err) return next(err);
    res.redirect(`/articles/` + comment.articleId);
  });
});

router.get(`/:id/delete`, (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndDelete(id, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      comment.articleId,
      { $pull: { comments: comment._id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect(`/articles/` + comment.articleId);
      }
    );
  });
});

module.exports = router;
