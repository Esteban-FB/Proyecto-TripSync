const express = require('express');
const router = express.Router();
const Agenda = require('../models/Agenda');

// Ruta para agregar un nuevo evento a la agenda
router.post('/agregar-evento', async (req, res) => {
    try {
        const { date, text, details, usuario } = req.body;
        console.log("date:", req.body);

        // Buscar si existe un día con la fecha proporcionada
        let dia = await Agenda.findOne({
            $and: [
                { 'dias.date': date }, // Buscar por la fecha
                { 'usuario': usuario }, // Buscar por el usuario
            ],
        });
        console.log("Dia encontrado",dia);
        if (!dia) {
            // Si el día no existe, crear una nueva instancia del modelo Agenda con el usuario
            console.log("Entro a crear", usuario);
            dia = new Agenda({ dias: [{ date, events: [{ text, details }]}], usuario  });
        } else {
            // Si el día existe, encontrar su índice en el array
            const index = dia.dias.findIndex((d) => d.date === date);

            // Verificar si el día existe y el usuario es el mismo que realiza la solicitud
            if (index !== -1 && dia.usuario === usuario) {
                console.log("Entro a editar", usuario);
                // Si el usuario coincide, actualizar los eventos en el día existente
                dia.dias[index].events.push({ text, details });
            } else {
                // Si el día existe pero el usuario no coincide, crear un nuevo día para el nuevo usuario
                // dia.dias.push({ date, events: [{ text, details }], usuario });
                console.log("Entro a crear", usuario);
                dia = new Agenda({ dias: [{ date, events: [{ text, details }]}], usuario  });
            }
        }

        // Guardar la agenda actualizada en la base de datos
        const agenda = await dia.save();

        res.status(200).json(agenda);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el evento a la agenda.' });
    }
});

router.get('/dias-usuario/:usuario', async (req, res) => {
    try {
        const usuario = req.params.usuario; // Obtener el usuario de los parámetros de la URL
        console.log("Usuario:", usuario);

        // Buscar todos los días del usuario específico
        const diasUsuario = await Agenda.find({ usuario });

        res.status(200).json(diasUsuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los días del usuario.' });
    }
});
module.exports = router;
