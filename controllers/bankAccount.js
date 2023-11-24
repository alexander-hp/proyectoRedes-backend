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

    console.log({ ok: true, bankAccounts: bankAccountsDB });
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

  console.log({
    ok: true,
    BankAccount,
  });
  res.json({
    ok: true,
    BankAccount,
  });
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

module.exports = {
  createBankAccount,
  getBankAccount,
  getBankAccounts,
};
