<template>
  <div class="columns is-multiline is-vcentered" style="max-width: 50em">
    <div class="column">
      <p class="subtitle">See all upcoming appointments</p>
    </div>

    <div class="column is-narrow">
      <button class="button" @click="getAppointments">Refresh</button>
    </div>

    <div class="column is-narrow">
      <!-- Link to google cal to click open google cal app on iPad -->
      <a
        href="https://calendar.google.com/calendar?cid=bWluaXN0cnlvZnB1cEBnbWFpbC5jb20"
        target="_blank"
        class="button is-success is-light"
      >
        See calendar
      </a>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div v-if="loading" class="column is-full">
      <p class="subtitle">... Loading ...</p>
    </div>

    <!-- If not loading from API and appointments array is still empty -->
    <div v-else-if="appointments.length === 0" class="column is-full">
      <p class="subtitle">No upcoming appointments</p>
    </div>

    <!-- If loading complete and there are upcoming appointments -->
    <div v-else class="column is-full">
      <p>Sort by: Nearest appointment first</p>
      <br />

      <div class="columns is-multiline">
        <!-- Columns of half max width to show appointments 2 by 2 -->
        <router-link
          v-for="(appointment, i) in appointments"
          :key="i"
          :to="{
            name: 'appointment',
            params: { appointmentID: appointment.id },
          }"
          class="column is-half"
        >
          <!-- @todo Hightlight the current appointment green and the next appointment yellow, and add a note to explain the colors -->
          <div class="card">
            <div class="card-content">
              <b>{{ formatDate(appointment.time) }}</b>
              <br />

              Name: {{ `${appointment.lname} ${appointment.fname}` }}
              <br />

              Number: {{ appointment.number }}
              <br />

              Email: {{ appointment.email }}
              <br />

              Source: {{ appointmentSrcMapping[appointment.src] }}
              <br />
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import formatDate from "../utils/formatDate.js";
import appointmentSrcMapping from "mop-appointment-src";

export default {
  name: "AllAppointments",

  created() {
    // Load appointments on created
    // this.getAppointments();

    // Async arrow IIFE (so this binding is not lost) to dispatch action on created and remove loading once completed
    (async () => {
      // Trigger the action to load all scheduled appointments from API as user enters this view
      await this.$store.dispatch("appointment/getAppointments");

      // Stop showing loader
      this.loading = false;
    })();
  },

  computed: mapGetters("appointment", ["appointments"]),

  data() {
    return { loading: true, appointmentSrcMapping };
  },

  methods: {
    formatDate,

    async getAppointments() {
      // Show loader
      this.loading = true;

      // Trigger the action to load all scheduled appointments from API as user enters this view
      await this.$store.dispatch("appointment/getAppointments");

      // Stop showing loader
      this.loading = false;
    },
  },
};
</script>
