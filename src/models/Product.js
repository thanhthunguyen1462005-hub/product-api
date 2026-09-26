const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    pid: {
      type: String,
      required: [true, 'Product ID (pid) is required'],
      unique: true,
      trim: true,
    },
    pname: {
      type: String,
      required: [true, 'Product name (pname) is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required'],
      min: [0, 'Quantity must be greater than or equal to 0'],
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Product', productSchema);
