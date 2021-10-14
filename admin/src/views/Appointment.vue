<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="subtitle">
        Appointment #<b>{{ appointmentID }}</b>
      </p>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <p class="subtitle">Customer details</p>
    </div>

    <div class="column">
      <b>Name</b>
      <br />
      <p class="subtitle">{{ customer.name }}</p>
    </div>

    <div class="column">
      <b>Number</b> (click to call)
      <br />
      <a class="button" :href="'tel:' + customer.number">
        {{ customer.number }}
      </a>
    </div>

    <div class="column">
      <b>Email</b> (click to email)
      <br />
      <a class="button" :href="'mailto:' + customer.email">
        {{ customer.email }}
      </a>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <p class="subtitle">Dog preference</p>
    </div>

    <div class="column is-full">
      <div v-if="customer.selectedDogID">
        <p class="subtitle">Looking for specific dog</p>

        <div class="columns">
          <div class="column">
            <b>Dog ID</b>
            <br />
            <p class="subtitle">{{ customer.selectedDogID }}</p>
          </div>

          <div class="column">
            <b>Dog Name</b>
            <br />
            <p class="subtitle">{{ dog.name || "Unspecified" }}</p>
          </div>

          <div class="column">
            <b>Num of other appointments</b>
            <br />
            <p class="subtitle">{{ dog.appointments + 3 }}</p>
          </div>
        </div>
      </div>

      <p v-else class="subtitle">Looking for specific dog? <b>No</b></p>

      <!-- <b>Looking for</b>
      <p class="subtitle">{{ customer.selectedDog || "Unspecified" }}</p> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "Appointment",

  props: ["appointmentID"],

  computed: {
    // This should be mapped from vuex
    customer() {
      return {
        // User details
        name: "John Smith Super super long name",
        number: "+65 92345678",
        email: "john_smith@example.com",

        // Selected dog details
        selectedDogID: 1,
      };
    },

    dog() {
      const selectedDogID = this.customer?.selectedDogID;
      return selectedDogID
        ? {
            name: "",

            // Does not include the current appointment
            appointments: 1,
          }
        : {};
    },
  },
};
</script>
