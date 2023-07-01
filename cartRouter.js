const express = require('express');
const router = express.Router();
const ProductManager = require('./primerDesafio');

const productManager = new ProductManager('C:/Users/usuario/Desktop/Backend/node_modules/products.json');
productManager.loadFromFile();

router.post('/', (req, res) => {
  try {
    const newCart = {
      id: generateCartId(), 
    };
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:cid', (req, res) => {
  try {
    const { cid } = req.params;
    const cart = {}; 
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
    } else {
      res.json(cart.products);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = {}; 
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const product = productManager.getProductById(Number(pid));
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const existingProductIndex = cart.products.findIndex((item) => item.product === pid);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
