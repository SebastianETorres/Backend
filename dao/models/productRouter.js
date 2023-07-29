const express = require('express');
const router = express.Router();
const dao = require('./dao');

router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await dao.getProducts(limit);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await dao.getProductById(pid);

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

router.post('/', async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;
    const newProduct = await dao.createProduct({
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

router.put('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;
    const updatedProduct = await dao.updateProduct(pid, {
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

router.delete('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;
    await dao.deleteProduct(pid);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
