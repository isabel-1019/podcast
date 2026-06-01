/**
 * S11: Script de automatización para añadir comentarios
 * Sintaxis nativa de MongoDB para modificar arreglos de documentos
 */

const mongoose = require('mongoose');

// Cambia esto por tu cadena real si decides correrlo de forma local
const MONGO_URI = 'tu_conexion_real_de_mongodb_atlas'; 

async function ejecutarActualizacion() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a la base de datos para la modificación S11...');

    // Ejemplo de ID de un documento de tu colección
    const podcastId = "65f1234567890123456789ab"; 

    // Añadir un nuevo comentario al array 'comments' usando la sintaxis del proyecto
    const resultado = await mongoose.connection.db.collection('podcasts').updateOne(
      { _id: new mongoose.Types.ObjectId(podcastId) },
      { 
        $push: { 
          comentarios: { 
            usuario: "OyenteNocturno", 
            texto: "¡Este episodio de terror me dejó sin dormir!", 
            fecha: new Date() 
          } 
        } 
      }
    );

    console.log(`Documentos modificados con éxito: ${resultado.modifiedCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Error al ejecutar la actualización:', error);
    process.exit(1);
  }
}

ejecutarActualizacion();
