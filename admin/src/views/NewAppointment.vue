<template>
  <div class="columns is-multiline is-centered" style="max-width: 30em">
    <div class="column is-full">
      <label>
        <b>Dog availablity date</b>

        <DatetimePicker v-model="time" :min="today" />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Appointment Source</b>
        <br />
        *What did the customer made the appointment through?

        <div class="select is-fullwidth">
          <select v-on:change="(event) => (src = event.target.value)">
            <!-- Value must be id so that when parsing value in @change handler above it can get id instead of text -->
            <option
              v-for="src in appointmentSource"
              :value="src.id"
              :key="src.id"
              :selected="src.id === src"
            >
              {{ src.text }}
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

      // To manually update/add as new source are added
      src: "WA",
      appointmentSource: [
        {
          id: "WA",
          text: "Whatsapp",
        },
        {
          id: "IG",
          text: "Instagram",
        },
        {
          id: "FB",
          text: "FaceBook",
        },
        {
          id: "WC",
          text: "WeChat",
        },
      ],
    };
  },

  methods: {
    async book() {
      // @todo Validate all required input is entered

      // @todo Test to ensure this works
      // Ensure files are successfully uploaded first before calling API
      // If this succeeds, but API call fails then the files are just left in storage
      // If user chooses to retry, on the next recursive call, the upload files step will be skipped
      if (this.imgFolder === undefined && this.imgSrc === undefined)
        return alert("");

      // Convert this to milliseconds
      this.time;

      const res = await oof
        .POST("/admin/appointment/book")
        .header(await getAuthHeader())
        .data({
          time: this.time,
          fname: this.fname,
          lname: this.lname,
          number: this.number,
          email: this.email,
          preference: this.preference,
          src: this.src,
        })
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
