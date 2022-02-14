<template>
  <section class="section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <div class="column is-full">
      <h1 class="title mb-6" style="color: #e81050">Contact Us</h1>
      <p class="subtitle" style="font-size: 1em; color: grey">
        Leave your details here and we will contact you asap!
        <br />

        Alternatively, you can email us at
        <a href="mailto:ministryofpup@gmail.com" target="_blank">
          ministryofpup@gmail.com
        </a>
      </p>
    </div>

    <div class="column is-full">
      <p class="title is-3">Enter your details</p>
    </div>

    <div class="column is-full">
      <div class="columns is-multiline is-vcentered">
        <div class="column is-one-third">
          <label>
            <b>First name</b>

            <input
              class="input"
              type="text"
              v-model="fname"
              placeholder="E.g. John"
            />
          </label>
        </div>

        <div class="column is-one-third">
          <label>
            <b>Last name</b>

            <input
              class="input"
              type="text"
              v-model="lname"
              placeholder="E.g. Doe"
            />
          </label>
        </div>

        <div class="column is-one-third">
          <label>
            <b>Phone number (+65)</b>

            <input
              class="input"
              type="tel"
              pattern="[\s0-9]+"
              min="10000000"
              max="99999999"
              v-model="number"
              placeholder="E.g. 92345678"
            />
          </label>
        </div>

        <div class="column is-one-third">
          <label>
            <b>Email</b>

            <input
              class="input"
              type="text"
              v-model="email"
              placeholder="E.g. example@gmail.com"
            />
          </label>
        </div>

        <div class="column is-one-third">
          <label>
            <b>Message</b>

            <input
              class="input"
              type="text"
              v-model="message"
              placeholder="Leave a message for us if needed"
            />
          </label>
        </div>

        <div class="column is-one-third">
          <button
            class="button is-fullwidth py-5 is-light is-success"
            @click="contact"
          >
            Contact Me!
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ContactUs",

  data() {
    return {
      fname: undefined,
      lname: undefined,
      number: undefined,
      email: undefined,
      message: undefined,
    };
  },

  methods: {
    async contact() {
      // Stop function if any of the required inputs are missing
      if (!(this.fname && this.lname && this.number && this.email))
        return alert("All fields are required except 'message'");

      try {
        const token = await new Promise((resolve, reject) =>
          window.grecaptcha.ready(() =>
            window.grecaptcha
              .execute("6Lcex6QcAAAAADus4RtnoqwskQoXcB2DwgCav11Z", {
                action: "contactUs",
              })
              .then(resolve)
              .catch(reject)
          )
        );

        const { oof } = await import("simpler-fetch");
        oof._baseUrl =
          process.env.NODE_ENV === "production"
            ? "https://api.ministryofpup.com"
            : "http://localhost:3000";
        const res = await oof
          .POST("/contact-us-form")
          .header({ "x-recaptcha-token": token })
          .data({
            fname: this.fname,
            lname: this.lname,
            number: this.number,
            email: this.email,
            message: this.message,
          })
          .runJSON();

        if (!res.ok) throw new Error(res.error);

        alert("Saved! We will contact you shortly.");
      } catch (error) {
        console.error(error);

        // If the API call failed, recursively call itself again if user wants to retry,
        confirm(`Error: \n${error.message}\n\nTry again?`) && this.contact();
      }
    },
  },
};
</script>
