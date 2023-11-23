const { Schema, model, Date } = require('mongoose');

const TransactionsSchema = Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'BankAccount',
      required: true,
    },
    transactionType: {
      type: String, //depósito, retiro, transferencia, etc
    },
    ammount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

TransactionsSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model('Transaction', TransactionsSchema);
