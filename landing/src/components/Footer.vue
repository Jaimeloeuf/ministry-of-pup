<template>
  <footer class="footer">
    <div class="container is-centered">
      <div class="columns is-centered has-text-left">
        <div class="column is-two-fifths">
          <p class="subtitle">About Us</p>
          <p>
            We are a team of dedicated professionals on a Mission to help you
            find the dog you love!
            <br />
            We are based in Singapore with an international team and presence.
          </p>
          <br />

          <p style="font-size: 0.7em">
            <a href="https://ministryofpup.com/#/terms" target="_blank">
              Terms of use and privacy policy
            </a>
            <br />
            <a href="/dpn.pdf" target="_blank">Data Protection Notice</a>
          </p>
        </div>

        <br />

        <div class="column is-two-fifths">
          <div>
            <p class="subtitle mb-0">Subscribe to our Newsletter for updates</p>
            <div class="field has-addons">
              <div class="control">
                <input
                  class="input"
                  type="email"
                  v-model="email"
                  placeholder="Email"
                />
              </div>
              <div class="control">
                <a class="button is-primary" @click="subscribe">Subscribe</a>
              </div>
            </div>
          </div>

          <br />

          <!-- Social media platforms -->
          <div>
            <p class="subtitle mb-0">Follow us</p>
            <a
              href="https://www.linkedin.com/company/enkel-digital/"
              target="_blank"
              class="fa-2x mr-3"
            >
              <i class="fab fa-linkedin" />
            </a>
            <a
              href="https://t.me/Jaimeloeuf"
              target="_blank"
              class="fa-2x mr-3"
            >
              <i class="fab fa-telegram" />
            </a>
            <a
              href="https://www.facebook.com/Ministry-of-PUP-422583404451946/"
              target="_blank"
              class="fa-2x mr-3"
            >
              <i class="fab fa-facebook" />
            </a>
            <a
              href="https://instagram.com/ministryofpup/"
              target="_blank"
              class="fa-2x mr-3"
            >
              <i class="fab fa-instagram-square" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",

  data() {
    return { email: undefined };
  },

  methods: {
    async subscribe() {
      // Strip input email of whitespaces
      // 'this.email &&' gaurd as email defaults to undefined
      this.email = this.email && this.email.replace(/\s/g, "");

      // Stop function and do nothing if the required input is missing
      //
      // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      // This is not foolproof but should prevent most simple cases
      // This does not prevent fake TLD and stuff like anystring@anystring.anystring
      //
      // However following these articles, it is probably just fine, at most we can implement mailcheck and verification
      // https://davidcel.is/posts/stop-validating-email-addresses-with-regex/
      // https://www.npmjs.com/package/mailcheck
      if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email))
        return alert("Invalid email");

      const { getRecaptchaToken } = await import("../recaptcha");
      const token = await getRecaptchaToken("subscribeNewsletter");

      const { oof } = await import("simpler-fetch");
      const { res, err } = await oof
        .POST(
          (process.env.NODE_ENV === "production"
            ? "https://api.ministryofpup.com"
            : "http://localhost:3000") + "/newsletter/subscribe"
        )
        .once()
        .header({ "x-recaptcha-token": token })
        .bodyJSON({ email: this.email })
        .runJSON();

      if (err || !res.ok) {
        console.error(err);

        // If the API call failed for whatever reason, recursively dispatch itself again if user wants to retry,
        // And always make sure that this method call ends right here by putting it in a return expression.
        return confirm(`Error: \n${err}\n\nTry again?`) && this.subscribe();
      }

      alert("Subscribed!");
    },
  },
};
</script>

<style scoped>
footer {
  background-color: rgb(51, 51, 51);
}

p,
a,
/* Prevents link from changing color when pressed */
a:visited {
  color: #737373;
}

i {
  /* Give the icons a lighter grey color to prevent the contrast from being too high */
  color: rgb(200, 200, 200);
}

.subtitle {
  /* White but not too glaring from the contrast */
  color: rgb(240, 240, 240);
}
</style>
