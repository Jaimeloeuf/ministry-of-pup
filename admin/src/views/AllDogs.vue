<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="subtitle">See and manage all current unsold dogs</p>
    </div>

    <div class="column is-full" v-for="(dog, i) in dogs" :key="i">
      <!-- Display the card content in a router-link element to make the card's content section clickable -->
      <router-link
        :to="{ name: 'dog', params: { id: dog.id } }"
        class="card is-horizontal"
      >
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
              Breed:
              {{ dog.dogTypeID === 1 ? "French bulldog" : "Shiba Inu" }}

              <br />
              Sex: {{ dog.dogSexID === 1 ? "Male" : "Female" }}

              <br />
              D.O.B: {{ new Date(dog.dob * 1000).toLocaleDateString() }}

              <br />
              Available from:
              {{ new Date(dog.availablityDate * 1000).toLocaleDateString() }}

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

export default {
  name: "AllDogs",

  data() {
    return {
      // Scaffolding data to test the UI
      dogs: [
        {
          availablityDate: 1634227200,
          dob: 1626278400,
          dogSexID: 1,
          name: "Mochi",
          dogTypeID: 1,
          mcNumber: 123456789012345,
          imgSrc:
            "https://www.lovelyhomefenchbulldogs.com/wp-content/uploads/2020/10/e31d4008-3462-43d4-a45d-cf05aa3421d0.jpg",
        },
        {
          availablityDate: 1634227200,
          dob: 1626278400,
          dogSexID: 2,
          name: "Mochiroo",
          dogTypeID: 1,
          mcNumber: 123456789012346,
          imgSrc:
            "https://cdn.pixabay.com/photo/2019/12/05/14/12/french-bulldog-4675260_1280.jpg",
        },
        {
          availablityDate: 1634227200,
          dob: 1626278400,
          dogSexID: 1,
          name: "Frenchiee",
          dogTypeID: 1,
          mcNumber: 123456789012347,
          imgSrc:
            "https://cloudfront-us-east-1.images.arcpublishing.com/gray/K753NFVRZ5AW3HLIPFT3YHLXO4.jpg",
        },
      ],
    };
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
