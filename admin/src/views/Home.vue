<template>
  <div>
    <!-- @todo Move loader to parent/global, then triggered by a event or smth -->
    <!-- <loader v-if="loader" /> -->

    <Chart class="pr-5" />
  </div>
</template>

<script>
import Chart from "../components/Chart";

export default {
  name: "Home",

  components: { Chart },

  computed: {
    // Load ID of current trip from vuex
    currentTripID() {
      return this.$store.state.trip.currentTrip;
    },
  },
};
</script>
