require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const path = require('path');
const { engine } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

// Configuración de vista con Handlebars y corrección de acceso a prototipos
app.engine('.hbs', engine({ 
    extname: '.hbs',
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

const server = http.createServer(app);
const io = new Server(server);

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sesión con expiración de 1 hora
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'mi-secreto-super-seguro',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production' 
    },
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/miInventario' 
    })
});
app.use(sessionMiddleware);

// Middleware para pasar la sesión a las vistas
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Conexión a MongoDB
const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/miInventario';
mongoose.connect(dbUri)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar:', err));

// Integrar sesión con Socket.io
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Chat con Socket.io
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        const username = socket.request.session?.user?.username || 'Anónimo';
        io.emit('chat message', { user: username, text: msg });
    });
});

const authRoutes = require('./routes/auth');
const productoRoutes = require('./routes/productos');
const apiRoutes = require('./routes/api');
app.use('/', authRoutes);
app.use('/productos', productoRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res) => res.render('home'));

// Endpoint de salud para Railway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
