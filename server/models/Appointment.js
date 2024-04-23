const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
