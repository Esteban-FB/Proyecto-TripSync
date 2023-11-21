const mongoose = require('mongoose');

const LocalSchema = new mongoose.Schema({
    nombreSitio: {
        type: String,
        required: true,
    },
    tipoSitio:{
        type:String,
        required:true,
    },
    descripcionExtensa:{
        type:String,
        required:true,
    },
    ubicacion:{
        type:String,
        required:true,
    },
    Latitud:{
        type:Number,
    },
    Longitud:{
        type:Number,
    },
    requiereReserva:{
        type:Boolean,
        required:true,
    },
    horario:{
        type:String,
        required:true,
    },
    contactoTelefono:{
        type:String,
        required:true,
    },
    contactoCorreo:{
        type:String,
        required:true,
    },
    actividades:{
        type:Array,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
    usuarios:{
        type:Array,
        required:true,
    },
    reviews:{
        type:Array,
        required:true,
    },
    usuarioLocal:{
        type:String,
        required:true
    },
});


const LocalModel = mongoose.model('Local',LocalSchema,"Locales");

module.exports = LocalModel;