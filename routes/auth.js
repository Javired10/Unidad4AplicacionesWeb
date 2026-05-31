const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Registro de usuario
router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: 'Error al registrar usuario' });
    }
});

// Login
router.get('/login', (req, res) => res.render('login'));
router.post('/login', async (req, res) => {
    // Lógica simple de login
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/productos');
    } else {
        res.render('login', { error: 'Credenciales inválidas' });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
