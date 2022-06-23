<template>
  <div class="columns is-multiline" style="max-width: 50em">
    <div class="column">
      <p class="subtitle">See blocked time slots and opening time here</p>
    </div>

    <div class="column is-narrow">
      <button class="button is-success is-light" @click="getSchedule">
        Refresh
      </button>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div v-if="loading" class="column is-full">
      <p class="title">... Loading ...</p>
    </div>

    <div v-else class="column is-full">
      <!-- Opening time -->
      <div class="columns is-multiline">
        <div class="column is-full">
          <p class="subtitle">Opening time</p>
        </div>

        <div class="column is-one-quarter" v-for="i in 7" :key="i">
          <div class="card">
            <div class="card-content">
              <b>{{ weekday[i] }} </b>
              <br />

              <ul v-for="(time, j) in openingTime[i]" :key="j">
                <li>{{ toHour(time.start) }} - {{ toHour(time.end) }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Blocked out dates -->
      <div class="columns is-multiline">
        <div class="column is-full">
          <p class="subtitle">Blocked Dates</p>
        </div>

        <div
          class="column is-full"
          v-if="!blockedDates || !blockedDates.length"
        >
          <p class="subtitle ml-4">No blocked dates</p>
        </div>

        <div
          class="column is-half"
          v-for="(blockedDate, i) in blockedDates"
          :key="i"
        >
          <div class="card">
            <div class="card-content">
              <div class="columns is-vcentered">
                <div class="column">
                  <b>
                    {{
                      new Intl.DateTimeFormat("default", {
                        dateStyle: "full",
                      }).format(new Date(blockedDate.startOfDay))
                    }}
                  </b>
                </div>

                <div class="column is-narrow">
                  <button
                    class="button is-danger"
                    @click="deleteBlockedDate(blockedDate.id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Blocked out times -->
      <!-- <div class="columns is-multiline">
        <div class="column is-full">
          <p class="subtitle">Blocked Dates</p>
        </div>

        <div
          class="column is-full"
          v-if="!blockedDates || !blockedDates.length"
        >
          <p class="subtitle ml-4">No blocked dates</p>
        </div>

        <div
          class="column is-three-quarters"
          v-for="(blockedDate, i) in blockedDates"
          :key="i"
        >
          <div class="card">
            <div class="card-content">
              <div class="columns">
                <div class="column">
                  Start
                  <b>
                    {{
                      new Intl.DateTimeFormat("default", {
                        dateStyle: "full",
                        timeStyle: "short",
                      }).format(new Date(blockedDate.start))
                    }}
                  </b>
                  <br />

                  End
                  <b>
                    {{
                      new Intl.DateTimeFormat("default", {
                        dateStyle: "full",
                        timeStyle: "short",
                      }).format(new Date(blockedDate.end))
                    }}
                  </b>
                </div>

                <div class="column is-narrow">
                  <button
                    class="button is-danger"
                    @click="deleteBlockedDate(blockedDate.start)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

export default {
  name: "SeeSchedule",

  data() {
    return {
      loading: true,

      // Day index of 1 to 7 where 1 is monday, thus element 0 is empty string
      weekday: [
        "",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],

      /* Values set by the methods after reading from API */
      openingTime: undefined,
      blockedDates: undefined,
    };
  },

  created() {
    this.getSchedule();
  },

  methods: {
    toHour(milliseconds) {
      const mins = milliseconds / 60 / 1000;

      const min = mins % 60;
      const normalizedMin = min ? `:${min}` : "";

      const hour = Math.trunc(mins / 60);
      const hourRemainder = hour - 12;
      const normalizedHour = hourRemainder > 0 ? hourRemainder : hour;

      // 12 hours * 60 mins - 1 min = 719 mins
      // If 12 hours or even a minute over 12 hours, it is considered PM
      const period = mins > 719 ? "PM" : "AM";

      return `${normalizedHour}${normalizedMin}${period}`;
    },

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

      this.openingTime = res.openingTime;
      this.blockedDates = res.blockedDates;

      this.loading = false;
    },

    async deleteBlockedDate(startOfBlockedDate) {
      return alert("Feature only available in v2");

      // eslint-disable-next-line no-unreachable
      this.loading = true;

      const res = await oof
        .POST(`/admin/schedule/blocked-dates/delete/${startOfBlockedDate}`)
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) &&
          this.deleteBlockedDate(startOfBlockedDate)
        );

      // Could be better but simple method is just call getSchedule to refresh the schedule
      // await to make sure it complete before it sets loading to false
      await this.getSchedule();
    },
  },
};
</script>
