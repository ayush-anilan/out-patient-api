const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  maxPatients: {
    type: Number,
    required: true,
  },
  schedule: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        required: true,
      },
      availableSlots: {
        type: Number,
        default: 0,
      },
    },
  ],
});

doctorSchema.virtual("url").get(function () {
  return `/doctors/${this._id}`;
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
