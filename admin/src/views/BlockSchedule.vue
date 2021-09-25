<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="subtitle">Block a date</p>
    </div>

    <div class="column is-full">
      <b v-if="blockedDates.length === 0">Nothing blocked</b>

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
    </div>

    <div class="column is-full">
      <b v-if="blockedTimes.length === 0">Nothing blocked</b>

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
import DatetimePicker from "../components/DatetimePicker.vue";

export default {
  name: "Schedule",

  components: { DatetimePicker },

  data() {
    // Might be reused later
    function todaysDate() {
      const today = new Date();
      const dd = today.getDate();
      const mm = today.getMonth() + 1; // Jan is 0, thus convert to 1 indexed first
      const yyyy = today.getFullYear();

      return `${yyyy}-${mm < 10 ? "0" + mm : mm}-${dd < 10 ? "0" + dd : dd}`;
    }

    const today = todaysDate();
    const defaultTimeSlot = { start: undefined, end: undefined };

    return {
      // Both blockedDates and blockedTimes default to empty array for now
      // Which is better than having user delete if not needed?

      today,
      blockedDates: [],
      // blockedDates: [today],

      defaultTimeSlot,
      blockedTimes: [],
      // blockedTimes: [defaultTimeSlot],
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
    },
  },
};
</script>
