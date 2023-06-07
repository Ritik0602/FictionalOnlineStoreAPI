import dotenv from "dotenv";
import Product from "../model/product.js";

dotenv.config();

export const getProduct = async (req, res) => {
  try {
    const { page = 1, limit = 5, name, description, category } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    let query = {};

    if (name) {
      query.name = { $regex: `.*${name}.*`, $options: "i" };
    }

    if (description) {
      query.description = { $regex: `.*${description}.*`, $options: "i" };
    }

    if (category) {
      query.category = { $regex: `.*${category}.*`, $options: "i" };
    }

    const products = await Product.find(query).skip(skip).limit(Number(limit));
    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, quantity } = req.body;

    const requiredFields = [
      { field: name, error: "provide product name" },
      { field: description, error: "provide product description" },
      { field: category, error: "provide product category" },
      { field: price, error: "provide product price" },
      { field: quantity, error: "provide product quantity" },
    ];

    const findMissingField = (fields) => {
      for (const field of fields) {
        if (!field.field) {
          return field;
        }
      }
      return null;
    };

    const missingField = findMissingField(requiredFields);
    if (missingField) {
      return res.status(404).json({ error: missingField.error });
    }

    const product = {
      name,
      description,
      category,
      price,
      quantity,
    };

    const newProduct = new Product(product);
    await newProduct.save();

    return res.status(200).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const findProductByName = async (name) => {
  return await Product.findOne({ name });
};

export const updateProduct = async (req, res) => {
  const updateProductById = async (productId, updatedData) => {
    await Product.findByIdAndUpdate(productId, { $set: updatedData });
  };

  try {
    const product = await findProductByName(req.params.name);
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    await updateProductById(product._id, req.body);
    return res.status(200).json({ msg: "product updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  const deleteProductById = async (productId) => {
    await Product.findByIdAndDelete(productId);
  };

  try {
    const product = await findProductByName(req.params.name);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await deleteProductById(product._id);
    return res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
