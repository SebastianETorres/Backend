const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const productRouter = require('./productRouter');
const cartRouter = require('./cartRouter');


const mongoDBURI = 'mongodb://torres:123@ecommerce-shard-00-00.bfjpgrr.mongodb.net:27017,ecommerce-shard-00-01.bfjpgrr.mongodb.net:27017,ecommerce-shard-00-02.bfjpgrr.mongodb.net:27017/?ssl=true&replicaSet=atlas-3o2mgg-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Routes
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:pid', (req, res) => {
  const { pid } = req.params;
  const product = products.find((product) => product.id === Number(pid));

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
  } else {
    res.json(product);
  }
});

app.get('/home', (req, res) => {
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', (messageData) => {
    try {
      const message = new Message(messageData);
      message.save();
      io.emit('messageReceived', messageData);
    } catch (error) {
      console.error(error.message);
    }
  });

  socket.on('createProduct', (productData) => {
    try {
      const newProduct = addProduct(productData);
      io.emit('productCreated', newProduct);
    } catch (error) {
      console.error(error.message);
    }
  });

  socket.on('deleteProduct', (productId) => {
    try {
      deleteProduct(productId);
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
