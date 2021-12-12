// Setup environment variables
require("dotenv").config();

// setup app
const express = require("express");
const app = express();

// Allow ministryofpup domains for production use and localhost for development
app.use(require("cors")({ origin: [/ministryofpup\.com$/, /localhost/] }));

// middleware to add http headers
app.use(require("helmet")());

// @todo Put all these middleware into a auth middleware folder
const authnMiddleware = require("./utils/authnMiddleware");
// const authzMiddleware = require("./utils/authzMiddleware");
const adminOnly = require("./utils/adminOnly");

// @todo
// Need a way to pass multiple predicates into authz middleware,
// so that if any 1 of the predicate returns true, then user is authorized
// Usecase: Users API can only be accessed by the user themselves for their own account, else if user is admin, can access any accounts

/**
 * @notice Import and Mount all the routers for the different routes
 */
app.use("/", require("./routes/default.js"));
// Rename this to /user/appointments and file to userAppointments
app.use("/appointment", require("./routes/appointment.js"));
app.use("/appointment/available", require("./routes/available.js"));
app.use("/newsletter", require("./routes/newsletter.js"));
// @todo Users can only access their own data, add authz middleware here ensure uid matches docID??
// @todo However if user is admin, then allow access to all data
app.use("/user", authnMiddleware, require("./routes/user.js"));
app.use(
  "/admin/appointment/scheduled",
  adminOnly,
  require("./routes/scheduledAppointment")
);
app.use("/admin/appointment", adminOnly, require("./routes/adminAppointment"));
app.use("/admin/pet", adminOnly, require("./routes/dogs.js"));
app.use("/admin/pet/new", adminOnly, require("./routes/newDog.js"));
app.use("/admin/pet/sold", adminOnly, require("./routes/sold.js"));
app.use("/admin/schedule", adminOnly, require("./routes/adminSchedule.js"));
app.use("/admin/sale/manual", adminOnly, require("./routes/manualSale.js"));
app.use(
  "/admin/sale/manual/print",
  adminOnly,
  require("./routes/printReceipt")
);
app.use("/admin/user/all", adminOnly, require("./routes/allUsers.js"));
app.use("/admin/transactions", adminOnly, require("./routes/transactions.js"));
app.use(
  "/analytics",
  adminOnly,
  require("./routes/analytics/appointmentSrc.js")
);
app.use(
  "/receipt",
  // @todo This should be either admin OR recaptcha, since admin portal cannot do recaptcha
  // adminOnly,
  require("./routes/receipt.js")
);
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
