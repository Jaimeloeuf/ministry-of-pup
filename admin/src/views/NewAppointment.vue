<template>
  <div class="columns is-multiline is-centered" style="max-width: 40em">
    <div class="column is-full">
      <label>
        <b>Appointment time</b>
        <br />
        *Please enter date time in 30 minute intervals, e.g. 1pm / 130pm

        <!-- 30 min intervals -->
        <DatetimePicker v-model="time" :min="today" step="1800" />
      </label>
    </div>

    <div class="column is-full">
      <!-- If user books an appointment by messaging the admins, it will be the platform (WA/FB/IG/WC) where they sent the message -->
      <label>
        <b>Appointment Source</b>
        <br />
        *What did the customer made the appointment through?

        <div class="select is-fullwidth">
          <select v-on:change="(event) => (src = event.target.value)">
            <option hidden disabled selected value>
              Please select an option
            </option>

            <option
              v-for="src in appointmentSource"
              :value="src[0]"
              :key="src[0]"
              :selected="src[0] === src"
            >
              {{ src[1] }}
            </option>
          </select>
        </div>
      </label>
    </div>
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
        *Leave blank if customer not willing to provide their email
        <br />
        Try, "I need your email too to send you the appointment confirmation
        email, with direction details and links in case you need to reschedule
        or cancel your appointment"

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
          placeholder="Optional preferences, did user indicate anything?
E.g. Cream coloured / French bulldogs / Female dog"
        />
      </label>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <button @click="book" class="button is-light is-fullwidth is-success">
        Book Appointment
      </button>
    </div>

    <div class="column is-full">
      <button @click="reset" class="button is-light is-fullwidth is-danger">
        Reset form
      </button>
    </div>
  </div>
</template>

<script>
import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

import appointmentSource from "mop-appointment-src";

import DatetimePicker from "../components/DatetimePicker.vue";
import todaysDate from "../utils/todaysDate.js";

export default {
  name: "NewAppointment",

  components: { DatetimePicker },

  data() {
    const today = todaysDate();

    return {
      today,

      time: today,

      fname: undefined,
      lname: undefined,
      number: undefined,
      email: undefined,
      preference: undefined,

      src: undefined,
      appointmentSource: Object.entries(appointmentSource),
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
      this.fname = this.fname.trim();
      this.lname = this.lname.trim();

      if (!(this.fname && this.lname && this.number))
        return alert("All fields are required except email and preference");

      // End book method if number is invalid
      const number = this.validNumber();
      if (!number) return;

      // End book method if an email is provided and it is invalid
      if (this.email && !this.validateEmail()) return alert("Invalid email");

      const postData = {
        // Time needs to be in Milliseconds
        time: new Date(this.time).getTime(),

        number,
        fname: this.fname,
        lname: this.lname,
        preference: this.preference,

        // If admin manually keys in an appointment, it means that the platform where user talked to admin,
        // is considered both where the user found out about MOP and also where the user booked from
        src: this.src,
      };

      // Only attach email property if email is provided
      // If send with undefined, API will error out as cannot call firestore with undefined
      if (this.email) postData.email = this.email;

      const res = await oof
        .POST("/admin/appointment/book")
        .header(await getAuthHeader())
        .data(postData)
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Error: \n${res.error}\n\nTry again?`) && this.book();

      alert("Appointment added");

      // Reset the page once a new dog is added
      this.reset();
    },

    reset() {
      // Reset the data values to its original state by re-running the data method
      // https://github.com/vuejs/vue/issues/702#issuecomment-308991548
      // https://www.carlcassar.com/articles/reset-data-in-a-vue-component
      Object.assign(this.$data, this.$options.data());

      // Only use this if `this` is used in the data method
      // Object.assign(this.$data, this.$options.data.apply(this));
    },
  },
};
</script>
