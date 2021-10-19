<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="subtitle">See and manage all current unsold dogs</p>
    </div>

    <div class="column is-full" v-if="dogs.length === 0">
      <p class="subtitle is-3">No dogs available right now!</p>
    </div>

    <div class="column is-full" v-for="(dog, i) in dogs" :key="i">
      <!-- Display the card content in a router-link element to make the card's content section clickable -->
      <router-link
        :to="{ name: 'dog', params: { dogID: dog.id } }"
        class="card is-horizontal"
      >
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
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
/*
  The card layout is scaffolded using https://codepen.io/nedpals/pen/jKLBmJ
  The SCSS in the codepen is converted to css with https://jsonformatter.org/scss-to-css
*/

import { mapState } from "vuex";

export default {
  name: "AllDogs",

  created() {
    // Trigger the action to load all available dogs from API as user enters this view
    this.$store.dispatch("dog/getUnsoldDogs");
  },

  computed: mapState("dog", ["dogs"]),
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
