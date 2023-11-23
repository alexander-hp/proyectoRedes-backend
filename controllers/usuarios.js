const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
  const { role } = req;

  try {
    let usersDB;
    usersDB = await User.find();

    // Ahora usersWithSuscriptions contiene la información de usuarios con suscripciones

    return res.json({ ok: true, users: usersDB });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }
};

// ! Query que obtiene todos los usuarios con su suscription mas actual
// ! si no es admin obtiene solo los de su gym
// const getUsuarios = async (req, res) => {
//   const { uid, gymId, gymIdToCheck, role } = req;
//   console.log(uid, gymId, gymIdToCheck, role);
//   // console.log(req.uid);

//   try {
//     let usersDB;
//     if (role === 'admin') {
//       // Si es administrador, obtiene todos los usuarios de todos los gimnasios
//       usersDB = await User.find();
//     } else {
//       // Si no es administrador, obtiene solo los usuarios de su gimnasio
//       usersDB = await User.find({ gymId });
//     }

//     // Utiliza la función $lookup para buscar suscripciones activas
//     const usersWithSuscriptions = await User.aggregate([
//       {
//         $match: { _id: { $in: usersDB.map((user) => user._id) } },
//       },
//       {
//         $lookup: {
//           as: 'suscriptions',
//           from: 'suscriptions',
//           foreignField: 'userId',
//           localField: '_id',
//         },
//       },
//       {
//         $unwind: {
//           path: '$suscriptions',
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $match: {
//           'suscriptions.status': true, // Filtra las suscripciones activas
//         },
//       },
//       {
//         $sort: {
//           'suscriptions.endDate': -1, // Ordena las suscripciones por fecha de finalización descendente
//         },
//       },
//       {
//         $group: {
//           _id: '$_id',
//           user: { $first: '$$ROOT' },
//         },
//       },
//       {
//         $replaceRoot: { newRoot: '$user' },
//       },
//     ]);

//     // Ahora usersWithSuscriptions contiene la información de usuarios con suscripciones activas

//     return res.json({ ok: true, users: usersWithSuscriptions });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       ok: false,
//       msg: 'Error inesperado',
//     });
//   }
// };

const getUser = async (req, res) => {
  const uid = req.params.id;
  const user = await User.findById(uid);

  res.json({
    ok: true,
    user,
  });
};

const searchUser = async (req, res) => {
  const { uid, gymId, gymIdToCheck, role } = req;

  try {
    const { term } = req.query;
    const regex = new RegExp(term, 'i');

    if (role === 'admin') {
      // Si es administrador, obtiene todos los usuarios de todos los gimnasios
      const usersDB = await User.find({
        email: regex,
      }).select('_id name lastName email');

      return res.json({
        ok: true,
        users: usersDB,
      });
    } else {
      // Si no es administrador, obtiene solo los usuarios de su gimnasio especificado
      const usersDB = await User.find({
        email: regex,
        gymId: gymIdToCheck,
      }).select('_id name lastName email');

      return res.json({
        ok: true,
        users: usersDB,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs',
    });
  }
};

const crearUsuario = async (req, res = response) => {
  console.log(req.body);
  const { email, password, phone } = req.body;

  try {
    const existeEmail = await User.findOne({ email });
    const existePhone = await User.findOne({ phone });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya está registrado, porfavor intenta con otro',
      });
    }

    if (existePhone) {
      return res.status(400).json({
        ok: false,
        msg: 'El celular ya está registrado, porfavor intenta con otro',
      });
    }

    const user = new User(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Guardar usuario
    await user.save();

    // Generar el TOKEN - JWT
    const token = await generarJWT(user);

    res.json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs',
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  // TODO: Validar token y comprobar si es el usuario correcto

  const uid = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario por ese id',
      });
    }

    // Actualizaciones
    const { password, google, email, ...campos } = req.body;

    if (userDB.email !== email) {
      const existeEmail = await User.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'Ya existe un usuario con ese email',
        });
      }
    }

    campos.email = email;
    const userUpdated = await User.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.json({
      ok: true,
      user: userUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const userDB = await User.findById(uid);

    if (!userDB) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un usuario por ese id',
      });
    }

    await User.findByIdAndDelete(uid);

    res.json({
      ok: true,
      msg: 'User Deleted',
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
  getUsuarios,
  getUser,
  crearUsuario,
  actualizarUsuario,
  borrarUsuario,
  searchUser,
};
