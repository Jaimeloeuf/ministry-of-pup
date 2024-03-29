<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="subtitle">Add more <b>Blocked Dates & Timeslots</b></p>
    </div>

    <div class="column is-full">
      <b v-if="blockedDates.length === 0">Nothing to block yet</b>

      <div class="columns" v-for="(_, i) in blockedDates" :key="i">
        <div class="column">
          <input
            class="input"
            type="date"
            :min="today"
            v-model="blockedDates[i]"
          />
        </div>

        <div class="column is-narrow">
          <button
            @click="blockedDates.splice(i, 1)"
            class="button is-light is-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div class="column is-full">
      <button
        @click="blockedDates.push(today)"
        class="button is-light is-fullwidth is-warning"
      >
        Block another day
      </button>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <p class="subtitle">Block a time slot</p>
      *v1 only supports a single blocked timeslot in the same day
    </div>

    <div class="column is-full">
      <b v-if="blockedTimes.length === 0">Nothing to block yet</b>

      <!-- First row is the start and end time labels -->
      <div v-else class="columns mb-0">
        <div class="column"><label>Start</label></div>
        <div class="column"><label>End</label></div>

        <!-- Ghost button / column to force same layout to align with the rows below -->
        <div class="column is-narrow">
          <p class="px-4" style="opacity: 0">Delete</p>
        </div>
      </div>

      <div class="columns" v-for="(_, i) in blockedTimes" :key="i">
        <div class="column">
          <DatetimePicker v-model="blockedTimes[i].start" />
        </div>

        <div class="column">
          <DatetimePicker
            v-model="blockedTimes[i].end"
            :class="{
              'is-danger':
                blockedTimes[i].end < blockedTimes[i].start ||
                blockedTimes[i].end === blockedTimes[i].start,
            }"
          />
        </div>

        <div class="column is-narrow">
          <button
            @click="blockedTimes.splice(i, 1)"
            class="button is-light is-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div class="column is-full">
      <!-- Create new object using spread operator to prevent pointing to the same defaultTimeSlot object -->
      <button
        @click="blockedTimes.push({ ...defaultTimeSlot })"
        class="button is-light is-fullwidth is-warning"
      >
        Block another time slot
      </button>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <button @click="block" class="button is-light is-fullwidth is-success">
        Confirm
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
  name: "Schedule",

  components: { DatetimePicker },

  data() {
    const today = todaysDate();
    const defaultTimeSlot = { start: undefined, end: undefined };

    return {
      today,
      blockedDates: [],

      defaultTimeSlot,
      blockedTimes: [],
    };
  },

  methods: {
    async block() {
      // Validate that all the blockedTimes, their end is after the start, and their end is not equal to the start
      for (const blockedTime of this.blockedTimes) {
        if (blockedTime.end < blockedTime.start)
          return alert("Blocked time end must be after start!");

        if (blockedTime.end === blockedTime.start)
          return alert("Blocked time cannot have the same start and end time!");
      }

      const res = await oof
        .POST("/admin/schedule/block")
        .header(getAuthHeader)
        .data({ dates: this.blockedDates })
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Error: \n${res.error}\n\nTry again?`) && this.block();

      // @todo Reset the component's data if not redirecting to the SeeSchedule view
      this.$router.push({ name: "schedule" });

      // this.loading = false;
    },
  },
};
</script>
