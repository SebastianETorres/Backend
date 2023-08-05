const express = require('express');
const router = express.Router();
const dao = require('../dao'); 
const { Cart, Message, Product } = require('../models/models'); 
const productManager = require('./primerDesafio');


router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    const productsPerPage = limit ? parseInt(limit) : 10;
    const currentPage = page ? parseInt(page) : 1;
    const skip = (currentPage - 1) * productsPerPage;
    
    const filter = query ? { category: query } : {};
    const sortOptions = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
    
    const totalCount = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / productsPerPage);

    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(productsPerPage);

    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page: currentPage,
      hasPrevPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      prevLink: prevPage ? `/api/products?limit=${productsPerPage}&page=${prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: nextPage ? `/api/products?limit=${productsPerPage}&page=${nextPage}&sort=${sort}&query=${query}` : null
    });
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
