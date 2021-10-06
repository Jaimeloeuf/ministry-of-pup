<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="subtitle">See and manage all current unsold dogs</p>
    </div>

    <div class="column is-full" v-for="(dog, i) in dogs" :key="i">
      <div class="card px-4">
        <!-- Display the card content in a router-link element to make the card's content section clickable -->
        <router-link
          :to="{ name: 'dog', params: { id: dog.id } }"
          class="card-content content"
        >
          <p class="subtitle is-4">{{ dog.name }}</p>

          <p class="subtitle mb-1">
            Breed: {{ dog.dogTypeID === 1 ? "French bulldog" : "Shiba Inu" }}
          </p>
          <p class="subtitle mb-1">
            Sex: {{ dog.dogSexID === 1 ? "Male" : "Female" }}
          </p>
          <p class="subtitle mb-1">
            D.O.B: {{ new Date(dog.dob * 1000).toLocaleDateString() }}
          </p>
          <p class="subtitle mb-1">
            Available from:
            {{ new Date(dog.availablityDate * 1000).toLocaleDateString() }}
          </p>
          <p class="subtitle">Microchip: {{ dog.mcNumber }}</p>
        </router-link>

        <!-- @todo Add a single picture on the right here to identify the dog -->
      </div>
    </div>
  </div>
</template>

<script>
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
        },
        {
          availablityDate: 1634227200,
          dob: 1626278400,
          dogSexID: 2,
          name: "Mochiroo",
          dogTypeID: 1,
          mcNumber: 123456789012346,
        },
        {
          availablityDate: 1634227200,
          dob: 1626278400,
          dogSexID: 1,
          name: "Frenchiee",
          dogTypeID: 1,
          mcNumber: 123456789012347,
        },
      ],
    };
  },
};
</script>
