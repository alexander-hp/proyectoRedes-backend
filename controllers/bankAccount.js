const { response } = require('express');
const bcrypt = require('bcryptjs');

const Account = require('../models/bankAccount');
const User = require('../models/usuario');
const Transaction = require('../models/transactions');
const { generarJWT } = require('../helpers/jwt');

const getBankAccounts = async (req, res) => {
  try {
    let bankAccountsDB;
    bankAccountsDB = await Account.find();

    return res.json({ ok: true, bankAccounts: bankAccountsDB });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado',
    });
  }
};

const getBankAccount = async (req, res) => {
  const uid = req.params.id;
  const BankAccount = await Account.findById(uid);

  res.json({
    ok: true,
    BankAccount,
  });
};

const searchUser = async (req, res) => {
  const { role } = req;

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

const createBankAccount = async (req, res = response) => {
  console.log(req.body);
  const { userId, balance } = req.body;
  console.log(userId);

  try {
    const existUser = await User.findOne({ _id: userId });

    if (!existUser) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe, porfavor intenta con otro',
      });
    }

    const bankAccount = new Account(req.body);

    // Guardar cuenta de banco
    await bankAccount.save();

    res.json({
      ok: true,
      bankAccount,
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
  createBankAccount,
  getBankAccount,
  getBankAccounts,
};
