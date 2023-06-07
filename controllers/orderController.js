import dotenv from "dotenv";
import Order from "../model/order.js";
import Product from "../model/product.js";

dotenv.config();

export const getOrders = async (req, res) => {
  try {
    const { username } = req.user;
    const { page = 1, limit = 5 } = req.query;

    const skip = (page - 1) * limit;

    const orders = await Order.find({ username }).skip(skip).limit(limit);

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const addToCard = async (req, res) => {
  try {
    const { productName, quantity = 1 } = req.body;
    console.log(req.body);
    if (!productName) {
      return res.status(400).json({ error: "Provide product name" });
    }

    const product = await Product.findOne({ name: productName });

    if (!product || product.quantity <= 0 || product.quantity < quantity) {
      return res
        .status(400)
        .json({ error: "Invalid product or unavailable quantity" });
    }

    const orderFilter = {
      username: req.user.username,
      productName,
    };

    const prevOrderDetails = await Order.findOne(orderFilter);

    if (prevOrderDetails) {
      const updatedQuantity =
        Number(quantity) + Number(prevOrderDetails.productQuantity);

      if (product.quantity < updatedQuantity) {
        return res.status(400).json({ error: "Unavailable quantity" });
      }

      await Order.findByIdAndUpdate(prevOrderDetails._id, {
        productQuantity: updatedQuantity,
      });

      return res.status(200).json(prevOrderDetails);
    }

    const orderDetails = {
      username: req.user.username,
      productName,
      productQuantity: quantity,
      productPrice: product.price,
    };

    const newOrder = new Order(orderDetails);
    await newOrder.save();

    return res.status(200).json(newOrder);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { username } = req.user;
    const { productName } = req.params;

    const order = await Order.findOne({ username, productName });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { quantity } = req.body;
    const updatedQuantity = order.productQuantity - quantity;

    if (updatedQuantity <= 0) {
      await Order.findByIdAndDelete(order._id);
    } else {
      order.productQuantity = updatedQuantity;
      await order.save();
    }

    return res.status(200).json({ msg: "Order Updated successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { username } = req.user;
    const { productName } = req.params;

    const order = await Order.findOneAndDelete({ username, productName });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({ msg: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const checkoutAll = async (req, res) => {
  try {
    const { username } = req.user;

    // Fetch all orders for the current user
    const orders = await Order.find({ username });

    if (orders.length === 0) {
      return res.status(404).json({ error: "No orders to process" });
    }

    let totalAmount = 0;

    for (const order of orders) {
      const { productName, productQuantity } = order;

      const product = await Product.findOne({ name: productName });

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product ${productName} not found` });
      }

      if (productQuantity > product.quantity) {
        return res
          .status(404)
          .json({ error: `Product ${productName} is out of stock` });
      }

      const amount = productQuantity * product.price;
      totalAmount += amount;

      product.quantity -= productQuantity;
      await product.save();

      await Order.findByIdAndDelete(order._id);
    }

    return res.status(200).json({ totalAmount });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
