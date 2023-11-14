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

module.exports = router;
