const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.nextId = 1;
  }

  addProduct(productData) {
    const { title, description, price, thumbnail, code, stock } = productData;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Todos los campos son obligatorios.');
    }

    const existingProduct = this.products.find((product) => product.code === code);
    if (existingProduct) {
      throw new Error('El código del producto ya existe.');
    }

    const newProduct = {
      id: this.nextId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    };

    this.products.push(newProduct);
    this.saveToFile();
    return newProduct;
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      console.error('Not found');
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      console.error('Not found');
      return;
    }

    const updatedProduct = { ...this.products[productIndex], ...updatedFields };
    this.products[productIndex] = updatedProduct;
    this.saveToFile();
    return updatedProduct;
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      console.error('Not found');
      return;
    }

    this.products.splice(productIndex, 1);
    this.saveToFile();
  }

  saveToFile() {
    const data = JSON.stringify(this.products);
    fs.writeFileSync(this.path, data);
  }

  loadFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
      if (Array.isArray(this.products)) {
        const lastProduct = this.products[this.products.length - 1];
        this.nextId = lastProduct ? lastProduct.id + 1 : 1;
      } else {
        this.products = [];
        this.nextId = 1;
      }
    } catch (error) {
      this.products = [];
      this.nextId = 1;
    }
  }
}

const productManager = new ProductManager('C:/Users/usuario/Desktop/Backend/products.json');
productManager.loadFromFile();

try {
  productManager.addProduct({
    title: 'Producto 1',
    description: 'Descripción del Producto 1',
    price: 10,
    thumbnail: 'ruta/imagen1.png',
    code: 'ABC123',
    stock: 5
  });

  productManager.addProduct({
    title: 'Producto 2',
    description: 'Descripción del Producto 2',
    price: 20,
    thumbnail: 'ruta/imagen2.png',
    code: 'DEF456',
    stock: 8
  });

  productManager.addProduct({
    title: 'Producto 3',
    description: 'Descripción del Producto 3',
    price: 30,
    thumbnail: 'ruta/imagen3.png',
    code: 'GHI789',
    stock: 12
  });
} catch (error) {
  console.error(error.message);
}

const allProducts = productManager.getProducts();
console.log(allProducts);
a
