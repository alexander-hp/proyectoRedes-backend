const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const userDB = await User.findOne({ email });
    const validPassword = bcrypt.compareSync(password, userDB.password);
    console.log(userDB);

    // Verificar si el usuario existe
    if (!userDB) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'Contraseña no válida',
      });
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(userDB);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

module.exports = {
  login,
};
