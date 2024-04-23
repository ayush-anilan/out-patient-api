const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
require("dotenv").config();

// set up mongoose connection
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("Connected to database");
}

const app = express();
const cors = require("cors");
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
