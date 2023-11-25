const express = require('express');
const router = express.Router();
const LocalModel  = require('../models/Local');
const moment = require('moment');

router.get('/getLocales', async (req, res) => {
    try {
      const locales = await LocalModel.find();
      console.log("Locales encontrados: ",locales);
      res.json(locales);
    } catch (error) {
      console.error('Error al obtener locales desde la base de datos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  router.post('/registrarLocales', async (req, res) => {
    try {
      const { _id, ...datosLocal } = req.body; // Extraer el _id (si existe) y los datos del local
  
      if (_id) {
        // Si existe _id, se trata de una operación de edición
        const resultado = await LocalModel.findByIdAndUpdate(_id, datosLocal, { new: true });
        console.log("Local editado: ", resultado);
        res.json(resultado);
      } else {
        // Si no existe _id, se trata de una operación de guardado
        const nuevoLocal = new LocalModel(datosLocal);
        const resultado = await nuevoLocal.save();
        console.log("Local registrado: ", resultado);
        res.json(resultado);
      }
    } catch (error) {
      console.error('Error al registrar o editar el local:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  router.get('/getLocalesByUser/:usuarioLocal', async (req, res) => {
    console.log("parametros",req.params);
    try {
      
      const { usuarioLocal } = req.params;
      
      const locales = await LocalModel.find({ usuarioLocal });
      console.log("Locales encontrados para el usuarioLocal:", locales);
      
      res.json(locales);
    } catch (error) {
      console.error('Error al obtener locales desde la base de datos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  router.post('/seguirLocal/:localId', async (req, res) => {
    try {
      const { localId } = req.params; // Obtener el ID del local desde los parámetros de la solicitud
      const { rating, comentario, usuario } = req.body; // Obtener datos del seguimiento
      console.log("LocalID", localId);
      const local = await LocalModel.findById(localId); // Buscar el local por su ID
      console.log("Local que llega de BD", local);
      if (!local) {
        return res.status(404).json({ error: 'Local no encontrado' });
      }
  
      // Crear el objeto de seguimiento con los datos recibidos
      const seguimiento = {
        rating,
        comentario,
        usuario,
      };
  
      // Agregar el seguimiento al array de usuarios del local
      local.usuarios.push(seguimiento);
  
      // Guardar los cambios en la base de datos
      const resultado = await local.save();
  
      res.json(resultado); // Enviar la respuesta con el local actualizado
    } catch (error) {
      console.error('Error al seguir el local:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  router.get('/getLocalesNoCoinciden/:usuarioLocal', async (req, res) => {
    try {
      const { usuarioLocal } = req.params;
  
      const localesNoCoinciden = await LocalModel.find({
        'usuarios.usuario': { $ne: usuarioLocal }
      });
  
      console.log("Locales donde el usuario no coincide:", localesNoCoinciden);
  
      res.json(localesNoCoinciden);
    } catch (error) {
      console.error('Error al obtener locales donde el usuario no coincide:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
  
  // Obtener todos los locales donde el usuario sí coincide
  router.get('/getLocalesCoinciden/:usuarioLocal', async (req, res) => {
    try {
      const { usuarioLocal } = req.params;
  
      const localesCoinciden = await LocalModel.find({ 'usuarios.usuario': usuarioLocal });
      console.log("Locales donde el usuario coincide:", localesCoinciden);
  
      res.json(localesCoinciden);
    } catch (error) {
      console.error('Error al obtener locales donde el usuario coincide:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  router.post('/dejarDeSeguirLocal/:localId', async (req, res) => {
    try {
      const { localId } = req.params;
      const { usuario } = req.body; // Suponiendo que recibes el usuario a eliminar del array
  
      const resultado = await LocalModel.findByIdAndUpdate(localId, { $pull: { usuarios: { usuario } } }, { new: true });
  
      if (resultado) {
        res.json(resultado);
      } else {
        res.status(404).json({ error: 'Local no encontrado' });
      }
    } catch (error) {
      console.error('Error al dejar de seguir el local:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

  router.put('/reviews/:localId', async (req, res) => {
    const { localId } = req.params;
    const { reviews } = req.body;
  
    try {
      const local = await LocalModel.findById(localId);
  
      if (!local) {
        return res.status(404).json({ message: 'Local no encontrado' });
      }
  
      local.reviews = reviews; // Actualiza el campo 'reviews' del local con las nuevas reseñas
  
      await local.save(); // Guarda los cambios en la base de datos
  
      return res.status(200).json({ message: 'Reseñas actualizadas correctamente', local });
    } catch (error) {
      console.error('Error al actualizar las reseñas del local:', error.message);
      return res.status(500).json({ message: 'Error del servidor al actualizar las reseñas del local' });
    }
  });
  
  router.put('/actualizaRating/:localId', (req, res) => {
    const localId = req.params.localId;
    const newRating = req.body.rating;
    console.log("Entro a editar el rating", localId);
    // Aquí iría la lógica para actualizar el rating del local con el ID proporcionado (localId)
    // Por ejemplo, podrías tener una base de datos y realizar una actualización en la entrada correspondiente al local con ese ID
    
    // Ejemplo de actualización de la base de datos (usando un modelo hipotético "Local")
    LocalModel.findById(localId, (err, local) => {
      if (err || !local) {
        return res.status(404).json({ message: 'Local no encontrado' });
      }
  
      // Actualizar el rating del local con el nuevo rating
      local.rating = newRating;
  
      // Guardar el local actualizado en la base de datos
      local.save((err, updatedLocal) => {
        if (err) {
          return res.status(500).json({ message: 'Error al actualizar el rating del local' });
        }
  
        return res.status(200).json({ message: 'Rating del local actualizado exitosamente', updatedLocal });
      });
    });
  });

  router.delete('/eliminarSitio/:localId', (req, res) => {
    const localId = req.params.localId;
    // Ejemplo de eliminación en la base de datos (usando un modelo hipotético "Local")
    LocalModel.findByIdAndRemove(localId, (err, deletedLocal) => {
      if (err || !deletedLocal) {
        return res.status(404).json({ message: 'No se pudo encontrar o eliminar el local' });
      }
  
      return res.status(200).json({ message: 'Local eliminado exitosamente', deletedLocal });
    });
  });

  router.get('/LocalesRecomendados/:usuarioLocal', async (req, res) => {
    try {
      const { usuarioLocal } = req.params;
  
      const localesRecomendados = await LocalModel.aggregate([
        // Filtrar locales que el usuario no esté siguiendo
        {
          $match: {
            $and: [
              { 'usuarioLocal': { $ne: usuarioLocal } },
              { 'usuarios.usuario': { $ne: usuarioLocal } } // Reemplaza req.user.username con la manera adecuada de obtener el usuario actual si estás usando algún sistema de autenticación
            ]
          }
        },
        // Agregar un campo con el tiempo de la próxima actividad más cercana
        {
          $addFields: {
            proximaActividad: {
              $min: {
                $filter: {
                  input: '$actividades',
                  as: 'actividad',
                  cond: { $gte: ['$$actividad.fecha', moment().format('YYYY-MM-DD')]}
                }
              }
            }
          }
        },
        // Filtrar locales con actividades futuras y calcular el tiempo hasta la próxima actividad
        {
          $match: { proximaActividad: { $exists: true } }
        },
        // Ordenar por el rating más alto
        { $sort: { rating: -1 } },
        // Obtener solo 5 registros
        { $limit: 5 }
      ]);
  
      res.json(localesRecomendados);
    } catch (error) {
      console.error('Error al obtener locales recomendados:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

module.exports = router;
