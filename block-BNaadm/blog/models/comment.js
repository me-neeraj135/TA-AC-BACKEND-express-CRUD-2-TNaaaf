/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;

let commentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: String },
    articleId: { type: Schema.Types.ObjectId, ref: `Article`, required: true },
    likes: { type: Number, default: 0 },
  },

  { timestamps: true }
);

let Comment = mongoose.model(`Comment`, commentSchema);
module.exports = Comment;
