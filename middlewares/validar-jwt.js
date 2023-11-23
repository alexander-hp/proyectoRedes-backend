const jwt = require('jsonwebtoken');
const User = require('../models/usuario');

const validarJWT = (req, res, next) => {
  // Leer el Token
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la petición',
    });
  }

  try {
    const { uid, role } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    req.role = role;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no válido',
    });
  }
};

const validarOWNER_ROLE = async (req, res, next) => {
  const uid = req.uid;
  console.log('req en validarOwner: ', req);

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no existe',
      });
    }

    if (userDB.role !== 'owner') {
      return res.status(403).json({
        ok: false,
        msg: 'No tiene privilegios para hacer eso',
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};
const validarADMIN_ROLE = async (req, res, next) => {
  const uid = req.uid;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no existe',
      });
    }

    if (userDB.role !== 'admin') {
      return res.status(403).json({
        ok: false,
        msg: 'No tiene privilegios para hacer eso',
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const validarOWNER_ROLE_o_MismoUsuario = async (req, res, next) => {
  const uid = req.uid;
  const id = req.params.id;
  console.log(uid, id);

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no existe',
      });
    }

    if (userDB.role === 'owner' || uid === id) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msg: 'No tiene privilegios para hacer eso, requiere ser owner',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const validarOWNER_ROLE_o_Admin = async (req, res, next) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no existe',
      });
    }

    if (userDB.role === 'owner' || userDB.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msg: 'No tiene privilegios para hacer eso, requiere ser owner o admin',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

const validarNoUsuario = async (req, res, next) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no existe',
      });
    }

    if (userDB.role === 'user') {
      return res.status(403).json({
        ok: false,
        msg: 'No tiene privilegios para hacer eso, hable con el personal',
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

module.exports = {
  validarJWT,
  validarOWNER_ROLE,
  validarOWNER_ROLE_o_Admin,
  validarOWNER_ROLE_o_MismoUsuario,
  validarADMIN_ROLE,
  validarNoUsuario,
};
