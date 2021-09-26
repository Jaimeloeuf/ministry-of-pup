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

        <input
          type="text"
          v-model="name"
          placeholder="E.g. Mochi"
          required
          class="input"
        />
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

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <button
        @click="addNewDog"
        class="button is-light is-fullwidth is-success"
      >
        Add Dog
      </button>
    </div>

    <div class="column is-full">
      <router-link :to="{ name: 'home' }" class="button is-light is-fullwidth">
        cancel
      </router-link>
    </div>
  </div>
</template>

<script>
import todaysDate from "../utils/todaysDate.js";

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

    async addNewDog() {
      // Validate all required input is entered
    },
  },
};
</script>
