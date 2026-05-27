const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Para que FlutterFlow pueda mandar datos sin bloqueos
const app = express();

// Middlewares obligatorios
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB (Pon aquí tu enlace real de Atlas)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://moralesolguinivanmauriciom352_db_user:Jr2tJL3phVZp8k@podcast.zpapegt.mongodb.net/?appName=podcast';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// ==========================================
// RUTAS DE TU API (Para guardar tus datos)
// ==========================================

// Ruta para registrar Usuarios
app.post('/usuarios', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Datos recibidos desde FlutterFlow:", req.body);
    // Aquí puedes dejar tu lógica existente de mongoose para guardar el usuario...
    res.status(201).json({ mensaje: 'Usuario guardado con éxito' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el usuario' });
  }
});

// ==========================================
// REDIRECCIÓN MAESTRA (Para mostrar tu app)
// ==========================================
// Cuando la gente entre a tu link de Render, se les abrirá tu diseño al instante sin pantallas en blanco
app.get('*', (req, res) => {
  // Pega aquí adentro el enlace que te dio FlutterFlow en el Paso 1
  res.redirect('https://mindstream-podcast-app-template-z4dhrq.flutterflow.app');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
