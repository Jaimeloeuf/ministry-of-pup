<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
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

    <div class="column is-full" v-for="(day, dayInt) in days" :key="dayInt">
      <div class="columns is-multiline">
        <div class="column is-full">
          <p class="subtitle">{{ day }}</p>
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
function getWeekDayString(weekdayInt) {
  const now = new Date();

  const currentDay = now.getDay();
  const distance = weekdayInt - currentDay;
  now.setDate(now.getDate() + distance);

  return now.toLocaleString("default", {
    weekday: "long",
  });
}

export default {
  name: "SetOpeningHours",

  data() {
    const defaultTimeSlot = { start: "10:00", end: "20:00" };

    return {
      days: [...Array(7).keys()].map((index) => getWeekDayString(index + 1)),

      defaultTimeSlot,

      // @todo Load from DB
      timeSlots: [...Array(7).keys()].map((_) => [{ ...defaultTimeSlot }]),
    };
  },

  methods: {
    async update() {
      // Validate the timeslots like BlockSchedule view
    },
  },
};
</script>
