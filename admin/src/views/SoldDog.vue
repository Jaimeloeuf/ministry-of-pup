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

        <!-- @todo Show the dog picture too? -->
        <div v-if="dog">
          <p class="subtitle is-3">{{ dog.name }}</p>
        </div>

        <!-- @todo Load the dogs from store -->
        <!-- <div v-else class="select is-fullwidth"> -->
        <div class="select is-fullwidth">
          <select>
            <option v-for="(dog, i) in dogs" :key="i">{{ dog.name }}</option>
          </select>
        </div>
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Sold to</b>
        <br />

        <div class="select is-fullwidth">
          <select v-on:change="updateUserID($event)">
            <!-- Value must be id so that when parsing value in @change handler it can get id instead of the text -->
            <option
              v-for="user in users"
              :value="user.id"
              :key="user.id"
              :selected="user.id === userID"
            >
              {{ user.text }}
            </option>
          </select>
        </div>
      </label>
    </div>

    <!-- 
      Show MSRP without auto fill to force admin to type it out again
      Then if differs from MSRP, warn user before allowing them to proceed
      This is to prevent user from just clicking sold without updating the price if it has change after negotiation
    -->
    <div class="column is-full">
      <label>
        <b>Final sale price</b> (MSRP is ${{ dog.msrp }})
        <br />
        <p v-if="salePrice < dog.msrp">*Less than MSRP</p>
        <p v-if="salePrice > dog.msrp">*More than MSRP</p>

        <input
          type="number"
          v-model="salePrice"
          pattern="[\s0-9]+"
          placeholder="E.g. 10000 for $10,000"
          class="input"
          :class="{
            'is-danger': salePrice < dog.msrp,
            'is-warning': salePrice > dog.msrp,
          }"
        />
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

    <!-- @todo Address input form, is there a way that i can validate the address using google or smth? -->
    <div class="column is-full">
      <p class="subtitle">Address</p>
    </div>

    <div class="column is-full">
      <label>
        <b>Address</b>

        <input
          type="number"
          v-model="salePrice"
          pattern="[\s0-9]+"
          placeholder="E.g. 10000 for $10,000"
          class="input"
        />
      </label>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SoldDog",

  props: ["dogID"],

  computed: {
    // If a dogID is passed in as a URL query
    // @todo Load the dog using this.dogID after admin choose from the dropdown
    dog() {
      if (this.dogID) return this.$store.getters["dog/dog"](this.dogID);
      else return { msrp: 10000 };
    },

    ...mapState("dog", ["dogs"]),
  },

  data() {
    return {
      userID: 1,

      // @todo Load from DB
      users: [
        { id: 1, text: "Zhang Rui" },
        { id: 2, text: "Cloris" },
      ],

      salePrice: undefined,
    };
  },

  methods: {
    updateUserID(event) {
      this.userID = event.target.value;
    },

    async sold() {
      //
    },
  },
};
</script>
