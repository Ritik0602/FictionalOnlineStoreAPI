import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true],
    unique: true,
  },
  description: {
    type: String,
    required: [true],
  },
  category: {
    type: String,
    require: [true],
  },
  price: {
    type: Number,
    required: [true],
  },
  quantity: {
    type: Number,
    require: [true],
  },
});

const product = mongoose.model("product", productSchema);

export default product;
