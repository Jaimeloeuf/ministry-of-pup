<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="subtitle">Dog ID: {{ dogID }}</p>
    </div>

    <div class="column is-full" v-if="dog">
      <DogCard :dog="dog" />
    </div>

    <div class="column is-full" v-if="dog">
      <p class="subtitle">Copy Writing</p>
      {{ dog.description }}
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <!-- Upcoming appointments for this dog -->
    <!-- @todo Only show this is the dog is not sold yet? -->
    <!-- @todo Then show 1 more where the dog is sold, to see past appointments and cancelled appointments
      because some ppl book alr but someone else bought the dog instead -->
    <div class="column is-full">
      <p class="subtitle">Upcoming Appointments</p>

      <button @click="loadAppointments" class="button is-light is-success">
        Load Appointments
      </button>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <!-- Sold button will link to SoldDog view with the dog name prefilled -->
    <div class="column is-full">
      <router-link
        :to="{ name: 'sold-dog', query: { _dogID: dogID } }"
        class="button is-light is-success is-fullwidth"
      >
        Sold
      </router-link>
    </div>
  </div>
</template>

<script>
/*
  The card layout is scaffolded using https://codepen.io/nedpals/pen/jKLBmJ
  The SCSS in the codepen is converted to css with https://jsonformatter.org/scss-to-css
*/

import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

import DogCard from "../components/DogCard.vue";

export default {
  name: "Dog",

  props: ["dogID"],

  components: { DogCard },

  created() {
    // Trigger the action to load this specific dogs from API if it does not already exists in store
    this.$store.dispatch("dog/getDog", this.dogID);
  },

  computed: {
    dog() {
      return this.$store.state.dog.dogs[this.dogID];
    },
  },

  methods: {
    // Load all appointments for this specific dog
    async loadAppointments() {
      return alert("Not implemented yet, scheduled for v2");

      // eslint-disable-next-line no-unreachable
      const res = await oof
        .GET(`/admin/appointments?dogID=${this.dogID}`)
        .header(getAuthHeader)
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Error: \n${res.error}\n\nTry again?`) && this.getDogs();

      this.appointments = res.appointments;
    },
  },
};
</script>
