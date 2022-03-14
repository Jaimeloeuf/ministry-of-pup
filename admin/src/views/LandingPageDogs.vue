<template>
  <div class="columns is-multiline is-vcentered" style="max-width: 50em">
    <div class="column">
      <p class="subtitle">See and manage dogs shown on the landing page</p>
    </div>

    <div class="column is-narrow">
      <button class="button is-light is-success" @click="getDogs">
        Refresh
      </button>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div v-if="loading" class="column is-full">
      <p class="subtitle">... Loading ...</p>
    </div>

    <!-- If not loading from API and dogs array is still empty -->
    <div v-else-if="dogs.length === 0" class="column is-full">
      <p class="subtitle">No dogs available right now!</p>
    </div>

    <!-- If loading complete and there are available dogs -->
    <div v-else class="column is-full">
      <!-- <p>Sort by: Newest dog first</p>
      <br /> -->

      <div class="column is-full" v-for="(dog, i) in dogs" :key="i">
        <div class="card is-horizontal">
          <div class="card-image" style="width: 50%">
            <figure class="image">
              <img :src="dog.imgSrc[0]" />
            </figure>
          </div>

          <div class="card-stacked">
            <div class="card-content">
              <div>
                <p class="title is-4">{{ dog.name }}</p>
                <p class="subtitle is-6">
                  {{ dog.breed }}
                </p>
              </div>
              <br />

              <div>
                Sex: {{ dog.sex === "m" ? "Male" : "Female" }}
                <br />

                D.O.B: {{ new Date(dog.dob).toLocaleDateString() }}
                <br />

                Available from:
                {{ new Date(dog.availablityDate).toLocaleDateString() }}
                <br />

                Microchip: {{ dog.mc }}
              </div>
              <br />

              <div @click="toggle(dog.id)">
                <button
                  class="button is-light is-danger is-fullwidth"
                  v-if="dog.show"
                >
                  Click to Hide
                </button>
                <button class="button is-light is-success is-fullwidth" v-else>
                  Click to Show
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
  The card layout is scaffolded using https://codepen.io/nedpals/pen/jKLBmJ
  The SCSS in the codepen is converted to css with https://jsonformatter.org/scss-to-css
*/

import { mapGetters } from "vuex";

import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

export default {
  name: "LandingPageDogs",

  created() {
    // Trigger action to load all available dogs and method to get dogs shown on landing page
    this.getDogs();
  },

  computed: mapGetters("dog", ["dogs"]),

  data() {
    return { loading: true };
  },

  methods: {
    async getDogs() {
      // Show loader
      this.loading = true;

      // Trigger the action to load all available dogs from API as user enters this view
      this.$store.dispatch("dog/getUnsoldDogs");

      // Stop showing loader
      this.loading = false;
    },

    async toggle(dogID) {
      // Update the local view first optimistically
      this.$store.commit("dog/toggleShowDog", dogID);

      const res = await oof
        .POST("/admin/pet/landingpage/update")
        .header(await getAuthHeader())
        .data({ dogID, show: this.$store.state.dog.dogs[dogID].show })
        .runJSON();

      if (!res.ok) return alert("Failed to update landing page dog status");
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
