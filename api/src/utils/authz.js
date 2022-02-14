/**
 * Auth middleware
 * Using "Firebase Auth" for authentication
 *
 * Support auth token passed via the Bearer token way
 * Will end the connection in this middleware if there is an error instead of relying on a 500 middleware
 * Request will end if JWT is invalid of if the JWT is missing
 * If authenticated, the decoded JWT will be attached to request for use downstream
 */

// Factory function to setup the middleware
module.exports = function setup(
  firebaseAdmin,
  predicate,
  {
    // @todo Is errorJSON actually needed?
    errorJSON = {},
    errorMessage = (errorObject) => errorObject.message || "UNAUTHORIZED",
    errorHandler, // Allow users to pass in an error handler to deal with every error, for example to log to APM service
  } = {} // Last argument is optional
) {
  if (!firebaseAdmin)
    throw new Error("Firebase Admin package MUST BE passed into setup!");

  // Assume that it can only be a string or function
  if (typeof errorMessage !== "function")
    if (typeof errorMessage === "string") errorMessage = () => errorMessage;
    else
      throw new Error("Only Functions or Strings are allowed for errorMessage");

  // Can only do this if firebase.initializeApp is called first
  // const auth = firebaseAdmin.auth();

  /**
   * Apply this middleware to auth protected routes.
   * This middleware allows all users' requests with valid firebase auth tokens through.
   * Thus business logics need to handle extra conditions locally. E.g. user can only request for their own data.
   */
  return async function authz(req, res, next) {
    try {
      const user = await firebaseAdmin
        .auth()
        .getUser(req.authenticatedUser.uid);

      // If predicate returns true with the given claims, user is authorized to access resource, call next middleware
      // Predicate must return true or false, does not accept truthy values in place of true
      if (predicate(user.customClaims) === true) return next();

      // Else if predicate failed, means user is unauthorised to access resource, thus end with 403 unauthorised
      return res.status(403).json({ error: "UNAUTHORIZED" });
    } catch (error) {
      // 403 identity known but denied / failed authentication
      res.status(403).json({
        ...errorJSON, // Use the error json passed by user
        error: errorMessage(error), // Generate the error message
      });

      // Run user's custom error handler if any
      if (errorHandler) errorHandler(error);
    }
  };
};
