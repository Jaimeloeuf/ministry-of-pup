// Setup environment variables
require("dotenv").config();

// setup app
const express = require("express");
const app = express();

// Allow ministryofpup domains for production use and localhost for development
app.use(require("cors")({ origin: [/ministryofpup\.com$/, /localhost/] }));

// middleware to add http headers
app.use(require("helmet")());

// const authnMiddleware = require("./utils/authnMiddleware");
// const authzMiddleware = require("./utils/authzMiddleware");
const adminOnly = require("./utils/adminOnly");

/**
 * @notice Import and Mount all the routers for the different routes
 */
app.use("/", require("./routes/default.js"));
// Rename this to /user/appointments and file to userAppointments
app.use("/appointment", require("./routes/appointment.js"));
app.use("/appointment/available", require("./routes/available.js"));
app.use(
  "/admin/appointment/scheduled",
  adminOnly,
  require("./routes/scheduledAppointment")
);
app.use(
  "/admin/appointment/book",
  adminOnly,
  require("./routes/adminAppointment")
);
app.use("/admin/pet", adminOnly, require("./routes/dogs.js"));
app.use("/admin/pet/new", adminOnly, require("./routes/newDog.js"));
app.use("/admin/pet/sold", adminOnly, require("./routes/sold.js"));
app.use("/admin/schedule", adminOnly, require("./routes/adminSchedule.js"));
app.use("/admin/sale/manual", adminOnly, require("./routes/manualSale.js"));
app.use("/contact-us-form", require("./routes/contactUsForm.js"));
app.use("/error", require("./routes/error.js"));
// app.use("/help", authnMiddleware, require("./routes/help.js"));

// Mount the 404 and 500 error handling middleware last
const { _404, _500 } = require("express-error-middlewares");
app.use(_404);
app.use(_500);

/**
 * @notice Setup PORT last to ensure all setup is done before server starts listening to traffic
 */
const port = process.env.PORT || 3000; // Defaults to PORT 3000
app.listen(port, () => console.log(`Server running on port: ${port}`));
