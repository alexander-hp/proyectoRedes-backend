const { Schema, model } = require('mongoose');

const ActivityLogSchema = new Schema(
  {
    by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    action: {
      type: String,
    },
    refId: {
      type: Schema.Types.ObjectId,
    },
    modifications: [
      {
        field: String, // Nombre del campo modificado
        newValue: String, // Nuevo valor del campo
        modifiedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ActivityLogSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model('ActivityLog', ActivityLogSchema);
