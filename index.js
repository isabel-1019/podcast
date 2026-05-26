const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware para leer JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// PASO EXTRA: SERVIR LA INTERFAZ DE FLUTTERFLOW
// ==========================================
// Le dice a Node.js que la carpeta 'web' contiene los archivos visuales de FlutterFlow
app.use(express.static(path.join(__dirname, 'web')));

// Conexión a MongoDB (Asegúrate de cambiar los datos con tus credenciales)
const MONGO_URI = process.env.MONGO_URI || mongodb+srv://moralesolguinivanmauriciom352_db_user:Jr2tJL3phVZp8k@podcast.zpapegt.mongodb.net/?appName=podcast;
mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definición de Modelos
const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fechaCreacion: { type: Date, default: Date.now }
});
const Usuario = mongoose.model('Usuario', UsuarioSchema);

const PodcastSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  fechaCreacion: { type: Date, default: Date.now }
});
const Podcast = mongoose.model('Podcast', PodcastSchema);

// ==========================================
// RUTAS DE TU API (BACKEND)
// ==========================================

// Ruta para registrar Usuarios
app.post('/usuarios', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }
    const nuevoUsuario = new Usuario({ email, password });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario guardado con éxito', usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el usuario en la base de datos' });
  }
});

// Ruta para guardar Podcasts
app.post('/podcasts', async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const nuevoPodcast = new Podcast({ titulo, descripcion });
    await nuevoPodcast.save();
    res.status(201).json({ mensaje: 'Podcast guardado con éxito', podcast: nuevoPodcast });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el podcast' });
  }
});

// Ruta para ver todos los podcasts
app.get('/podcasts', async (req, res) => {
  try {
    const listaPodcasts = await Podcast.find();
    res.json(listaPodcasts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los podcasts' });
  }
});

// ==========================================
// ENRUTAMIENTO PRINCIPAL (FRONTEND)
// ==========================================
// Cuando alguien entre a tu URL principal (https://tu-app.onrender.com),
// el servidor le enviará el archivo index.html de tu FlutterFlow descargado.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
