<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="title">Sold Dog</p>
    </div>

    <div class="column is-full pb-0">
      <b>Customer from</b>
    </div>

    <div class="column is-full">
      <div class="tabs is-toggle is-centered is-fullwidth">
        <ul>
          <li :class="{ 'is-active': show === 'a' }">
            <a @click="show = 'a'">Appointment</a>
          </li>
          <li :class="{ 'is-active': show === 'w' }">
            <a @click="show = 'w'">Walk In</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="column is-full" v-if="show === 'a'">
      <b>Sold to</b>

      <!-- Dropdown showing list of names of all users who have a appointment today -->
      <div class="select is-fullwidth">
        <select v-on:change="(event) => (userID = event.target.value)">
          <option hidden disabled selected value>Please select a user</option>

          <!-- Value must be id so that when parsing value in @change handler it can get id instead of the text -->
          <!-- v-for="user in users" -->
          <option
            v-for="user in [{ id: 1, text: 'test' }]"
            :value="user.id"
            :key="user.id"
            :selected="user.id === userID"
          >
            {{ user.text }}
          </option>
        </select>
      </div>
    </div>

    <div class="column is-full" v-if="show === 'w'">
      <div class="columns" v-if="!loggedIn">
        <div class="column is-half">
          <label>
            <b>Create Account</b>
            <br />
            *User MUST HAVE an account first

            <!-- If user clicks to create account using this link, it will redirect back here once account created -->
            <router-link
              :to="{
                name: 'user-create',
                query: { redirect: { name: 'sold-dog' } },
              }"
              class="button is-light is-success is-fullwidth"
            >
              Create Account
            </router-link>
          </label>
        </div>

        <div class="column is-half">
          <label>
            <b>Phone Number</b>
            <br />
            *Enter number <b>without</b> the +65 prefix

            <div class="field has-addons">
              <div class="control is-expanded">
                <input
                  v-autofocus
                  type="number"
                  pattern="[\s0-9]+"
                  min="0"
                  v-model="user.number"
                  placeholder="E.g. 92345678"
                  class="input"
                  @keypress.enter="login"
                />
              </div>
              <div class="control">
                <button class="button is-success" @click="login">Login</button>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Show user details once logged in for user to review, and to go edit details if needed -->
      <div v-else class="column is-full box">
        <div class="columns is-multiline is-vcentered">
          <div class="column is-half">
            <b>First Name</b>
            <br />

            {{ user.fname }}
          </div>

          <div class="column is-half">
            <b>Last Name</b>
            <br />

            {{ user.lname }}
          </div>

          <div class="column is-half">
            <b>Phone Number</b>
            *Without the +65 prefix
            <br />

            {{ user.number }}
          </div>

          <div class="column is-half">
            <b>Email</b>
            *Sales receipt will be sent here
            <br />

            {{ user.email }}
          </div>

          <div class="column is-full">
            <b>Address</b>
            *Full Address including any unit number
            <br />

            <span v-if="user.address">{{ user.address }}</span>
            <i v-else>nil</i>
          </div>

          <div class="column">
            <b>Postal Code</b>
            *Format is 6 digits only
            <br />

            <span v-if="user.postalCode">{{ user.postalCode }}</span>
            <i v-else>nil</i>
          </div>

          <div class="column is-narrow">
            <button class="button is-light is-danger" @click="loggedIn = false">
              logout
            </button>
          </div>

          <div class="column is-narrow">
            <router-link
              :to="{ name: 'user-details', query: { userID: user.id } }"
              class="button is-light is-warning"
            >
              Update Details
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <label>
        <b>Which dog?</b>
        <br />

        <!-- @todo Show the card like in Dog.vue -->
        <div v-if="dog">
          <p class="subtitle is-3">{{ dog.name }}</p>
        </div>

        <div v-else class="select is-fullwidth">
          <select>
            <option v-for="(dog, i) in dogs" :key="i">{{ dog.name }}</option>
          </select>
        </div>
      </label>
    </div>

    <!-- Only show sale price input after dog object has been loaded/selected  -->
    <div class="column is-full" v-if="dog && dog.msrp">
      <label>
        <!-- 
          Show MSRP without auto fill to force admin to type it out again
          Then if differs from MSRP, warn user before allowing them to proceed
          This is to prevent user from just clicking sold without updating the price if it has change after negotiation
        -->
        <b>Final sale price</b> (MSRP is {{ formatCurrency(dog.msrp) }})
        <br />
        <p v-if="salePrice * 100 < dog.msrp">*Less than MSRP</p>
        <p v-if="salePrice * 100 > dog.msrp">*More than MSRP</p>

        <input
          type="number"
          v-model="salePrice"
          pattern="[\s0-9]+"
          placeholder="E.g. 10000 for $10,000 where unit is dollars"
          class="input"
          :class="{
            'is-danger': salePrice * 100 < dog.msrp,
            'is-warning': salePrice * 100 > dog.msrp,
          }"
        />
      </label>
    </div>

    <div class="column">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <!-- @todo Change the buttons to, sell (show purchase agreement then sign), payment (click to generate and show QR code), sold (click to finalise everything once payment received and sends invoice to customer) -->
    <div class="column is-full">
      <button @click="sold" class="button is-light is-fullwidth is-success">
        Sold
      </button>
    </div>

    <!-- @todo Tmp added a click to close for the entire modal -->
    <!-- Might want to better think about the UX and what if they accidentally click somewhere, it shouldnt close, and how to reopen? -->
    <!-- Maybe only click to close via X, and click to close via complete method call through a button -->
    <div
      class="modal"
      :class="{ 'is-active': showModal }"
      @click="showModal = false"
    >
      <!-- Modal can be closed by clicking any part of the modal background -->
      <div class="modal-background" @click="showModal = false"></div>

      <!-- The whole modal content can be clicked to close the modal -->
      <div class="modal-content" @click="showModal = false">
        <span class="image is-square">
          <img :src="imageDataURI" />
        </span>

        <!-- Might have a complete button or something depending on the UX flow -->
        <!--
          <button
            class="button is-fullwidth is-success is-inverted"
            aria-label="share"
            style="border-radius: 0px"
          >
            Complete
          </button>
        -->
      </div>

      <!-- Modal can be closed by clicking the top right X -->
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="showModal = false"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

import formatCurrency from "../utils/formatCurrency.js";

export default {
  name: "SoldDog",

  props: ["dogID"],

  computed: {
    // If a dogID is passed in as a URL query
    // @todo Load the dog using this.dogID after admin choose from the dropdown
    dog() {
      return this.dogID ? this.$store.state.dog?.dogs[this.dogID] : undefined;
      // return this.dogID
      //   ? this.$store.state.dog.dogs[this.dogID]
      //   : { msrp: 1000000 };
    },

    // Need to trigger action to load dogs from API first
    ...mapState("dog", ["dogs"]),
    ...mapGetters("appointment", ["appointments"]),

    users() {
      // By default the 'appointments' getters is already sorted by appointment time in ascending order
      // Thus the first one, which will be the default user selected in select element will be the 'current' appointment
      // Map all appointments into an object to use with the select element
      return this.appointments.map((appt) => ({
        id: appt.user,
        text: `${appt.lname} ${appt.fname}`,
      }));
    },
  },

  data() {
    return {
      show: undefined,
      loggedIn: false,

      // Will be initialized in the created() hook as this value is initialized with the computed 'users' value
      userID: undefined,

      user: {
        fname: undefined,
        lname: undefined,
        number: undefined,
        email: undefined,
        address: undefined,
        postalCode: undefined,

        // Exists but not exposed to user to edit
        id: undefined,
      },

      salePrice: undefined,

      /* Paynow QR code values */
      showModal: false,
      imageDataURI: undefined,
    };
  },

  created() {
    this.userID = this.users[0]?.id;

    // Call action to ensure that all the dogs are loaded
  },

  methods: {
    formatCurrency,

    async login(userID) {
      // TMP setting this to only allow login using phone number
      userID = undefined;

      if (!this.user.number) return alert("Missing phone number");

      this.loading = true;

      // Call different API depending on whether a userID is passed in
      const res = await oof
        .GET(userID ? `/user/${userID}` : `/user/number/${this.user.number}`)
        .header(await getAuthHeader())
        .runJSON();

      this.loading = false;

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Failed to login\nTry again?`) && this.login();

      this.user = res.user;
      this.userID = res.user.id;
      this.loggedIn = true;
    },

    async showPaynowQR() {
      const { default: PaynowQR } = await import("paynowqr");

      // The QR Code should only be valid until tmr
      // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds = 86400000 milliseconds
      const d = new Date(new Date().getTime() + 86400000);
      const month = d.getMonth() + 1;
      const pmonth = month > 9 ? month : `0${month}`; // Month with 0 padding
      const date = d.getDate();
      const pdate = date > 9 ? date : `0${date}`; // Date with 0 padding
      const expiryDate = `${d.getFullYear()}${pmonth}${pdate}`;

      //Create a PaynowQR object
      const paynowQRCode = new PaynowQR({
        // Required: UEN of company, hard coded in as it will not be changed
        uen: "T17LL2360H",

        // Specify amount of to pay, this is just the amount keyed in
        amount: this.salePrice,

        // Set an expiry date for the Paynow QR code (YYYYMMDD, e.g. "20211231")
        // If omitted, defaults to 5 years from current time.
        expiry: expiryDate,

        // @todo Call and API to generate a invoice reference number to track later (possibly have the paynow bank app on the ipad)
        // Reference number for Paynow Transaction. Useful if you need to track payments for recouncilation.
        refNumber: "MOP-INV-1001",

        // company: "ACME Pte Ltd.", // Company name to embed in the QR code. Optional.
      });

      const QRCode = await import("qrcode");

      // Generate the QR code image data URL and set onto component data value
      this.imageDataURI = await QRCode.toDataURL(
        // Generate UTF-8 string from the qrcode to generate the QR code data URL for the image tag
        paynowQRCode.output(),

        // Use high error resistance rate of ~ 30%
        { errorCorrectionLevel: "H" }
      );

      // Open up modal to show the QR Code image
      this.showModal = true;
    },

    async sold() {
      //
      // await this.showPaynowQR();

      this.$router.push({
        name: "payment",
        params: {
          redirect: { name: "sold-dog" },
        },
      });

      // Convert to cents before sending back to API
      this.salePrice * 100;
    },
  },
};
</script>
