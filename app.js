const express = require('express');
const fs = require('fs');
const ProductManager = require('./primerDesafio');

const productManager = new ProductManager('C:/Users/usuario/Desktop/Backend/products.json');
productManager.loadFromFile();

const app = express();

app.get('/products', async (req, res) => {
  try {
    const { limit } = req.query;

    const products = limit ? productManager.getProducts().slice(0, limit) : productManager.getProducts();

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/products/:pid', async (req, res) => {
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

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor express escuchando en el puerto ${port}`);
});
