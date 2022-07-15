<template>
  <div class="px-5 py-5">
    <div class="columns is-multiline">
      <div class="column is-full">
        <p class="title is-3">Select a time</p>
      </div>

      <div class="column is-full">
        <div class="columns is-mobile is-vcentered">
          <div class="column">
            <p class="subtitle">
              On
              {{
                new Date(selectedDate.date).toLocaleString("default", {
                  dateStyle: "long",
                })
              }}
            </p>
          </div>

          <div class="column is-narrow">
            <button class="button" @click="$router.back">Back</button>
          </div>
        </div>
      </div>

      <div class="column is-full">
        <div class="card">
          <div class="card-content content">
            <p class="subtitle is-4">Select a time</p>

            <button
              class="button is-light is-rounded mb-5 mx-4"
              v-for="timeslot in selectedDate.timeslots"
              :key="timeslot"
              @click="selectTimeslot(timeslot)"
            >
              {{ timeslotString(timeslot) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

const formatMsToTime = (milliseconds) =>
  new Date(milliseconds).toLocaleString("default", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

export default {
  name: "Timeslots",

  computed: mapState(["selectedDate"]),

  methods: {
    timeslotString: (timeslotTimeInMilliseconds) =>
      formatMsToTime(timeslotTimeInMilliseconds) +
      " - " +
      // 60 mins * 60000 milliseconds = 3600000 milliseconds
      formatMsToTime(timeslotTimeInMilliseconds + 3600000),

    selectTimeslot(timeslot) {
      this.$store.commit("setter", ["selectedTimeslot", timeslot]);

      // After the user has selected a timeslot, route user to different views,
      // depending on whether they are making a new appointment or rescheduling one.
      this.$router.push({
        name: this.$store.state.reschedule ? "reschedule" : "details",
      });
    },
  },
};
</script>
