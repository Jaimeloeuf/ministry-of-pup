<template>
  <div class="px-5 pt-5">
    <div class="columns is-multiline">
      <div class="column is-full">
        <p class="title is-4">Book a play session!</p>
      </div>

      <div class="column is-full">
        <div class="card px-5">
          <div class="card-content content">
            <p class="subtitle is-6">Select a date</p>

            <div
              class="level is-mobile"
              v-for="(date, i) in datesAvailable"
              :key="i"
              @click="selectDate(date)"
            >
              <div class="level-item">
                {{
                  new Date(date.date).toLocaleString("default", {
                    weekday: "long",
                  })
                }}
              </div>

              <div class="level-item">
                {{ new Date(date.date).getDate() }}

                {{
                  new Date(date.date).toLocaleString("default", {
                    month: "long",
                  })
                }}
              </div>

              <!-- Why is the HR alternating in boldness? -->
              <hr class="my-0" style="background-color: #dedede" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  msg: String,
});

const datesAvailable = ref([]);

function selectDate(date) {
  console.log("selectDate", date);
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
