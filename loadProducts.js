const mongoose = require('mongoose');
const Product = require('./models/product');
const productos = require('./productos.json');

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/panaderia', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');

        // Limpiar la colección antes de insertar
        await Product.deleteMany({});

        // Insertar productos
        await Product.insertMany(productos);

        console.log('Productos insertados correctamente');
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('Error al conectar a MongoDB', err);
    });
