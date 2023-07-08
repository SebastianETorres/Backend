const express = require('express');
const fs = require('fs');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const ProductManager = require('./primerDesafio');

const productManager = new ProductManager('C:/Users/usuario/Desktop/Backend/node_modules/products.json');
productManager.loadFromFile();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const productRouter = require('./productRouter');
app.use('/api/products', productRouter);

const cartRouter = require('./cartRouter');
app.use('/api/carts', cartRouter);

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

app.get('/home', async (req, res) => {
  try {
    const products = productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = productManager.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createProduct', (productData) => {
    try {
      const newProduct = productManager.addProduct(productData);
      io.emit('productCreated', newProduct);
    } catch (error) {
      console.error(error.message);
    }
  });

  socket.on('deleteProduct', (productId) => {
    try {
      productManager.deleteProduct(productId);
      io.emit('productDeleted', productId);
    } catch (error) {
      console.error(error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Servidor express escuchando en el puerto ${port}`);
});
