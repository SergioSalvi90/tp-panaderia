const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nombre: String,
    descripcion: String,
    precio: Number,
    imagen: String
});

module.exports = mongoose.model('Product', productSchema);
