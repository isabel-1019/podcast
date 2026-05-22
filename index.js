const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Permite que FlutterFlow se conecte sin problemas de CORS


const uri = "mongodb+srv://moralesolguinivanmauriciom352_db_user:Jr2tJL3phVZp8k@podcast.zpapegt.mongodb.net/?appName=podcast";
const client = new MongoClient(uri);

// Endpoint para LEER los podcasts de la base de datos
app.get('/podcasts', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('podcast'); 
        const coleccion = database.collection('episodios'); // Asegúrate que tu colección se llame así en Mongo
        const resultados = await coleccion.find({}).toArray();
        res.status(200).json(resultados);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para GUARDAR un nuevo podcast
app.post('/podcasts', async (req, res) => {
    try {
        await client.connect();
        const database = client.db('podcast');
        const coleccion = database.collection('episodios');
        const nuevoPodcast = req.body; 
        const resultado = await coleccion.insertOne(nuevoPodcast);
        res.status(201).json({ mensaje: "Guardado con éxito", id: resultado.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
