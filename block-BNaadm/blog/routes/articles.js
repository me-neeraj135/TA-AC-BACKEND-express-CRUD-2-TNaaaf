/** @format */

let express = require(`express`);

let router = express.Router();
let Article = require(`../models/article`);
let Comment = require(`../models/comment`);

// list articles
router.get(`/`, (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render(`articles`, { articles: articles });
  });
});

// get article form

router.get(`/new`, (req, res, next) => {
  res.render(`articleForm`);
});
// create article
router.post(`/`, (req, res, next) => {
  req.body.tags = req.body.tags.trim().split(` `);
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    res.redirect(`/articles/${article.id}`);
  });
});

// edit form

router.get(`/:id/edit`, (req, res, next) => {
  let id = req.params.id;

  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render(`editForm`, { article });
  });
});

// update  form

router.post(`/:id/update`, (req, res, next) => {
  let id = req.params.id;
  req.body.tags = req.body.tags.trim().split(` `);
  Article.findByIdAndUpdate(id, req.body, (err, article) => {
    if (err) return next(err);
    res.redirect(`/articles/` + id);
  });
});

// delete document
router.get(`/:id/delete`, (req, res, next) => {
  let id = req.params.id;

  Article.findByIdAndDelete(id, (err, article) => {
    if (err) return next(err);
    Comment.deleteMany({ articleId: article._id }, (err, msg) => {
      if (err) return next(err);
      res.redirect(`/articles`);
    });
  });
});

// increase likes
router.get(`/:id/inc`, (req, res, next) => {
  let id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect(`/articles/` + id);
  });
});

// decrease likes
router.get(`/:id/dec`, (req, res, next) => {
  let id = req.params.id;
  Article.findById(id, (err, article) => {
    if (article.likes > 0) {
      Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, article) => {
        if (err) return next(err);
        res.redirect(`/articles/` + id);
      });
    } else {
      res.redirect(`/articles/` + id);
    }
  });
});
// find single document
// router.get("/:id", (req, res, next) => {
//   let id = req.params.id;

//   Article.findById(id, (err, article) => {
//     if (err) return next(err);
//     Comment.find({ articleId: id }, (err, comments) => {
//       res.render("articleDetails", { article, comments });
//     });
//   });
// });

router.get(`/:id`, (req, res, next) => {
  let id = req.params.id;

  Article.findById(id)
    .populate(`comments`)
    .exec((err, article) => {
      if (err) return next(err);
      console.log(err, article);
      res.render(`articleDetails`, { article });
    });
});

// handle comments

router.post(`/:id/comment`, (req, res, next) => {
  let id = req.params.id;
  req.body.articleId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, comment) => {
        if (err) return next(err);
        res.redirect(`/articles/` + id);
      }
    );
  });
});

module.exports = router;
