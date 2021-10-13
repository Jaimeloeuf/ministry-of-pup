<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="subtitle">Dog ID: {{ dogID }}</p>
    </div>

    <div class="column is-full">
      <div class="card is-horizontal">
        <div class="card-image" style="width: 50%">
          <figure class="image">
            <img :src="dog.imgSrc" />
          </figure>
        </div>

        <div class="card-stacked">
          <div class="card-content">
            <div>
              <p class="title is-4">{{ dog.name }}</p>
              <p class="subtitle is-6">
                {{ dog.dogTypeID === 1 ? "French bulldog" : "Shiba Inu" }}
              </p>
            </div>

            <br />

            <div>
              Sex: {{ dog.dogSexID === 1 ? "Male" : "Female" }}

              <br />
              D.O.B: {{ new Date(dog.dob).toLocaleDateString() }}

              <br />
              Available from:
              {{ new Date(dog.availablityDate).toLocaleDateString() }}

              <br />
              Microchip: {{ dog.mcNumber }}

              <br />
              Pedigree: {{ dog.pedigree }}

              <br />
              Sold: {{ dog.sold }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="column is-full">
      <p class="subtitle">Copy Writing</p>
      {{ dog.copyWriting }}
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <!-- Upcoming appointments for this dog -->
    <!-- @todo Only show this is the dog is not sold yet? -->
    <!-- @todo Then show 1 more where the dog is sold, to see past appointments and cancelled appointments
      because some ppl book alr but someone else bought the dog instead -->
    <div class="column is-full">
      <p class="subtitle">Upcoming Appointments</p>

      <button @click="loadAppointments" class="button is-light is-success">
        Load Appointments
      </button>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <!-- Sold button will link to SoldDog view with the dog name prefilled -->
    <div class="column is-full">
      <router-link
        :to="{ name: 'sold-dog', query: { dogID } }"
        class="button is-light is-success is-fullwidth"
      >
        Sold
      </router-link>
    </div>
  </div>
</template>

<script>
/*
  The card layout is scaffolded using https://codepen.io/nedpals/pen/jKLBmJ
  The SCSS in the codepen is converted to css with https://jsonformatter.org/scss-to-css
*/

import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

export default {
  name: "Dog",

  props: ["dogID"],

  created() {
    // @todo Update this to mapState instead and trigger a vuex action to load dogs
    this.getDog();
  },

  data() {
    return {
      dog: undefined,
    };
  },

  methods: {
    async getDog() {
      const res = await oof
        .GET(`/admin/pet/${this.dogID}`)
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Error: \n${res.error}\n\nTry again?`) && this.getDogs();

      // @todo Tmp pic source added to demo UI
      // this.dog = res.dog;
      this.dog = {
        ...res.dog,
        imgSrc:
          "https://www.lovelyhomefenchbulldogs.com/wp-content/uploads/2020/10/e31d4008-3462-43d4-a45d-cf05aa3421d0.jpg",
      };
    },

    // Load all appointments for this specific dog
    async loadAppointments() {
      const res = await oof
        .GET(`/admin/appointments?dogID=${this.dogID}`)
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Error: \n${res.error}\n\nTry again?`) && this.getDogs();

      this.appointments = res.appointments;
    },
  },
};
</script>

<style scoped>
.card.is-horizontal {
  display: flex;
}
.card.is-horizontal .card-image {
  width: 100%;
  height: 100%;
}
.card.is-horizontal .card-stacked {
  flex-direction: column;
  flex: 1 1 auto;
  display: flex;
  position: relative;
}
.card.is-horizontal .card-stacked .card-content {
  flex-grow: 1;
}
</style>
