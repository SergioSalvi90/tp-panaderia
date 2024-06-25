const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const productos = require('./productos.json');
const Product = require('./models/product');
const CartItem = require('./models/cartItem');
const { obtenerProductosDelCarrito } = require('./controllers/cartController');

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/panaderia')
    .then(() => {
        console.log('Conectado a MongoDB');
    }).catch((err) => {
        console.error('Error al conectar a MongoDB', err);
    });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rutas de productos
const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

// Ruta para mostrar el carrito de compras
app.get('/cart', async (req, res) => {
    const cart = await obtenerProductosDelCarrito();

    // Calcula el total de la compra
    let total = 0;
    cart.forEach(item => {
        total += item.productId.precio * item.quantity;
    });

    // Renderiza la vista del carrito
    res.render('cart', { cart: cart, total: total });
});


// Ruta para agregar productos al carrito
app.post('/cart/add/:id', async (req, res) => {
    const productId = req.params.id;
    const quantity = req.body.quantity || 1;

    try {
        // Validar si el productId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        // Convertir productId a ObjectId
        //const objectId = mongoose.Types.ObjectId(productId);

        // Verificar si ya existe un item del producto en el carrito
        let cartItem = await CartItem.findOne({ productId: productId });

        if (cartItem) {
            // Si el producto ya está en el carrito, incrementar la cantidad
            cartItem.quantity += parseInt(quantity);
        } else {
            // Si el producto no está en el carrito, agregarlo
            cartItem = new CartItem({
                productId: productId,
                quantity: parseInt(quantity)
            });
        }

        // Guardar el item del carrito en la base de datos
        await cartItem.save();

        // Redireccionar al carrito después de agregar el producto
        res.redirect('/cart');
    } catch (err) {
        console.error('Error al agregar producto al carrito:', err);
        res.status(500).send('Error al agregar producto al carrito');
    }
});


// Ruta para el checkout
app.post('/checkout', (req, res) => {
    res.redirect('/');
});

// Ruta principal
app.get('/', (req, res) => {
    
    res.render('index', { productos: productos });
});

// Configuración del servidor
const PORT = process.env.PORT || 3950;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

module.exports = app;
