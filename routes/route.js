import express from "express";

import {
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { signUp } from "../controllers/userSignUpController.js";
import { login } from "../controllers/userLoginController.js";
import { authenticateToken } from "../controllers/authController.js";
import {
  getOrders,
  addToCard,
  updateOrder,
  deleteOrder,
  checkoutAll,
} from "../controllers/orderController.js";

const router = express.Router();

//Login and Signup routes
router.post("/login", login);
router.post("/signUp", signUp);

// Product Routes
router.get("/product", authenticateToken, getProduct);
router.post("/product", authenticateToken, createProduct);
router.put("/product/:name", authenticateToken, updateProduct);
router.delete("/product/:name", authenticateToken, deleteProduct);

// Order Routes
router.get("/order", authenticateToken, getOrders);
router.post("/order", authenticateToken, addToCard);
router.put("/order/:productName", authenticateToken, updateOrder);
router.delete("/order/:productName", authenticateToken, deleteOrder);

// Checkout Routes
router.post("/checkout", authenticateToken, checkoutAll);

export default router;
