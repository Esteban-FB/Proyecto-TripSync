const mongoose = require('mongoose');

const EventoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
});

const DiaSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    events: {
        type: [EventoSchema],
        default: [],
    },
});

const AgendaSchema = new mongoose.Schema({
    dias: {
        type: [DiaSchema],
        default: [],
    },
    usuario:{
        type: String,
        required: true,
    }
});

const AgendaModel = mongoose.model('MiAgenda', AgendaSchema);

module.exports = AgendaModel;