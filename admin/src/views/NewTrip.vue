<template>
  <div class="section has-text-left">
    <!-- Show full screen loader while waiting for id to be saved -->
    <loader v-if="loader" />

    <div v-else>
      <!-- Allow multiple line in desktop / landscape mode -->
      <div class="columns is-multiline">
        <div class="column">
          <label>
            <b>Key checkout time</b>

            <DatetimePicker v-model="keyCheckoutTime" />
          </label>
        </div>

        <div class="column">
          <label>
            <p><b>Driver IC</b>&nbsp;(change in settings)</p>

            <!-- Input style display, but disabled as users should only be able to set this in settings view -->
            <input disabled type="text" :value="ic" class="input" />
          </label>
        </div>

        <div class="column">
          <label>
            <b>Booking ID</b>

            <!-- Pattern matching version for a any number of digits and whitespaces -->
            <input
              type="number"
              pattern="[\s0-9]+"
              v-model="bookingID"
              placeholder="E.g. 1234"
              required
              class="input"
            />
          </label>
        </div>

        <div class="column">
          <label>
            <b>VRN</b>

            <!-- @todo Add pattern matching for License plate numbers-->
            <!-- @todo Should this have a fixed list? Or any name also valid? -->
            <!-- @todo Make this case insensitve -->
            <input
              type="text"
              v-model="vrn"
              placeholder="E.g. SBA1234A"
              required
              class="input"
            />
          </label>
        </div>

        <div class="column">
          <label>
            <b>Vehicle commander name</b>

            <input
              type="text"
              v-model="vehicleCommanderName"
              placeholder="E.g. John Doe"
              required
              class="input"
            />
          </label>
        </div>

        <div class="column">
          <label>
            <b>Number of passengers</b>
            <span style="font-size: 0.8em"> (excluding driver)</span>

            <!-- @todo Pattern match for integers bigger then 0-->
            <!-- @todo Dont pattern match white spaces -->
            <input
              type="number"
              pattern="[\s0-9]+"
              v-model="numOfPassengers"
              placeholder="E.g. 2"
              required
              class="input"
            />
          </label>
        </div>

        <div class="column">
          <label>
            <b>Purpose of trip</b>

            <!-- @todo Have a suggested list of common reasons like how it's done in BN report number -->
            <input
              type="text"
              v-model="tripPurpose"
              placeholder="E.g. Delivering supply"
              required
              class="input"
            />
          </label>
        </div>

        <!-- Odometer stuff, might move to its own component later on with scanning support -->

        <div class="column">
          <label>
            <b>Odometer: start</b>

            <!-- Pattern matching odometer value for a any number of digits and whitespaces -->
            <input
              type="number"
              pattern="[\s0-9]+"
              v-model="odometerStart"
              placeholder="E.g. 1000"
              required
              class="input"
            />
          </label>
        </div>

        <!-- @todo Ensure that odometer end is bigger then the start as it cannot be reset..? Esp for the same trip -->

        <div class="column">
          <label>
            <b>Remarks</b>

            <!-- @todo Might change to textarea to allow more input -->
            <input
              type="text"
              v-model="remarks"
              placeholder="E.g. Requested by XXX"
              required
              class="input"
            />
          </label>
        </div>

        <div class="column">
          <label>
            <b>Cash card value (w/o '$')</b>

            <!-- @todo Add pattern matching value for ints and floats -->
            <input
              type="number"
              v-model="cashCardValue"
              placeholder="E.g. 10.57 without the $ sign"
              required
              class="input"
            />
          </label>
        </div>

        <div class="column">
          <label>
            <b>Trip type</b>
            <br />

            <div class="select is-fullwidth">
              <!-- Use on change event listener for changes to the firestation ID -->
              <select v-on:change="updateTripTypeID($event)">
                <!-- Value must be firestation's id so that when parsing value in @change handler it can get id instead of station name -->
                <option
                  v-for="tripType in tripTypes"
                  :value="tripType.id"
                  :key="tripType.id"
                  :selected="tripType.id === tripTypeID"
                >
                  {{ tripType.text }}
                </option>
              </select>
            </div>
          </label>
        </div>

        <div class="column">
          <label>
            <input type="checkbox" v-model="multipleStops" />
            Multiple stops?
          </label>
        </div>

        <!-- @todo Bind Departure location to the variable with v-model -->
        <div class="column">
          <label>
            <!-- @todo Make refresh into a button on the right side on same level and clickable -->
            <b>Departure location</b>
            <span
              v-if="departureLocation"
              style="margin-left: 1em; font-size: 0.8em"
            >
              refresh
            </span>
            <br />

            <button
              class="button is-light is-fullwidth is-success"
              @click="departureLocation = true"
            >
              Use current location
            </button>
          </label>
        </div>

        <!-- @todo No arrival locations instead allow them to add as many stops as possible -->
        <!-- Or when they reach, then they click, reach, then read current location -->

        <hr />

        <!-- Have a create one too, then start later. -->
        <!-- because the keys checkout time is diff from start trip -->
        <div class="column">
          <button
            @click="createTrip"
            class="button is-light is-fullwidth is-success"
          >
            Create Trip
          </button>
        </div>

        <div class="column">
          <button
            @click="createTrip"
            class="button is-light is-fullwidth is-success"
          >
            Create & Start Trip
          </button>
        </div>

        <div class="column">
          <router-link
            :to="{ name: 'home' }"
            class="button is-light is-fullwidth"
          >
            cancel
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";

import loader from "../components/Loader";
import DatetimePicker from "../components/DatetimePicker";

export default {
  name: "NewTrip",

  components: { loader, DatetimePicker },

  created() {
    if (this.$store.state.user.user.ic === undefined) {
      alert("Set your IC in settings first before creating a new trip");

      // Replace current route with settings view, so that when user goes back, it will not come back to this view again
      this.$router.replace({ name: "settings" });
    }
  },

  data() {
    return {
      loader: false,

      // Load ic number from store
      ic: this.$store.state.user.user.ic,

      // @todo Can be taken from DB if needed
      tripTypes: [
        { id: 1, text: "Round trip" },
        { id: 2, text: "1 Way" },
      ],

      /* Below are the form data */

      // Undefined instead of default values of the input type, so users do not need to delete the value before entering their input
      // Undefined default values makes the input element show their placeholder value if any
      keyCheckoutTime: undefined,
      bookingID: undefined,
      vrn: undefined,
      vehicleCommanderName: undefined,
      numOfPassengers: undefined,
      tripPurpose: undefined,
      odometerStart: undefined,
      remarks: undefined,
      cashCardValue: undefined,
      tripTypeID: 1,
      multipleStops: false,
      departureLocation: undefined,
    };
  },

  methods: {
    updateTripTypeID(event) {
      // ID is int, but if set as value of option element, it will be auto converted into String, thus parseInt back to int before saving it
      // If not converted before saving, tripTypeID would become a string and UI will show as edited because "1" !== 1
      this.tripTypeID = parseInt(event.target.value);
    },

    // Async function to create a new trip, wrapping over the action in vuex's trip module
    async createTrip() {
      // Show loader before dispatching asynchronous vuex action
      this.loader = true;

      try {
        // Get back trip id and show it to the user
        await this.$store.dispatch("trip/newTrip", {
          // Get the current user's email
          // @todo Slice away the "@scdf.gov.sg"
          user: firebase.auth().currentUser.email,

          // All the form data
          // @todo Should have a easier way to do this, seems prone to error by missing something out
          keyCheckoutTime: this.keyCheckoutTime,
          ic: this.ic,
          bookingID: this.bookingID,
          vrn: this.vrn,
          vehicleCommanderName: this.vehicleCommanderName,
          numOfPassengers: this.numOfPassengers,
          tripPurpose: this.tripPurpose,
          odometerStart: this.odometerStart,
          remarks: this.remarks,
          cashCardValue: this.cashCardValue,
          tripTypeID: this.tripTypeID,
          multipleStops: this.multipleStops,
          departureLocation: this.departureLocation,
        });

        alert("Trip created!");

        // @todo If retry, will this "break out" of the recursive loop??
        // Redirect back home once done
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error(error);

        // Display error and ask user if action should be retried
        // Call method recursively if user wants to retry,
        // await recursive call to ensure it completes before doing anything else for the earlier calls
        if (confirm(`Error:\n${error.message}\nRetry?`))
          await this.createTrip();
      }

      // Always ensure full screen loader is removed
      this.loader = false;
    },
  },
};
</script>
