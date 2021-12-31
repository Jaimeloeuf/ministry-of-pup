<template>
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
          <br />

          Pedigree: {{ dog.pedigree }}
          <br />

          HDB Approved: {{ dog.hdbApproved }}
          <br />

          Color: {{ dog.color }}
          <br />

          Country of Origin: {{ dog.originCountry }}
          <br />

          Cost: {{ formatCurrency(dog.cost) }}
          <br />

          SRP: {{ formatCurrency(dog.srp) }}
          <br />

          Sold: {{ dog.sold }}
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
import formatCurrency from "../utils/formatCurrency.js";

export default {
  name: "DogCard",
  props: ["dog"],
  methods: { formatCurrency },
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
