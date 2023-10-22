const express = require('express');
const mongoose = require('mongoose');
const ejemploRoutes = require('./routes/ejemploRoutes');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://m001-student:IncogNito2800@sandbox.yrpya.mongodb.net/TripSyncApp')

const objectBD = mongoose.connection

objectBD.on('connected', ()=>{
    console.log('Conexión exitosa con mongo')
})
objectBD.on('error', ()=>{
    console.log('Error al conectarse a mongo')
})

module.exports = mongoose