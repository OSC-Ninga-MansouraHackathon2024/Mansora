const mongoose = require("mongoose");

const supplierSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 1.3,
    },
  },
  {
    timestamps: true,
  }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
