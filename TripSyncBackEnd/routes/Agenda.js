const express = require('express');
const router = express.Router();
const Agenda = require('../models/Agenda');

// Ruta para agregar un nuevo evento a la agenda
router.post('/agregar-evento', async (req, res) => {
    try {
        const { date, text, details } = req.body;

        // Buscar si existe un día con la fecha proporcionada
        let dia = await Agenda.findOne({ 'dias.date': date });

        if (!dia) {
            // Si el día no existe, crear una nueva instancia del modelo Agenda
            dia = new Agenda({ dias: [{ date, events: [] }] });
        }

        // Encontrar el índice del día en el array
        const index = dia.dias.findIndex((d) => d.date === date);

        // Si el día existe, actualizar los eventos
        if (index !== -1) {
            dia.dias[index].events.push({ text, details });
        } else {
            // Si no existe, agregar un nuevo día
            dia.dias.push({ date, events: [{ text, details }] });
        }

        // Guardar la agenda actualizada en la base de datos
        const agenda = await dia.save();

        res.status(200).json(agenda);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el evento a la agenda.' });
    }
});



module.exports = router;
