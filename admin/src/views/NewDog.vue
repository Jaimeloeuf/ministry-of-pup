<template>
  <div class="columns is-multiline is-centered" style="max-width: 30em">
    <div class="column is-full">
      <label>
        <b>Dog availablity date</b>

        <input
          class="input"
          type="date"
          :min="today"
          v-model="availablityDate"
        />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Date of Birth</b>

        <input class="input" type="date" :max="today" v-model="dob" />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Breed</b>
        <br />

        <div class="select is-fullwidth">
          <select v-on:change="updateDogTypeID($event)">
            <!-- Value must be id so that when parsing value in @change handler it can get id instead of the text -->
            <option
              v-for="dogType in dogTypes"
              :value="dogType.id"
              :key="dogType.id"
              :selected="dogType.id === dogTypeID"
            >
              {{ dogType.text }}
            </option>
          </select>
        </div>
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Sex</b>
        <br />

        <div class="select is-fullwidth">
          <select v-on:change="updateDogSexID($event)">
            <!-- Value must be id so that when parsing value in @change handler it can get id instead of the text -->
            <option
              v-for="dogSex in dogSexes"
              :value="dogSex.id"
              :key="dogSex.id"
              :selected="dogSex.id === dogSexID"
            >
              {{ dogSex.text }}
            </option>
          </select>
        </div>
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Name</b>

        <div class="field has-addons">
          <div class="control is-expanded">
            <input
              type="text"
              v-model="name"
              placeholder="E.g. Mochi"
              required
              class="input"
            />
          </div>
          <div class="control">
            <button class="button" @click="generateDogName">Generate</button>
          </div>
        </div>
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Microchip number</b>
        <br />
        *Use scanner

        <input
          type="number"
          v-model="mcNumber"
          pattern="[\s0-9]+"
          min="99999999999999"
          max="999999999999999"
          placeholder="E.g. 123456789012345"
          class="input"
        />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Copy Writing</b>

        <!-- @todo Make textarea grow automatically -->
        <textarea
          v-model="copyWriting"
          class="textarea"
          placeholder="Describe this dog!"
        />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <input type="checkbox" v-model="pedigree" />
        Pedigree
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>Cost of dog</b>
        <br />
        *How much did you pay for this dog / Inventory cost

        <input
          type="number"
          v-model="cost"
          pattern="[\s0-9]+"
          min="0"
          placeholder="E.g. 10000 for $10,000"
          class="input"
        />
      </label>
    </div>

    <div class="column is-full">
      <label>
        <b>MSRP</b>
        <br />
        *How much do you plan to sell this dog for?

        <!-- Needs to be more than the cost of dog -->
        <input
          type="number"
          v-model="msrp"
          pattern="[\s0-9]+"
          :min="cost"
          placeholder="E.g. 10000 for $10,000"
          class="input"
        />
      </label>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <button @click="newDog" class="button is-light is-fullwidth is-success">
        Add Dog
      </button>
    </div>

    <div class="column is-full">
      <button @click="reset" class="button is-light is-fullwidth is-danger">
        Reset form
      </button>
    </div>
  </div>
</template>

<script>
import todaysDate from "../utils/todaysDate.js";
import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

export default {
  name: "NewDog",

  data() {
    const today = todaysDate();

    return {
      today,
      availablityDate: today,
      dob: today,

      // Should this be a Int ID, or something like either "M" or "F"?
      dogSexID: 1,
      dogSexes: [
        { id: 1, text: "Male" },
        { id: 2, text: "Female" },
      ],

      name: undefined,
      copyWriting: undefined,
      mcNumber: undefined,
      pedigree: false,
      cost: undefined,
      msrp: undefined,

      // @todo Can be taken from DB if needed
      dogTypeID: 1,
      dogTypes: [
        { id: 1, text: "French bulldog" },
        { id: 2, text: "Shiba Inu" },
      ],
    };
  },

  methods: {
    updateDogTypeID(event) {
      // ID is int, but if set as value of option element, it will be auto converted into String, thus parseInt back to int before saving it
      // If not converted before saving, tripTypeID would become a string and UI will show as edited because "1" !== 1
      this.dogTypeID = parseInt(event.target.value);
    },

    updateDogSexID(event) {
      // ID is int, but if set as value of option element, it will be auto converted into String, thus parseInt back to int before saving it
      // If not converted before saving, tripTypeID would become a string and UI will show as edited because "1" !== 1
      this.dogSexID = parseInt(event.target.value);
    },

    async generateDogName() {
      // Only asynchronously load the package if user wants to generate a random name
      const dogNames = await import("dog-names");
      this.name =
        this.dogSexID === 1 ? dogNames.maleRandom() : dogNames.femaleRandom();
    },

    async newDog() {
      // @todo Validate all required input is entered

      const res = await oof
        .POST("/admin/pet/new")
        .header(await getAuthHeader())
        .data({
          availablityDate: this.availablityDate,
          dob: this.dob,
          dogSexID: this.dogSexID,
          name: this.name,
          copyWriting: this.copyWriting,
          mcNumber: this.mcNumber,
          pedigree: this.pedigree,
          dogTypeID: this.dogTypeID,
        })
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Error: \n${res.error}\n\nTry again?`) && this.newDog();

      alert("Dog added!");
      // res.dogID;

      // Reset the page once a new dog is added
      this.reset();
    },

    reset() {
      // Reset the data values to its original state by re-running the data method
      // https://github.com/vuejs/vue/issues/702#issuecomment-308991548
      // https://www.carlcassar.com/articles/reset-data-in-a-vue-component
      Object.assign(this.$data, this.$options.data());

      // Only use this if `this` is used in the data method
      // Object.assign(this.$data, this.$options.data.apply(this));
    },
  },
};
</script>
