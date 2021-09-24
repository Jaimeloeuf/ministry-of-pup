<template>
  <canvas id="graph"></canvas>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "Chart",

  mounted() {
    const ctx = document.getElementById("graph");
    const exampleChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Bulldog", "Shiba Inu", "Bulldog 2", "Shiba Inu 2"],
        datasets: [
          {
            label: "Dogs sold",
            data: [12, 17, 5, 8],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  },
};
</script>
