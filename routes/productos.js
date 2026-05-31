const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Producto = require('../models/Producto');
const { body, validationResult } = require('express-validator');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ 
    storage,
    limits: { fileSize: 2000000 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb('Error: Solo se permiten imágenes (jpg, jpeg, png, gif)');
    }
});

// Listar productos
router.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const productos = await Producto.find().lean();
        res.render('productos', { productos });
    } catch (err) {
        res.status(500).send('Error al listar productos');
    }
});

// Formulario nuevo
router.get('/nuevo', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('producto-form');
});

// Formulario editar
router.get('/editar/:id', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const producto = await Producto.findById(req.params.id).lean();
        if (!producto) return res.status(404).send('Producto no encontrado');
        res.render('producto-form', { producto });
    } catch (err) {
        res.status(500).send('Error al buscar producto');
    }
});

// Acción editar
router.post('/editar/:id', upload.single('imagen'), async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        const updateData = {
            nombre: req.body.nombre,
            precio: req.body.precio,
            descripcion: req.body.descripcion
        };
        if (req.file) updateData.imagen = req.file.filename;
        await Producto.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/productos');
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).send('Error al actualizar producto');
    }
});

// Acción eliminar
router.post('/eliminar/:id', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.redirect('/productos');
    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).send('Error al eliminar el producto');
    }
});

// Acción crear
router.post('/', upload.single('imagen'), [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.render('productos', { errors: errors.array() });

    try {
        const nuevoProducto = new Producto({
            nombre: req.body.nombre,
            precio: req.body.precio,
            descripcion: req.body.descripcion,
            imagen: req.file ? req.file.filename : 'default.jpg'
        });
        await nuevoProducto.save();
        res.redirect('/productos');
    } catch (err) {
        res.status(500).send('Error al crear producto');
    }
});

module.exports = router;
