<template>
  <div class="columns is-multiline" style="max-width: 50em">
    <div class="column">
      <p class="subtitle">See all upcoming appointments</p>
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
          <div class="card">
            <div class="card-content">
              On:
              <b>{{
                new Date(appointment.time).toLocaleString("default", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              }}</b>
              <br />

              Name: {{ `${appointment.lname} ${appointment.fname}` }}
              <br />

              Number: {{ appointment.number }}
              <br />

              Email: {{ appointment.email }}
              <br />
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

export default {
  name: "AllAppointments",

  created() {
    // @todo Update this to mapState instead and trigger a vuex action to load appointments
    this.getAppointments();
  },

  data() {
    return { loading: true, appointments: [] };
  },

  methods: {
    /**
     * Load all the scheduled appointments that hasn't ended yet from the API
     *
     * Actually it is much easier to ask API for appointments that have yet to start,
     * then appointments that have yet to end.
     * because havent end requires an additional processing round to do 'time + 30min interval' > currentTime
     */
    async getAppointments() {
      const res = await oof
        .GET("/admin/appointment/scheduled")
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) &&
          this.getAppointments()
        );

      this.appointments = res.appointments;

      // Stop showing loader
      this.loading = false;
    },
  },
};
</script>
