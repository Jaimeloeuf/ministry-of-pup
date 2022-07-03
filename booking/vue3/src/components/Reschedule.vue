<template>
  <div class="px-5 py-5 centered">
    <div class="box">
      <div class="columns is-multiline">
        <div class="column is-full">
          <p class="title is-4" v-if="rescheduled">
            Your appointment has been rescheduled!
          </p>
          <p class="title is-4" v-else>Reschedule Appointment</p>
        </div>

        <!-- @todo Copy complete.vue and show stuff for the calendar... -->

        <div class="column is-half">
          <label>
            <b>From</b>
            <br />

            {{ formatTimeslot(originalTimeslot) }}
          </label>
        </div>

        <div class="column is-half">
          <label>
            <b>To</b>
            <br />

            {{ formatTimeslot(selectedTimeslot) }}
          </label>
        </div>

        <div class="column is-full" v-if="!rescheduled">
          <button
            class="button is-light is-success is-fullwidth"
            @click="reschedule"
          >
            reschedule
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import formatTimeslot from "../utils/formatTimeslot.js";

export default {
  name: "Reschedule",

  data() {
    return { rescheduled: false };
  },

  computed: {
    ...mapState(["originalTimeslot", "selectedTimeslot"]),
  },

  methods: {
    formatTimeslot,

    async reschedule() {
      this.$store.commit("loading", true);

      await this.$store.dispatch("reschedule");

      this.rescheduled = true;
      this.$store.commit("loading", false);
    },
  },
};
</script>
