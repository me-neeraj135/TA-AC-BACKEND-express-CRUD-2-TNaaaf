/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;

let articleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  tags: { type: [String] },
  author: { type: String },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
});

let Article = mongoose.model(`Article`, articleSchema);

module.exports = Article;
