import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true],
  },
  productName: {
    type: String,
    required: [true],
    unique: true,
  },
  productQuantity: {
    type: Number,
    require: [true],
  },
  productPrice: {
    type: Number,
    required: [true],
  },
});

const orderDetails = mongoose.model("orderDetails", orderSchema);

export default orderDetails;
