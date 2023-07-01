const express = require('express');
const router = express.Router();
const ProductManager = require('./primerDesafio');

const productManager = new ProductManager('C:/Users/usuario/Desktop/Backend/node_modules/products.json');
productManager.loadFromFile();

router.get('/', (req, res) => {
  try {
    const { limit } = req.query;
    const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:pid', (req, res) => {
  try {
    const { pid } = req.params;
    const product = productManager.getProductById(Number(pid));

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;
    const newProduct = productManager.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      thumbnails
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:pid', (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;
    const updatedProduct = productManager.updateProduct(Number(pid), {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      thumbnails
    });
    if (!updatedProduct) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(updatedProduct);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:pid', (req, res) => {
  try {
    const { pid } = req.params;
    productManager.deleteProduct(Number(pid));
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
