<template>
  <div
    class="columns is-multiline is-centered is-vcentered"
    style="max-width: 50em"
  >
    <div class="column">
      <p class="subtitle">
        Appointment <b>{{ appointmentID }}</b>
      </p>
    </div>

    <div class="column is-narrow">
      <button class="button is-light is-danger" @click="cancelAppointment">
        Cancel
      </button>
    </div>

    <div class="column is-full">
      <b>
        {{ formatDate(appointment.time) }}
      </b>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div v-if="loading" class="column is-full">
      <p class="title is-1">... Loading ...</p>
    </div>

    <div class="column is-full">
      <p class="subtitle">Customer details</p>
    </div>

    <div class="column">
      <b>Name</b>
      <br />
      <p class="subtitle">{{ `${appointment.lname} ${appointment.fname}` }}</p>
    </div>

    <div class="column">
      <b>Source</b>
      <br />
      <!-- Convert the source to its full name, else if not defined, use the abbreviated name directly-->
      {{ appointmentSrcMapping[appointment.src] || appointment.src }}
    </div>

    <!-- Use a full offset to add a empty row without adding additional Y axis padding -->
    <div class="column is-offset-12 py-0"></div>

    <div class="column">
      <b>Number</b> (click to call)
      <br />
      <a class="button is-fullwidth" :href="'tel:' + appointment.number">
        {{ appointment.number }}
      </a>
    </div>

    <div class="column">
      <b>Email</b> (click to email)
      <br />
      <a class="button is-fullwidth" :href="'mailto:' + appointment.email">
        {{ appointment.email }}
      </a>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <p class="subtitle">Dog preference</p>
    </div>

    <div class="column is-full">
      <div v-if="appointment.dogID">
        <p class="subtitle">Looking for specific dog</p>

        <div class="columns">
          <div class="column">
            <b>Dog ID</b>
            <br />
            <p class="subtitle">{{ appointment.dogID }}</p>
          </div>

          <div class="column">
            <b>Dog Name</b>
            <br />
            <p class="subtitle">{{ dog.name }}</p>
          </div>

          <div class="column">
            <b>Num of other appointments</b>
            <br />
            <p class="subtitle">{{ dog.appointments + 3 }}</p>
          </div>
        </div>
      </div>

      <div v-else-if="appointment.preference">
        {{ appointment.preference }}
      </div>

      <p v-else class="subtitle">Looking for specific dog? <b>No</b></p>
    </div>
  </div>
</template>

<script>
import formatDate from "../utils/formatDate.js";
import appointmentSrcMapping from "appointment_src_mapping";

export default {
  name: "Appointment",

  props: ["appointmentID"],

  data() {
    return { loading: true, appointmentSrcMapping };
  },

  created() {
    // Async arrow IIFE (so this binding is not lost) to dispatch action on created and remove loading once completed
    (async () => {
      // Trigger the action to load this specific dogs from API if it does not already exists in store
      await this.$store.dispatch(
        "appointment/getAppointment",
        this.appointmentID
      );

      this.loading = false;
    })();
  },

  computed: {
    appointment() {
      // Return appointment if available in store else return an empty object while waiting for appointment to be loaded
      return (
        this.$store.state.appointment.appointments[this.appointmentID] || {}
      );
    },

    dog() {
      const dogID = this.appointment && this.appointment.dogID;
      // return dogID && this.$store.state.dog.dogs[dogID];

      return dogID
        ? // Fake dog object to scaffold the UI first
          {
            name: "test",

            // Does not include the current appointment
            appointments: 1,
          }
        : {};
    },
  },

  methods: {
    formatDate,

    // Trigger the cancel appointment action, and redirect to all-appointments once completed
    async cancelAppointment() {
      if (!confirm("Cancel Appointment?")) return;

      this.loading = true;

      // If succeeded, redirect to all appointments else do nothing
      this.$store
        .dispatch("appointment/cancelAppointment", this.appointmentID)
        .then(() => this.$router.push({ name: "all-appointments" }))
        .catch(() => confirm("Retry?") && this.cancelAppointment());
    },
  },
};
</script>
