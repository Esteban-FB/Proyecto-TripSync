const express = require('express');
const router = express.Router();
const Ejemplo = require('../models/ejemploModel');

// Ruta para obtener ejemplos desde la base de datos
router.get('/ejemplos', async (req, res) => {
  const ejemplos = await Ejemplo.find();
  res.json(ejemplos);
});

module.exports = router;
