// Setup environment variables
require("dotenv").config();

// setup app
const express = require("express");
const app = express();

// Allow ministryofpup domains for production use and localhost for development
app.use(require("cors")({ origin: [/ministryofpup\.com$/, /localhost/] }));

// middleware to add http headers
app.use(require("helmet")());

const authnMiddleware = require("./utils/authnMiddleware");
// const authzMiddleware = require("./utils/authzMiddleware");
const adminOnly = require("./utils/adminOnly");

/**
 * @notice Import and Mount all the routers for the different routes
 */
app.use("/", adminOnly, require("./routes/default.js"));
// Rename this to /user/appointments and file to userAppointments
app.use("/appointment", require("./routes/appointment.js"));
app.use("/appointment/available", require("./routes/available.js"));
// @todo Ensure only admin access this route with a authorization middleware
app.use(
  "/admin/appointment/scheduled",
  authnMiddleware,
  require("./routes/scheduledAppointment")
);
app.use("/admin/pet", authnMiddleware, require("./routes/dogs.js"));
app.use("/admin/pet/new", authnMiddleware, require("./routes/newDog.js"));
app.use("/admin/pet/sold", authnMiddleware, require("./routes/sold.js"));
app.use(
  "/admin/schedule",
  authnMiddleware,
  require("./routes/adminSchedule.js")
);
app.use(
  "/admin/sale/manual",
  authnMiddleware,
  require("./routes/manualSale.js")
);
// app.use("/help", authnMiddleware, require("./routes/help.js"));
// app.use("/rbac", authnMiddleware, require("./routes/RBAC.js"));
// app.use("/error", require("./routes/error"));

// Mount the 404 and 500 error handling middleware last
const { _404, _500 } = require("express-error-middlewares");
app.use(_404);
app.use(_500);

/**
 * @notice Setup PORT last to ensure all setup is done before server starts listening to traffic
 */
const port = process.env.PORT || 3000; // Defaults to PORT 3000
app.listen(port, () => console.log(`Server running on port: ${port}`));
