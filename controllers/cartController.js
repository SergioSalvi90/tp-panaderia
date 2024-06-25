const CartItem = require('../models/cartItem');
const Product = require('../models/product');

const obtenerProductosDelCarrito = async () => {
    try {
        const cartItems = await CartItem.find({}).populate('productId').exec();
        
        const cart = cartItems.map(item => {
            return {
                productId: item.productId._id,
                nombre: item.productId.nombre,
                descripcion: item.productId.descripcion,
                precio: item.productId.precio,
                imagen: item.productId.imagen,
                cantidad: item.quantity
            };
        });

        return cart;
    } catch (error) {
        console.error('Error al obtener productos del carrito:', error);
        throw error;
    }
};

module.exports = {
    obtenerProductosDelCarrito
};
