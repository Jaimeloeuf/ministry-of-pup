<template>
  <div class="section center">
    <!-- Show full screen loader while waiting for id to be saved -->
    <loader v-if="loader" />

    <div v-else>
      <!-- Allow multiple line in desktop / landscape mode -->
      <div class="columns is-multiline">
        <!-- is-full to fill up column space when in desktop / landscape mode -->
        <div class="column is-full">
          <label>
            <b>Name</b>

            <!-- Pattern matching version for a any number of digits and whitespaces -->
            <input
              type="text"
              v-model="name"
              placeholder="E.g. JJ"
              required
              class="input"
              style="width: 100%"
            />
          </label>
        </div>

        <!-- is-full to fill up column space when in desktop / landscape mode -->
        <div class="column is-full">
          <label>
            <b>Driver IC</b>

            <!-- @todo Should this be set once only? Once set cannot change...?? If need change, contact admins -->
            <div class="field has-addons">
              <div class="control is-expanded">
                <!-- @todo Add pattern matching for IC numbers when the user manually enters it -->
                <input
                  type="text"
                  v-model="ic"
                  placeholder="E.g. TXXXX123A"
                  required
                  class="input"
                />
              </div>
              <div class="control">
                <button class="button" @click="scanBarcode = true">scan</button>
              </div>
            </div>
          </label>
        </div>

        <!-- is-full to fill up column space when in desktop / landscape mode -->
        <div class="column is-full">
          <label>
            <b>License Type</b>
            <br />

            <div class="select is-fullwidth">
              <!-- ID is int, but when set as value of option element it is auto converted into String, thus parse as int before saving -->
              <!-- If not converted before saving, licenseTypeID would become a string and UI will show as edited because "1" !== 1 -->
              <select
                v-on:change="
                  ($event) => (licenseTypeID = parseInt($event.target.value))
                "
              >
                <!-- Value must be firestation's id so that when parsing value in @change handler it can get id instead of station name -->
                <option
                  v-for="lt in licenseTypes"
                  :value="lt.id"
                  :key="lt.id"
                  :selected="lt.id === licenseTypeID"
                >
                  {{ lt.text }}
                </option>
              </select>
            </div>
          </label>
        </div>

        <!-- is-full to fill up column space when in desktop / landscape mode -->
        <div class="column is-full">
          <label>
            <b>Firestation</b>
            <br />

            <div class="select is-fullwidth">
              <!-- ID is int, but when set as value of option element it is auto converted into String, thus parse as int before saving -->
              <!-- If not converted before saving, firestationID would become a string and UI will show as edited because "1" !== 1 -->
              <select
                v-on:change="
                  ($event) => (firestationID = parseInt($event.target.value))
                "
              >
                <!-- Value must be firestation's id so that when parsing value in @change handler it can get id instead of station name -->
                <option
                  v-for="fs in firestations"
                  :value="fs.id"
                  :key="fs.id"
                  :selected="fs.id === firestationID"
                >
                  {{ fs.name }}
                </option>
              </select>
            </div>
          </label>
        </div>

        <div class="column">
          <button
            @click="getHelp"
            class="button is-light is-fullwidth is-success"
          >
            Get help
          </button>
        </div>
      </div>

      <div class="columns is-mobile">
        <div class="column">
          <router-link
            :to="{ name: 'home' }"
            class="button is-light is-fullwidth"
          >
            home
          </router-link>
        </div>

        <!-- Button disabled if values unedited, and enabled in green color when edited and not yet saved -->
        <div class="column">
          <button
            :disabled="unedited"
            class="button is-fullwidth"
            :class="{ 'is-light': unedited, 'is-success': !unedited }"
            @click="saveSettings"
          >
            save
          </button>
        </div>
      </div>

      <version />
    </div>
  </div>
</template>

<script>
import loader from "../components/Loader";
import version from "../components/Version";

import { mapState } from "vuex";

export default {
  name: "settings",

  components: { loader, version },

  data() {
    // Get reference to user state object from store
    const user = this.$store.state.user.user;

    return {
      loader: false,
      scanBarcode: false,

      // @todo Load this from DB and cache in vuex store
      licenseTypes: [
        { id: 1, text: "Class 3" },
        { id: 2, text: "Class 3A" },
        { id: 3, text: "Class 3C" },
        { id: 4, text: "Class 3CA" },
        { id: 5, text: "Class 4" },
        { id: 6, text: "Class 5" },
      ],

      // @todo Load this from DB and cache in vuex store
      firestations: [
        { id: 1, name: "Paya lebar" },
        { id: 2, name: "Ang Mo Kio" },
        { id: 3, name: "Changi" },
        { id: 4, name: "Tampines" },
      ],

      // Spread all user fields into data object, to have a copy of it as the default values,
      // Users would be able to edit this via v-model bindings, without affecting the actual values in store
      ...user,
    };
  },

  computed: {
    // Bind vuex's user module's user state object into this component to check if user edited any settings
    ...mapState("user", ["user"]),

    // Checks for modified inputs by seeing if anything is different from the vales on the store's user object
    unedited() {
      return (
        this.user.name === this.name &&
        this.user.ic === this.ic &&
        this.user.licenseTypeID === this.licenseTypeID &&
        this.user.firestationID === this.firestationID
      );
    },
  },

  methods: {
    // Async function to get help, wrapping over the get help action in vuex's user module
    async getHelp() {
      // Show loader before dispatching asynchronous vuex action
      this.loader = true;

      try {
        await this.$store.dispatch("user/getHelp");
        alert("Admins will contact you via your SCDF email shortly.");
      } catch (error) {
        console.error(error);

        // Display error and ask user if action should be retried
        // Call method recursively if user wants to retry,
        // await recursive call to ensure it completes before doing anything else for the earlier calls
        if (confirm(`Error:\n${error.message}\nRetry?`)) await this.getHelp();
      }

      // Always ensure full screen loader is removed
      this.loader = false;
    },
  },
};
</script>
