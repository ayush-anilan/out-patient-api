const express = require("express");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

router.get("/", doctorController.getAllDoctors);
router.post("/create", doctorController.createDoctor);

router.get("/:id", doctorController.getDoctorById);

module.exports = router;
