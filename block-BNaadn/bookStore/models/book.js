/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;

let bookSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String },
    pages: { type: Number, default: 0 },
    publication: { type: String },
    image: { type: String},
    category: { type: String },
    author: { type: Schema.Types.ObjectId, ref: `Author` },
  },
  { timestamps: true }
);

let Book = mongoose.model(`Book`, bookSchema);
module.exports = Book;
