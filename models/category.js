const mongoose = require("mongoose");
const Product = require("./product");

const categorySchema = mongoose.Schema({
  name: {
    require: true,
    type: String,
    trim: true,
  },
  products: {
    type: Array,
    default: [],
  },
});

const Category = mongoose.model("Categorie", categorySchema);
module.exports = Category;
