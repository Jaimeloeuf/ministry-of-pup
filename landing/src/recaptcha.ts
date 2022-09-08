export const getRecaptchaToken = (action: string) =>
  new Promise((resolve, reject) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.grecaptcha.ready(() =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.grecaptcha
        .execute("6Lcex6QcAAAAADus4RtnoqwskQoXcB2DwgCav11Z", { action })
        .then(resolve)
        .catch(reject)
    )
  );
