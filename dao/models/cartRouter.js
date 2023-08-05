const express = require('express');
const router = express.Router();
const dao = require('../dao');
const { Cart, Message, Product } = require('./models');

router.post('/', async (req, res) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);
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

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const existingProductIndex = cart.products.findIndex((item) => item.product.toString() === pid);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    cart.products = cart.products.filter(item => item.product.toString() !== pid);
    await cart.save();
    
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    cart.products = products;
    await cart.save();

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const existingProduct = cart.products.find(item => item.product.toString() === pid);
    if (existingProduct) {
      existingProduct.quantity = quantity;
      await cart.save();
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'Product not found in cart' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
