const mongoose = require('mongoose');

const ejemploSchema = new mongoose.Schema({
  campo: String
});

const Ejemplo = mongoose.model('Ejemplo', ejemploSchema);

module.exports = Ejemplo;
