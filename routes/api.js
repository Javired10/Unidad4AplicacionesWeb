const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Category = require('../models/Category');
const { body, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// --- PRODUCTOS ---

// GET /api/products - Obtener todos los productos
router.get('/products', async (req, res) => {
    try {
        const products = await Producto.find().populate('categoryId');
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener productos' });
    }
});

// GET /api/products/:id - Obtener un producto por ID
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Producto.findById(req.params.id).populate('categoryId');
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
});

// POST /api/products - Crear un producto
router.post('/products', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
    body('precio').isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor a 0'),
    body('imageUrl').notEmpty().withMessage('La URL de la imagen es obligatoria'),
    body('categoryId').notEmpty().withMessage('La categoría es obligatoria'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor o igual a 0'),
], validate, async (req, res) => {
    try {
        const product = new Producto(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});

// PUT /api/products/:id - Actualizar un producto
router.put('/products/:id', [
    body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('descripcion').optional().notEmpty().withMessage('La descripción no puede estar vacía'),
    body('precio').optional().isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
    body('imageUrl').optional().notEmpty().withMessage('La URL de la imagen no puede estar vacía'),
    body('categoryId').optional().notEmpty().withMessage('La categoría es obligatoria'),
    body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser >= 0'),
], validate, async (req, res) => {
    try {
        const product = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

// DELETE /api/products/:id - Eliminar un producto
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Producto.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

// --- CATEGORÍAS ---

// GET /api/categories - Obtener todas las categorías
router.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener categorías' });
    }
});

module.exports = router;
