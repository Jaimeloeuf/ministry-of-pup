<template>
  <div class="columns is-multiline is-centered" style="max-width: 30em">
    <!-- @todo
          Let user choose which dog was sold 
          Maybe they can see all dogs, then they select one?
      -->
    <div class="column is-full">
      <label>
        <b>Which dog?</b>
        <br />

        <div class="select is-fullwidth">
          <select>
            <option>French bulldog 1</option>
            <option>Shiba Inu 1</option>
            <option>French bulldog 2</option>
            <option>Shiba Inu 2</option>
            <option>French bulldog 3</option>
            <option>Shiba Inu 3</option>
          </select>
        </div>
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Sold to</b>
        <br />

        <div class="select is-fullwidth">
          <select v-on:change="updateCustomerID($event)">
            <!-- Value must be id so that when parsing value in @change handler it can get id instead of the text -->
            <option
              v-for="customer in customers"
              :value="customer.id"
              :key="customer.id"
              :selected="customer.id === customerID"
            >
              {{ customer.text }}
            </option>
          </select>
        </div>
      </label>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <button @click="sold" class="button is-light is-fullwidth is-success">
        Sold
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SoldDog",

  data() {
    return {
      customerID: 1,

      // @todo Load from DB
      customers: [
        { id: 1, text: "Zhang Rui" },
        { id: 2, text: "Cloris" },
      ],
    };
  },

  methods: {
    updateCustomerID(event) {
      // ID is int, but if set as value of option element, it will be auto converted into String, thus parseInt back to int before saving it
      // If not converted before saving, tripTypeID would become a string and UI will show as edited because "1" !== 1
      this.customerID = parseInt(event.target.value);
    },

    async sold() {
      //
    },
  },
};
</script>
