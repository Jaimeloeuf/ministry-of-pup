<template>
  <div class="px-5 py-5">
    <div class="columns is-multiline box">
      <div class="column is-full">
        <p class="title is-4">Appointment booked</p>
        <p class="subtitle">See you soon!</p>
        <p class="subtitle has-background-light box">
          Please check out for a appointment confirmation email sent to you,
          unfortunately it might be sent to your junk/spam despite our cute dogs
          🥺
        </p>
      </div>

      <div class="column is-full">
        <div class="columns is-multiline">
          <div class="column is-full">
            <label>
              <b>On</b>
              <br />

              <!--
                For whatever reason, browsers have yet to support the shorter form of passing options to locale formatter directly
                console.log(new Date().toLocaleDateString("default", { dateStyle: "full", timeStyle: "short" }));
                
                Only longer form works by passing to DateTimeFormat method.
                console.log(new Intl.DateTimeFormat('default', { dateStyle: 'full', timeStyle: 'short' }).format(new Date()));
              -->
              {{
                new Intl.DateTimeFormat("default", {
                  dateStyle: "full",
                  timeStyle: "short",
                }).format(new Date(selectedTimeslot))
              }}
            </label>
          </div>

          <div class="column is-full">
            <label>
              <b>Appointment ID</b>
              <br />

              {{ appointmentID }}
            </label>
          </div>

          <div class="column is-full content">
            <label>
              <b>Details</b>
              <br />

              <ul>
                <li>{{ `${details.lname} ${details.fname}` }}</li>
                <li>{{ details.number }}</li>
                <li>{{ details.email }}</li>
              </ul>
            </label>
          </div>

          <!-- @todo Change to icons instead -->
          <div class="column is-full">
            <p class="subtitle">Add to Calendar</p>
          </div>

          <div class="column is-half">
            <a
              class="button is-fullwidth"
              :href="google(event)"
              target="_blank"
            >
              Google Calendar
            </a>
          </div>

          <div class="column is-half">
            <!-- Standard ICS file based on https://icalendar.org -->
            <a class="button is-fullwidth" :href="ics(event)" target="_blank">
              iOS
            </a>
          </div>

          <div class="column is-half">
            <a
              class="button is-fullwidth"
              :href="office365(event)"
              target="_blank"
            >
              Office 365 Calendar
            </a>
          </div>

          <div class="column is-half">
            <a
              class="button is-fullwidth"
              :href="outlook(event)"
              target="_blank"
            >
              Outlook Calendar
            </a>
          </div>

          <div class="column is-half">
            <a class="button is-fullwidth" :href="yahoo(event)" target="_blank">
              Yahoo Calendar
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import calendarDescription from "./calendarDescription.js";
import { google, outlook, office365, yahoo, ics } from "calendar-link";

export default {
  name: "Complete",

  data() {
    const state = this.$store.state;

    return {
      selectedTimeslot: state.selectedTimeslot,
      appointmentID: state.appointmentID,
      details: state.details,

      // Generate event object for the calendar links using data from state
      event: {
        title: "Play session at Ministry Of Pup!",
        start: state.selectedTimeslot,
        duration: [1, "hours"],
        busy: true,
        description: calendarDescription(
          state.details.fname,
          state.appointmentID
        ),
        location: "43 Kampong Bahru Rd, Singapore 169359",
      },
    };
  },

  methods: {
    google,
    outlook,
    office365,
    yahoo,
    ics,
  },
};
</script>
