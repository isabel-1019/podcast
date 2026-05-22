const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://...";
const client = new MongoClient(uri);

// Conectar UNA sola vez al iniciar el servidor
async function main() {
    await client.connect();
    console.log("Conectado a MongoDB");

    const db = client.db('podcast');
    const episodios = db.collection('episodios');

    app.get('/podcasts', async (req, res) => {
        try {
            const resultados = await episodios.find({}).toArray();
            res.status(200).json(resultados);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post('/podcasts', async (req, res) => {
        try {
            const nuevo = req.body;
            const resultado = await episodios.insertOne(nuevo);
            res.status(201).json({ mensaje: "Guardado con éxito", id: resultado.insertedId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
}

main().catch(console.error);
