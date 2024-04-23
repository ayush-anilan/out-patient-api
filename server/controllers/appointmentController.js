const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const moment = require("moment");

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({
      status: "success",
      data: {
        appointments,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Book an appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorName, patientName, dateTime } = req.body;
    const doctor = await Doctor.findOne({ name: doctorName });
    if (!doctor) {
      return res.status(404).json({
        status: "fail",
        message: "Doctor not found",
      });
    }
    if (
      doctor.schedule.some(
        (slot) =>
          slot.day === moment(dateTime).format("dddd") &&
          slot.availableSlots <= 0
      )
    ) {
      return res.status(400).json({
        status: "fail",
        message: "No available slots for the selected date and time",
      });
    }
    const appointment = await Appointment.create({
      doctor: doctor._id,
      patientName,
      dateTime,
    });
    await Doctor.updateOne(
      { _id: doctor._id, "schedule.day": moment(dateTime).format("dddd") },
      { $inc: { "schedule.$.availableSlots": -1 } }
    );
    res.status(201).json({
      status: "success",
      data: {
        appointment,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        status: "fail",
        message: "Appointment not found",
      });
    }
    const doctor = await Doctor.findById(appointment.doctor);
    if (!doctor) {
      return res.status(404).json({
        status: "fail",
        message: "Doctor not found",
      });
    }
    const selectedSlot = doctor.schedule.find(
      (slot) => slot.day === moment(appointment.dateTime).format("dddd")
    );
    await Appointment.findByIdAndDelete(req.params.id);
    await Doctor.updateOne(
      {
        _id: doctor._id,
        "schedule.day": moment(appointment.dateTime).format("dddd"),
      },
      { $inc: { "schedule.$.availableSlots": 1 } }
    );
    res.status(200).json({
      status: "success",
      message: "Appointment deleted successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { doctorName, patientName, dateTime } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        status: "fail",
        message: "Appointment not found",
      });
    }
    const oldDoctor = await Doctor.findById(appointment.doctor);
    const newDoctor = await Doctor.findOne({ name: doctorName });
    if (!newDoctor) {
      return res.status(404).json({
        status: "fail",
        message: "New doctor not found",
      });
    }
    const oldSlot = oldDoctor.schedule.find(
      (slot) => slot.day === moment(appointment.dateTime).format("dddd")
    );
    const newSlot = newDoctor.schedule.find(
      (slot) => slot.day === moment(dateTime).format("dddd")
    );
    if (!newSlot || newSlot.availableSlots <= 0) {
      return res.status(400).json({
        status: "fail",
        message: "No available slots for the selected date and time",
      });
    }
    await Appointment.findByIdAndUpdate(req.params.id, {
      doctor: newDoctor._id,
      patientName,
      dateTime,
    });
    if (
      appointment.doctor.toString() !== newDoctor._id.toString() ||
      appointment.dateTime !== dateTime
    ) {
      await Doctor.updateOne(
        {
          _id: oldDoctor._id,
          "schedule.day": moment(appointment.dateTime).format("dddd"),
        },
        { $inc: { "schedule.$.availableSlots": 1 } }
      );
      await Doctor.updateOne(
        { _id: newDoctor._id, "schedule.day": moment(dateTime).format("dddd") },
        { $inc: { "schedule.$.availableSlots": -1 } }
      );
    }
    res.status(200).json({
      status: "success",
      message: "Appointment updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
