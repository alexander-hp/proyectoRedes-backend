const { Schema, model, Date } = require('mongoose');

const UserSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    aboutMe: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pin: {
      type: Number,
    },
    role: {
      type: String,
      required: true,
      enum: ['owner', 'user', 'admin'],
      default: 'user',
    },
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.method('toJSON', function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model('User', UserSchema);
