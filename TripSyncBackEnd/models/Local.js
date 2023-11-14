const mongoose = require('mongoose');

const LocalSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
});


const LocalModel = mongoose.model('Local',LocalSchema,"Locales");

module.exports = LocalModel;