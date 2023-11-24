const { response } = require('express');

const Account = require('../models/bankAccount');
const Transaction = require('../models/transactions');

const createWithdrawal = async (req, res) => {
  console.log(req.body);
  const { accountId, ammount } = req.body;
  // ? account Id es a donde se ira el dinero

  try {
    const existingBankAccount = await Account.findOne({ _id: accountId });

    if (!existingBankAccount) {
      return res.status(400).json({
        ok: false,
        msg: 'La cuenta no existe, porfavor intenta con otro',
      });
    }

    // si la transaccion es menor a su saldo
    if (accountId.balance < ammount) {
      console.log({ ok: false, msg: 'Saldo insuficiente.' });
      return res.status(400).json({
        ok: false,
        msg: 'Saldo insuficiente.',
      });
    }

    const sourceTransaction = new Transaction({
      accountId: accountId,
      transactionType: 'withdrawal',
      ammount: ammount,
    });

    // Guardar transaccion
    await sourceTransaction.save();

    // Actualizar el saldo de la cuenta bancaria según el tipo de transacción
    existingBankAccount.balance -= ammount;

    await existingBankAccount.save();

    console.log({ ok: true, withdrawal: ammount });
    res.json({
      ok: true,
      withdrawal: ammount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs',
    });
  }
};

const createTransaction = async (req, res = response) => {
  console.log(req.body);
  const { targetAccountId, accountId, ammount } = req.body;
  // ? account Id es a donde se ira el dinero

  try {
    const existingBankAccount = await Account.findOne({ _id: accountId });
    const existingTargetAccountId = await Account.findOne({
      _id: targetAccountId,
    });

    if (!existingTargetAccountId) {
      console.log({
        ok: false,
        msg: 'La cuenta no existe, porfavor intenta de nuevo!',
      });
      return res.status(400).json({
        ok: false,
        msg: 'La cuenta no existe, porfavor intenta de nuevo!',
      });
    }

    if (!existingBankAccount) {
      console.log({
        ok: false,
        msg: 'La cuenta a depositar no existe, porfavor intenta con otro',
      });
      return res.status(400).json({
        ok: false,
        msg: 'La cuenta a depositar no existe, porfavor intenta con otro',
      });
    }

    // si la transaccion es menor a su saldo
    if (targetAccountId.balance < ammount) {
      console.log({ ok: false, msg: 'Saldo insuficiente.' });
      return res.status(400).json({
        ok: false,
        msg: 'Saldo insuficiente.',
      });
    }

    const sourceTransaction = new Transaction({
      accountId: accountId,
      transactionType: 'transfer_out',
      ammount: ammount,
    });

    const targetTransaction = new Transaction({
      accountId: targetAccountId,
      transactionType: 'transfer_in',
      ammount: ammount,
    });

    // const transaction = new Transaction(req.body);

    // Guardar usuario
    await sourceTransaction.save();
    await targetTransaction.save();

    // Actualizar el saldo de la cuenta bancaria según el tipo de transacción
    existingBankAccount.balance -= ammount;
    existingTargetAccountId.balance += ammount;

    // if (transactionType === 'deposit') {
    //   // ?Deposito
    //   existingBankAccount.balance += ammount;
    // } else if (transactionType === 'withdrawal') {
    //   // ?Retiro
    //   existingBankAccount.balance -= ammount;
    // } else if (transactionType === 'transfer') {
    //   // Lógica para actualizar el saldo en caso de transferencia
    //   // Esto puede involucrar dos cuentas: la cuenta de origen y la cuenta de destino
    //   // Asegúrate de implementar esta lógica según tus necesidades específicas
    // }

    await existingBankAccount.save();
    await existingTargetAccountId.save();

    console.log({ ok: true, sourceTransaction, targetTransaction });
    res.json({
      ok: true,
      sourceTransaction,
      targetTransaction,
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
  createTransaction,
  createWithdrawal,
};
