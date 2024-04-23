const express = require("express");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

router.get("/", appointmentController.getAllAppointments);
router.post("/create", appointmentController.bookAppointment);
router.delete("/:id", appointmentController.deleteAppointment);
router.patch("/:id", appointmentController.updateAppointment);

module.exports = router;
