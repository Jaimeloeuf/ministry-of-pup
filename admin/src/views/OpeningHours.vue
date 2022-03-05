<template>
  <div v-if="loading" class="column is-full">
    <p class="title">... Loading ...</p>
  </div>

  <div v-else class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full content mb-0">
      <p class="subtitle mb-1">See & Set Opening Hours</p>

      <ul>
        <li>
          Changing opening hours <b>WILL NOT</b> affect appointments that are
          already booked. This only affects time slots for future bookings
        </li>

        <li>End at 8pm means last available appointment slot is 7pm - 8pm</li>

        <!-- @todo Can be removed in future versions as this is kinda arbiturary to ensure easier calculations for 1 hour booking intervals -->
        <li>Please set time to nearest hour</li>
      </ul>
    </div>

    <!-- Loop 7 times with dayInt value being 1 to 7 inclusive -->
    <div class="column is-full" v-for="dayInt in 7" :key="dayInt">
      <div class="columns is-multiline">
        <div class="column is-full">
          <!-- -1 because dayInt goes from 1 to 7 inclusive -->
          <p class="subtitle">{{ days[dayInt - 1] }}</p>
        </div>

        <div class="column is-full">
          <b v-if="timeSlots[dayInt].length === 0">
            Closed (Not available for booking)
          </b>

          <!-- First row is the start and end time labels -->
          <div v-else class="columns mb-0">
            <div class="column"><label>Start</label></div>
            <div class="column"><label>End</label></div>

            <!-- Ghost button / column to force same layout to align with the rows below -->
            <div class="column is-narrow">
              <p class="px-4" style="opacity: 0">Delete</p>
            </div>
          </div>

          <div class="columns" v-for="(_, i) in timeSlots[dayInt]" :key="i">
            <div class="column">
              <!-- step="3600" only allows hours to be set with keyboard input -->
              <!-- But some browser UI still allow setting minutes, so apply is-danger style if minute section is not 00 -->
              <input
                class="input"
                type="time"
                step="3600"
                v-model="timeSlots[dayInt][i].start"
                :class="{
                  'is-danger':
                    timeSlots[dayInt][i].start.split(':')[1] !== '00',
                }"
              />
            </div>

            <div class="column">
              <!-- step="3600" only allows hours to be set with keyboard input -->
              <!-- But some browser UI still allow setting minutes, so apply is-danger style if minute section is not 00 -->
              <input
                class="input"
                type="time"
                step="3600"
                v-model="timeSlots[dayInt][i].end"
                :class="{
                  'is-danger':
                    timeSlots[dayInt][i].end.split(':')[1] !== '00' ||
                    timeSlots[dayInt][i].end < timeSlots[dayInt][i].start ||
                    timeSlots[dayInt][i].end === timeSlots[dayInt][i].start,
                }"
              />
            </div>

            <div class="column is-narrow">
              <button
                @click="timeSlots[dayInt].splice(i, 1)"
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
            @click="timeSlots[dayInt].push({ ...defaultTimeSlot })"
            class="button is-light is-fullwidth is-warning"
          >
            Add time slot
          </button>
        </div>
      </div>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <button @click="update" class="button is-light is-fullwidth is-success">
        Update
      </button>
    </div>
  </div>
</template>

<script>
import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

export default {
  name: "SetOpeningHours",

  created() {
    // Load current opening hours on created
    this.getSchedule();
  },

  data() {
    const defaultTimeSlot = { start: "10:00", end: "20:00" };

    return {
      loading: false,

      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],

      defaultTimeSlot,

      // Timeslots loaded from DB
      timeSlots: undefined,
    };
  },

  methods: {
    // Load current opening hours onto current view
    async getSchedule() {
      this.loading = true;

      const res = await oof
        .GET("/admin/schedule")
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) && this.getSchedule()
        );

      // Transform timeslots into hour selection, from start of day unix time offsets in milliseconds
      this.timeSlots = Object.keys(res.openingTime).reduce((obj, dayInt) => {
        obj[dayInt] = res.openingTime[dayInt].map((timeslot) => ({
          // 3600000 is equivalent to to `* 60 * 60 * 1000`
          // This is basically a conversion between hour integers to unix time in milliseconds
          start: `${timeslot.start / 3600000}:00`,
          end: `${timeslot.end / 3600000}:00`,
        }));

        return obj;
      }, {});

      this.loading = false;
    },

    // Update opening hours using the API
    async update() {
      this.loading = true;

      // Reset scroll position to top so that the loading UI can be seen
      window.scrollTo(0, 0);

      // @todo Validate timeslots like BlockSchedule view

      // Transform selected time into unix time milliseconds offset from start of day
      const timeSlots = Object.keys(this.timeSlots).reduce((obj, dayInt) => {
        obj[dayInt] = this.timeSlots[dayInt].map((timeslot) => ({
          // 3600000 is equivalent to to `* 60 * 60 * 1000`
          // This is basically a conversion between hour integers to unix time in milliseconds
          start: parseInt(timeslot.start.replace(":00", "")) * 3600000,
          end: parseInt(timeslot.end.replace(":00", "")) * 3600000,
        }));

        return obj;
      }, {});

      const res = await oof
        .POST("/admin/schedule/opening")
        .header(await getAuthHeader())
        .data(timeSlots)
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Error: \n${res.error}\n\nTry again?`) && this.update();

      alert("Updated!");
      this.$router.push({ name: "schedule" });
    },
  },
};
</script>
