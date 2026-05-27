const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware para leer JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS (FLUTTER)
// ==========================================
// Forzamos a Express a servir la carpeta web y TODAS sus subcarpetas correctamente
const webPath = path.join(__dirname, 'web');
app.use(express.static(webPath));

// Conexión a MongoDB (Usa tu cadena real aquí)
const MONGO_URI = process.env.MONGO_URI || 'tu_conexion_real_de_mongodb';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// ==========================================
// RUTAS DE TU API
// ==========================================

app.post('/usuarios', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Faltan campos' });
    res.status(201).json({ mensaje: 'Usuario recibido' });
  } catch (error) {
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// ==========================================
// ENRUTAMIENTO PRINCIPAL (FRONTEND)
// ==========================================
// Si alguien busca cualquier ruta que no sea de la API, le entregamos el index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(webPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
