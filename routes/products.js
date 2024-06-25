const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/product');


router.get('/load', async (req, res) => {
    const filePath = path.join(__dirname, '../productos.json');
    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error al leer el archivo JSON', err);
            return res.status(500).send('Error al leer el archivo JSON');
        }

        try {
            const productos = JSON.parse(data);
            await Product.insertMany(productos);
            res.send('Productos cargados correctamente');
        } catch (err) {
            console.error('Error al insertar productos en MongoDB', err);
            res.status(500).send('Error al insertar productos en MongoDB');
        }
    });
});


router.get('/', async (req, res) => {
    try {
        const productos = await Product.find();
        res.render('products', { productos });
    } catch (err) {
        console.error('Error al obtener productos de MongoDB', err);
        res.status(500).send('Error al obtener productos de MongoDB');
    }
});

module.exports = router;
