const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  publishedDate: { type: Date, required: true },
  updatedDate: { type: Date, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  photo: { type: String },
  additional: {
    category: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, required: true },
    price: { type: Number },
    phone: { type: String },
    area: { type: String },
  },
});


module.exports = mongoose.model('Post', postSchema);
