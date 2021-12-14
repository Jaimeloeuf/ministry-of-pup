<template>
  <div class="pr-5">
    <canvas id="graph"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

import appointmentSource from "mop-appointment-src";

export default {
  name: "AppointmentSource",

  mounted() {
    this.loadData();
  },

  methods: {
    // Group by date or time window?
    async loadData() {
      const res = await oof
        .GET("/analytics/appointment/source")
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) && this.loadData()
        );

      const { sources } = res;

      const appointmentKeys = Object.keys(appointmentSource);

      const chart = new Chart(document.getElementById("graph"), {
        type: "pie",
        data: {
          labels: appointmentKeys.map((key) => appointmentSource[key]),
          datasets: [
            {
              label: "My First Dataset",
              data: appointmentKeys.map((key) => sources[key]),
              //   backgroundColor: [
              //     "rgb(255, 99, 132)",
              //     "rgb(54, 162, 235)",
              //     "rgb(255, 205, 86)",
              //   ],
              hoverOffset: 4,
            },
          ],
        },
      });
    },
  },
};
</script>
