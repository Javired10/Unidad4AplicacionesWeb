const mongoose = require('mongoose');
const Producto = require('./models/Producto');
const Category = require('./models/Category');

const seedCategories = [
    { nombre: 'Electrónica' },
    { nombre: 'Ropa' },
    { nombre: 'Hogar' },
    { nombre: 'Deportes' },
    { nombre: 'Libros' }
];

const seedProducts = [
    { nombre: 'Smartphone X', descripcion: 'Teléfono inteligente de última generación', precio: 799.99, imageUrl: 'https://via.placeholder.com/150', stock: 10 },
    { nombre: 'Laptop Pro', descripcion: 'Potente laptop para desarrollo', precio: 1299.99, imageUrl: 'https://via.placeholder.com/150', stock: 5 },
    { nombre: 'Auriculares Noise Cancelling', descripcion: 'Sonido puro sin distracciones', precio: 199.99, imageUrl: 'https://via.placeholder.com/150', stock: 15 },
    { nombre: 'Camiseta Algodón', descripcion: 'Camiseta cómoda y duradera', precio: 19.99, imageUrl: 'https://via.placeholder.com/150', stock: 50 },
    { nombre: 'Jeans Slim Fit', descripcion: 'Jeans modernos y ajustados', precio: 49.99, imageUrl: 'https://via.placeholder.com/150', stock: 30 },
    { nombre: 'Cafetera Express', descripcion: 'Café perfecto cada mañana', precio: 89.99, imageUrl: 'https://via.placeholder.com/150', stock: 8 },
    { nombre: 'Lámpara de Mesa', descripcion: 'Iluminación suave para lectura', precio: 25.99, imageUrl: 'https://via.placeholder.com/150', stock: 20 },
    { nombre: 'Mancuernas 5kg', descripcion: 'Set de pesas para entrenamiento', precio: 34.99, imageUrl: 'https://via.placeholder.com/150', stock: 12 },
    { nombre: 'Balón de Fútbol', descripcion: 'Balón profesional de cuero', precio: 29.99, imageUrl: 'https://via.placeholder.com/150', stock: 25 },
    { nombre: 'Libro de JavaScript', descripcion: 'Aprende JS desde cero', precio: 39.99, imageUrl: 'https://via.placeholder.com/150', stock: 40 },
    { nombre: 'Novela de Misterio', descripcion: 'Un thriller atrapante', precio: 15.99, imageUrl: 'https://via.placeholder.com/150', stock: 100 },
    { nombre: 'Teclado Mecánico', descripcion: 'Ideal para gaming y escritura', precio: 110.00, imageUrl: 'https://via.placeholder.com/150', stock: 7 }
];

async function seedDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/miInventario');
        console.log('Conectado a MongoDB para sembrar datos...');

        // Limpiar datos existentes
        await Producto.deleteMany({});
        await Category.deleteMany({});
        console.log('Datos antiguos eliminados.');

        // Insertar categorías
        const createdCategories = await Category.insertMany(seedCategories);
        console.log('Categorías insertadas.');

        // Asignar categorías a productos y guardar
        const productsWithCategory = seedProducts.map((prod, index) => ({
            ...prod,
            categoryId: createdCategories[index % createdCategories.length]._id
        }));

        await Producto.insertMany(productsWithCategory);
        console.log('Productos insertados.');

        console.log('Base de datos sembrada con éxito.');
        process.exit(0);
    } catch (err) {
        console.error('Error al sembrar la base de datos:', err);
        process.exit(1);
    }
}

seedDB();
