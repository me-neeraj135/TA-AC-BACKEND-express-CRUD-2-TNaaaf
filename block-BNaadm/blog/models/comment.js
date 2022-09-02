/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    content: { type: String },
    author: { type: String },
    articleId: { type: Schema.Types.ObjectId, ref: `Article` },
  },
  { timestamps: true }
);

let Comment = mongoose.model(`Comment`, commentSchema);
module.exports = Comment;
