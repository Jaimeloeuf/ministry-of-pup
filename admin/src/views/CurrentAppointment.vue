<template>
  <div>
    <p class="subtitle is-4 mb-4">Current Appointment</p>

    <div v-if="currentAppointmentID">
      <Appointment :appointmentID="currentAppointmentID" />
    </div>

    <div v-else-if="loading">
      <b>Loading...</b>
    </div>

    <div v-else>
      <b>No Appointments right now</b>
    </div>
  </div>
</template>

<script>
// Current Appointment view is just a wrapper over appointment view with a given appointment ID

import Appointment from "./Appointment.vue";

export default {
  name: "CurrentAppointment",

  components: { Appointment },

  created() {
    // Call method to get current appointment ID the moment this component is created
    this.getCurrentAppointment();
  },

  data() {
    return { loading: true, currentAppointmentID: undefined };
  },

  methods: {
    async getCurrentAppointment() {
      // @todo Call API to get current appointment if any and set the appointmentID
      // this.currentAppointmentID

      // Set loading to false once API call is complete to show "no appointments" if there is none
      this.loading = false;
    },
  },
};
</script>
