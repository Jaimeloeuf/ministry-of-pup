<template>
  <div id="cancel" class="px-5 py-5">
    <div v-if="cancelled" class="columns is-multiline">
      <div class="column is-full">
        <p class="title is-4 has-text-danger">
          Your appointment has been cancelled!
        </p>
      </div>

      <div class="column is-full">
        <label>
          <b>Appointment ID</b>
          <br />

          {{ appointmentID }}
        </label>
      </div>
    </div>

    <div v-else class="columns is-multiline">
      <div class="column is-full">
        <p class="title is-4 has-text-danger">Appointment Cancellation</p>
      </div>

      <div class="column is-full">
        <label>
          <b>Appointment ID</b>
          <br />

          {{ appointmentID }}
        </label>
      </div>

      <div class="column is-full">
        <button class="button is-light is-danger is-fullwidth" @click="cancel">
          Cancel Appointment
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Cancel",

  // Appointment ID passed in via router as props
  props: ["appointmentID"],

  data() {
    return { cancelled: false };
  },

  methods: {
    async cancel() {
      this.$store.commit("loading", true);

      await this.$store.dispatch("cancel", this.appointmentID);

      this.cancelled = true;
      this.$store.commit("loading", false);
    },
  },
};
</script>

<style scoped>
#cancel {
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
}
</style>
