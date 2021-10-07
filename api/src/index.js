// Setup environment variables
require("dotenv").config();

// setup app
const express = require("express");
const app = express();

// Allow ministryofpup domains for production use and localhost for development
app.use(require("cors")({ origin: [/ministryofpup\.com$/, /localhost/] }));

// middleware to add http headers
app.use(require("helmet")());

const authMiddleware = require("firebase-auth-express-middleware")(
  require("firebase-admin")
);

/**
 * @notice Import and Mount all the routers for the different routes
 */
app.use("/", require("./routes/default.js"));
app.use("/appointment", require("./routes/appointment.js"));
app.use("/appointment/available", require("./routes/available.js"));
app.use("/admin/pet/new", authMiddleware, require("./routes/newDog.js"));
app.use("/admin/pet/sold", authMiddleware, require("./routes/sold.js"));
// app.use("/help", authMiddleware, require("./routes/help.js"));
// app.use("/rbac", authMiddleware, require("./routes/RBAC.js"));
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
