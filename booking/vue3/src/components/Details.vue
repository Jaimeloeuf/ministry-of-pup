<template>
  <div class="px-5 py-5">
    <div class="columns is-multiline box">
      <div class="column is-full">
        <p class="title is-3">Enter your details</p>
      </div>

      <div class="column is-full">
        <div class="columns is-multiline">
          <div class="column is-full">
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

          <div class="column is-full">
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

          <div class="column is-full">
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

          <div class="column is-full">
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

          <div class="column is-full">
            <label>
              <b>Preference</b>
              <br />

              <textarea
                v-model="preference"
                class="textarea"
                placeholder="Optional preferences, tell us what you like!

E.g. Cream coloured / French bulldogs / Female dog"
              />
            </label>
          </div>

          <div class="column is-full">
            <label>
              <b>Where did you discover us?</b>
              <br />

              <div class="select is-fullwidth">
                <select v-on:change="(event) => (src = event.target.value)">
                  <option hidden disabled selected value>
                    Please select an option
                  </option>

                  <option
                    v-for="(source, key) in appointmentSource"
                    :value="key"
                    :key="key"
                    :selected="key === src"
                  >
                    {{ source }}
                  </option>
                </select>
              </div>
            </label>
          </div>

          <!-- Friend referral option requires the friend's number too as referral code -->
          <!-- @todo Allow this to be auto filled through a custom link from friend -->
          <div class="column is-full" v-if="src === 'FR'">
            <label>
              <b>Friend's Phone number (+65)</b>
              <br />
              *Enter their number as referral code to get a discount!

              <input
                class="input"
                type="tel"
                pattern="[\s0-9]+"
                min="10000000"
                max="99999999"
                v-model="referralCode"
                placeholder="E.g. 92345678"
              />
            </label>
          </div>

          <!-- @todo For now it shares the referralCode variable, but most likely will be changed -->
          <div class="column is-full" v-else-if="src === 'OT'">
            <label>
              <input
                class="input"
                type="text"
                v-model="referralCode"
                placeholder="E.g. From the News"
              />
            </label>
          </div>

          <div class="column is-half">
            <button class="button is-fullwidth py-5" @click="$router.back">
              Back
            </button>
          </div>

          <div class="column is-half">
            <button
              class="button is-fullwidth py-5 is-light is-success"
              @click="book"
            >
              Book
            </button>
          </div>

          <div class="column">
            <p style="font-size: 0.6em">
              By booking an appointment, you agree to the
              <a href="https://ministryofpup.com/#/terms" target="_blank">
                terms of use and privacy policy.
              </a>
              Here is our
              <a href="https://ministryofpup.com/dpn.pdf" target="_blank">
                Data Protection Notice.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appointmentSource from "mop-appointment-src";
// Remove the UN/undefined option as user should not be able to choose it
delete appointmentSource.UN;

export default {
  name: "Details",

  data() {
    // Defaults to value in store, but let user modify it if needed
    // If the value is UN for undefined, then convert it to undefined so HTML select tag will show the prompt option
    // Else use the value as the default one so users do not need to do anything if it is already the same
    const src =
      this.$store.state.src === "UN" ? undefined : this.$store.state.src;

    // Checks if the src is a friend referral link
    // Use optional chaining operator as src might be undefined
    const isFriendReferral = src?.includes("FR");

    return {
      fname: undefined,
      lname: undefined,
      number: undefined,
      email: undefined,
      preference: undefined,

      // If the src is a friend referral link, use FR instead of the full string to work with the dropdown
      src: isFriendReferral ? "FR" : src,
      // Split out the referral code if there is, else leave as undefined
      referralCode: isFriendReferral ? src.split("-")[1] : undefined,

      appointmentSource,
    };
  },

  methods: {
    /** @returns {undefined | Number} Returns parsed Number if number is valid and undefined if number is invalid */
    validNumber() {
      // Strip input number of whitespaces
      this.number = this.number.replace(/\s/g, "");

      if (this.number.length !== 8)
        return alert("Invalid number, only 8 digit Singapore numbers accepted");

      // https://en.wikipedia.org/wiki/Telephone_numbers_in_Singapore
      // Number is still string, thus comparing with chars
      if (
        this.number[0] !== "8" &&
        this.number[0] !== "9" &&
        this.number[0] !== "6" &&
        this.number[0] !== "3"
      )
        return alert(
          "Please enter a valid Singapore number beginning with 3, 6, 8 or 9"
        );

      // Note: parsed value cannot be set back to this.number as it will be invalid to use Number in HTML input as it expects a string
      // Parse number from string input to Number and make sure that the parsing worked
      const number = parseInt(this.number);
      if (Number.isNaN(number))
        return alert("Invalid number format, please only use numerical digits");

      // Return parsed number
      return number;
    },

    /** @returns {Boolean} Returns boolean depending if email is valid */
    validateEmail() {
      // Strip input email of whitespaces
      this.email = this.email.replace(/\s/g, "");

      // https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
      // This is not foolproof but should prevent most simple cases
      // This does not prevent fake TLD and stuff like anystring@anystring.anystring
      //
      // However following these articles, it is probably just fine, at most we can implement mailcheck and verification
      // https://davidcel.is/posts/stop-validating-email-addresses-with-regex/
      // https://www.npmjs.com/package/mailcheck
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    },

    async book() {
      // Remove starting and trailing whitespaces from string inputs only as name may contain seperating spaces
      // Use optional chaining as fname and lname maybe be undefined, therefore prevents reading trim prop on undefined bug
      this.fname = this.fname?.trim();
      this.lname = this.lname?.trim();

      // @todo Fix this for iOS
      if (!(this.fname && this.lname && this.number && this.email))
        return alert("All fields are required except 'preference'");

      // End book method if number is invalid
      const number = this.validNumber();
      if (!number) return;

      // End book method if email is invalid
      if (!this.validateEmail()) return alert("Invalid email");

      // If user choose "Friend Referral" as how they found us, then they must enter their friend's number
      if (this.src === "FR" && !this.referralCode)
        return alert("Missing number for Friend Referral");

      this.$store.commit("loading", true);

      // Only update src in state if user changed it to be something else other than undefined
      if (this.src) this.$store.commit("setter", ["src", this.src]);

      this.$store.commit("setter", [
        "details",
        {
          fname: this.fname,
          lname: this.lname,
          number,
          email: this.email,
          preference: this.preference || "",
          referralCode: this.referralCode,
        },
      ]);

      // If booking failed, clear loader and end method to let user try again
      if (!(await this.$store.dispatch("book")))
        return this.$store.commit("loading", false);

      this.$store.commit("loading", false);
      this.$router.push({ name: "complete" });
    },
  },
};
</script>
