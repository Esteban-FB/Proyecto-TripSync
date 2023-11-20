const express = require('express');
const router = express.Router();
const LocalModel  = require('../models/Local');


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
  
module.exports = router;
