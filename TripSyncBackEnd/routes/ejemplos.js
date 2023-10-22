const express = require('express');
const router = express.Router();
const Ejemplo = require('../models/ejemploModel');

// Ruta para obtener ejemplos desde la base de datos
router.get('/getEjemplos', async (req, res) => {
  //const ejemplos = await Ejemplo.find();
  const ejemplos = {
    nombre: "Me llamo Juan"
  }
  res.json(ejemplos);
});

module.exports = router;
