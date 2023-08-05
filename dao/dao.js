const { Cart, Message, Product } = require('./models/models');


class DAO {
  async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      throw new Error('Error creating product');
    }
  }

  async getProductById(productId) {
    try {
      return await Product.findById(productId);
    } catch (error) {
      throw new Error('Error fetching product by ID');
    }
  }

  async updateProduct(productId, productData) {
    try {
      return await Product.findByIdAndUpdate(productId, productData, { new: true });
    } catch (error) {
      throw new Error('Error updating product');
    }
  }

  async deleteProduct(productId) {
    try {
      await Product.findByIdAndDelete(productId);
    } catch (error) {
      throw new Error('Error deleting product');
    }
  }

  async getProducts(limit) {
    try {
      if (limit) {
        return await Product.find().limit(Number(limit));
      } else {
        return await Product.find();
      }
    } catch (error) {
      throw new Error('Error fetching products');
    }
  }
}

module.exports = new DAO();
