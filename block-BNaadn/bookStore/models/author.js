/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;

let authorSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, toLowercase: true, match: /@/ },
    country: { type: String },
    bookId: [{ type: Schema.Types.ObjectId, ref: `Book` }],
  },
  { timestamps: true }
);

let Author = mongoose.model(`Author`, authorSchema);
module.exports = Author;
