export const getRecaptchaToken = (action) =>
  new Promise((resolve, reject) =>
    window.grecaptcha.ready(() =>
      window.grecaptcha
        .execute("6Lcex6QcAAAAADus4RtnoqwskQoXcB2DwgCav11Z", { action })
        .then(resolve)
        .catch(reject)
    )
  );
