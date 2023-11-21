const express = require('express');
const router = express.Router();
const LogInModel  = require('../models/LogIn');

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar el usuario en la base de datos por nombre de usuario y contraseña
    const usuario = await LogInModel.findOne({ user: username, password: password });

    if (!usuario) {
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos' });
    }

    // Eliminar la contraseña del objeto del usuario antes de enviarlo como respuesta
    const usuarioSinPassword = { ...usuario.toObject() };
    delete usuarioSinPassword.password;

    console.log("Inicio de sesión exitoso para:", usuarioSinPassword.user);
    res.status(200).json(usuarioSinPassword);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;

    // Buscar el usuario en la base de datos por nombre de usuario
    const usuario = await LogInModel.findOne({ user: username });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si se encuentra el usuario, se devuelve el nombre de usuario
    res.status(200).json({ username: usuario.user });
  } catch (error) {
    console.error('Error al verificar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/registrarse', async (req, res) => {
    try {
      const { registrationData } = req.body;
      const userData = JSON.parse(registrationData);
        console.log("usuario del front: ",userData);
        const nuevoUsuario = new LogInModel({
          user: userData.user,
          email: userData.email,
          password: userData.password,
          rol: userData.rol,
        });
      const usuario = await nuevoUsuario.save();
      const usuarioSinPassword = { ...usuario.toObject() };
      delete usuarioSinPassword.password;
  
      console.log("Usuario registrado:", usuarioSinPassword);
      console.log("usuario: ",nuevoUsuario);
      res.status(200).json("se registro correctamente");
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

module.exports = router;
