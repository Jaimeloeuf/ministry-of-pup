<template>
  <div class="px-5 py-5">
    <div class="columns is-multiline">
      <div class="column is-full">
        <p class="title is-3">Book a play session!</p>
      </div>

      <div class="column is-full">
        <div class="card px-5">
          <div class="card-content content">
            <p class="subtitle is-4">Select a date</p>

            <div v-for="(date, i) in datesAvailable" :key="i">
              <div
                class="level is-mobile my-4"
                style="cursor: pointer"
                @click="selectDate(date)"
              >
                <div class="level-left">
                  <div class="level-item">
                    {{
                      new Date(date.date).toLocaleString("default", {
                        weekday: "long",
                      })
                    }}
                  </div>
                </div>

                <div class="level-right">
                  <div class="level-item">
                    {{ new Date(date.date).getDate() }}

                    {{
                      new Date(date.date).toLocaleString("default", {
                        month: "long",
                      })
                    }}
                  </div>
                </div>
              </div>

              <!-- @todo Why is the HR alternating in boldness? -->
              <hr style="background-color: #dedede" />
            </div>

            <button class="button is-light is-fullwidth" @click="getMoreDates">
              See More Available Dates
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Booking",

  created() {
    // Only run this on first load, so that if user navigates back from timeslots dates will not be loaded again
    if (this.datesAvailable.length === 0) this.loadDates();
  },

  computed: mapState(["datesAvailable"]),

  methods: {
    async loadDates(after) {
      this.$store.commit("loading", true);
      await this.$store.dispatch("loadDates", after);
      this.$store.commit("loading", false);
    },

    async getMoreDates() {
      this.loadDates(
        // Get the last date in available dates to get more timeslots after that date
        // SADLY SAFARI does not support .at() ... smh
        // state.datesAvailable.at(-1)?.date,
        this.$store.state.datesAvailable[
          this.$store.state.datesAvailable.length - 1
        ]?.date
      );
    },

    selectDate(date) {
      this.$store.commit("setSelectedDate", date);
      this.$router.push({ name: "select-timeslot" });
    },
  },
};
</script>
