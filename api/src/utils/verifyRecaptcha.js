module.exports = async function verifyRecaptcha(req, res, next) {
  // Get the recaptcha token passed in as a header
  // Note that headers are all lowercased by express
  const token = req.headers["x-recaptcha-token"];

  // If no token found return 401 Missing recaptcha token thus unauthorised
  if (!token) return res.status(401).json({ error: "Missing recaptcha token" });

  try {
    // Lazily loading the HTTP client library to help with serverless cold start time
    const res = await require("tiny-json-http")
      .post({
        // No freaking idea why but sending data over as a req.body JSON does not work
        // Need to put all the parameters as query string params which is kinda weird...
        // But I have spent too much time on this and since the below works, just sticking with it
        // url: "https://www.google.com/recaptcha/api/siteverify",
        // data: {
        //   secret: process.env.recaptchaSecret,
        //   response: token,
        //   remoteip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        // },

        url: `https://www.google.com/recaptcha/api/siteverify?secret=${
          process.env.recaptchaSecret
        }&response=${token}&remoteip=${
          req.headers["x-forwarded-for"] || req.socket.remoteAddress
        }`,
      })
      .then((resp) => resp.body);

    if (!res.success) throw new Error(res["error-codes"]);
    // @todo Require a higher score? See what is the average score to decide
    if (res.score < 0.6)
      throw new Error(`Recaptcha score too low: ${res.score}`);

    return next();
  } catch (error) {
    // 403 identity known but denied / failed authentication
    return res.status(403).json({ error });
  }
};
