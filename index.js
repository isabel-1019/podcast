const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middlewares obligatorios
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB (Mantén tu enlace real aquí)
const MONGO_URI = process.env.MONGO_URI || 'tu_conexion_real_de_mongodb_atlas';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// ==========================================
// DEFINICIÓN DE MODELOS (Esquema de Podcasts)
// ==========================================
const PodcastSchema = new mongoose.Schema({
  titulo: String,
  genero: String,
  duracionMinutos: Number,
  esPremium: Boolean,
  reproducciones: { type: Number, default: 0 },
  comentarios: [
    {
      usuario: String,
      texto: String,
      fecha: { type: Date, default: Date.now }
    }
  ]
});

const Podcast = mongoose.model('Podcast', PodcastSchema);

// ==========================================
// TRABAJO S10: OPERADORES LÓGICOS ($and, $or, $not)
// ==========================================

// Consulta Compleja: Buscar podcasts de Terror/Misterio que dure menos de 30 mins O que sean gratis
app.get('/podcasts/buscar-complejo', async (req, res) => {
  try {
    const resultados = await Podcast.find({
      $and: [
        { genero: 'Terror' },
        {
          $or: [
            { duracionMinutos: { $lt: 30 } },
            { esPremium: { $not: { $eq: true } } } // Que NO sea premium (Gratis)
          ]
        }
      ]
    });
    res.json({ mensaje: "Consulta S10 completada con éxito", data: resultados });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// TRABAJO S11: CRUD (Update con $set, $inc y $push)
// ==========================================

// 1. Agregar un nuevo comentario a un Podcast específico ($push)
app.post('/podcasts/:id/comentario', async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, texto } = req.body;

    // Usamos $push para meter el comentario en el array sin borrar los anteriores
    const podcastActualizado = await Podcast.findByIdAndUpdate(
      id,
      { $push: { comentarios: { usuario, texto } } },
      { new: true }
    );

    res.json({ mensaje: "Comentario añadido con éxito", data: podcastActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Incrementar reproducciones ($inc) y actualizar género ($set) de golpe
app.put('/podcasts/:id/reproducir', async (req, res) => {
  try {
    const { id } = req.params;

    const podcastActualizado = await Podcast.findByIdAndUpdate(
      id,
      { 
        $inc: { reproducciones: 1 },         // Incrementa en +1 las reproducciones automáticamente
        $set: { genero: 'Terror Psicológico' } // Modifica o asegura el valor del campo género
      },
      { new: true }
    );

    res.json({ mensaje: "Métricas del podcast S11 actualizadas", data: podcastActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// REDIRECCIÓN MAESTRA A FLUTTERFLOW
// ==========================================
app.get('*', (req, res) => {
  res.redirect('https://TU-APP-DE-FLUTTERFLOW.flutterflow.app');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
