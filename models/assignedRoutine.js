const { Schema, model } = require('mongoose');

const AssignedRoutineSchema = Schema(
  {
    routineId: {
      type: Schema.Types.ObjectId,
      ref: 'Routine',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
    },
    routineName: {
      type: String,
    },
    allDay: {
      type: Boolean,
      default: true,
    },
    startOf: {
      type: Date,
    },
    endOf: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

AssignedRoutineSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model('AssignedRoutineSchema', AssignedRoutineSchema);
