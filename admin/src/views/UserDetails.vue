<template>
  <div
    class="columns is-multiline is-centered is-vcentered"
    style="max-width: 50em"
  >
    <div class="column">
      <p class="subtitle">View / Update User Account</p>
    </div>

    <div class="column is-narrow">
      <button class="button is-light is-success" @click="showQR">
        Show QR link
      </button>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full" v-if="!loggedIn">
      <label>
        <b>Phone Number</b>
        <br />
        *Enter number <b>without</b> the +65 prefix

        <!--
          Login function is binded here with login() instead of just function name
          Because login function expects a userID or undefined as the first parameter,
          this is to allow the function to be reused by both created hook and event handler here.
          
          The problem is that for event handlers, the first parameter passed automatically to
          the function is the event object, which is not what we want, as the login function
          will attempt to treat the event object as the userID after stringifying it.
          
          The solution to this is to simply ensure that the login function is called without any
          parameters over here by defining the call semantics directly instead of leaving it to vue.
        -->
        <div class="field has-addons">
          <div class="control is-expanded">
            <input
              v-autofocus
              type="number"
              pattern="[\s0-9]+"
              min="0"
              v-model="number"
              placeholder="E.g. 92345678"
              class="input"
              @keypress.enter="login()"
            />
          </div>
          <div class="control">
            <button class="button is-success" @click="login()">Login</button>
          </div>
        </div>
      </label>
    </div>

    <div class="column is-full" v-else>
      <div class="columns is-multiline is-centered">
        <div class="column is-full">
          <div class="columns is-multiline is-vcentered">
            <div class="column is-half">
              <label>
                <b>First Name</b>

                <input
                  type="text"
                  v-model="user.fname"
                  placeholder="E.g. Cloris"
                  class="input"
                />
              </label>
            </div>

            <div class="column is-half">
              <label>
                <b>Last Name</b>

                <input
                  type="text"
                  v-model="user.lname"
                  placeholder="E.g. Liu"
                  class="input"
                />
              </label>
            </div>

            <div class="column is-half">
              <label>
                <b>Phone Number</b>
                <br />
                *Enter number <b>without</b> the +65 prefix

                <input
                  type="number"
                  pattern="[\s0-9]+"
                  min="0"
                  v-model="user.number"
                  placeholder="E.g. 92345678"
                  class="input"
                />
              </label>
            </div>

            <div class="column is-half">
              <label>
                <b>Email</b>
                <br />
                *Sales receipt will be sent here

                <input
                  type="text"
                  v-model="user.email"
                  placeholder="E.g. johnsmith@gmail.com"
                  class="input"
                />
              </label>
            </div>

            <div class="column is-full">
              <label>
                <b>Address</b>
                <br />
                *Full Address including unit number if any

                <textarea
                  v-model="user.address"
                  class="textarea"
                  placeholder="E.g. BLK 123 Tampines Street 7, #06-23"
                />
              </label>
            </div>

            <div class="column is-full">
              <label>
                <b>Postal Code</b>
                <br />
                *Format is 6 digits only

                <input
                  type="number"
                  pattern="[\s0-9]+"
                  min="0"
                  v-model="user.postalCode"
                  placeholder="E.g. 169359"
                  class="input"
                />
              </label>
            </div>
          </div>
        </div>

        <div class="column is-full">
          <hr class="my-0" style="background-color: #dedede" />
        </div>

        <div class="column">
          <button
            @click="update"
            class="button is-light is-fullwidth"
            :class="{ 'is-success': isChanged }"
          >
            Update
          </button>
        </div>
      </div>
    </div>

    <div class="column is-full" v-if="loading">
      <p class="title">Loading...</p>
    </div>

    <div class="modal" :class="{ 'is-active': showModal }">
      <!-- Modal can be closed by clicking any part of the modal background -->
      <div class="modal-background" @click="showModal = false"></div>

      <!-- The whole modal content can be clicked to close the modal -->
      <div class="modal-content" @click="showModal = false">
        <span class="image is-square">
          <img :src="imageDataURI" />
        </span>
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
// @todo Load this asynchronously in the sold method
import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

export default {
  name: "UserDetails",

  props: ["userID"],

  created() {
    if (this.userID) {
      this.login(this.userID);
    }
  },

  data() {
    return {
      loading: false,
      loggedIn: false,

      number: undefined,

      user: {
        fname: undefined,
        lname: undefined,
        number: undefined,
        email: undefined,
        address: undefined,
        postalCode: undefined,
      },
      // Original user starts the same like 'user' but it is not binded to any inputs,
      // and is used to detect if user has been modified.
      originalUser: {
        fname: undefined,
        lname: undefined,
        number: undefined,
        email: undefined,
        address: undefined,
        postalCode: undefined,
      },

      /* Paynow QR code values */
      showModal: false,
      imageDataURI: undefined,
    };
  },

  computed: {
    isChanged() {
      // Hard coded lists of props as these props wont be changing anytime
      // If any of the props differ between the 2 objects, a boolean true is returned
      return Boolean(
        ["fname", "lname", "number", "email", "address", "postalCode"].find(
          (key) => this.user[key] !== this.originalUser[key]
        )
      );
    },
  },

  methods: {
    async login(userID) {
      this.loading = true;

      // Call different API depending on whether a userID is passed in
      const res = await oof
        .GET(userID ? `/user/${userID}` : `/user/number/${this.number}`)
        .header(await getAuthHeader())
        .runJSON();

      this.loading = false;

      // @todo If account does not exists, ask user if they would like to create account instead, then redirect to create user

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Failed to login\nTry again?`) && this.login();

      this.user = res.user;

      // Clone user data object to preserve its original state to check if it has been changed later
      this.originalUser = Object.assign({}, res.user);

      this.loggedIn = true;
    },

    async showQR() {
      const { default: generateImageDataURI } = await import(
        "../utils/generateImageDataURI.js"
      );

      // Call API to generate temporary userID before user fills it in
      const userID = "";

      // Generate the QR code image data URL and set onto component data value
      this.imageDataURI = await generateImageDataURI(
        `https://user.ministryofpup.com/#/update/${userID}`
      );

      // Open up modal to show the QR Code image
      this.showModal = true;
    },

    async create() {
      // Show confirmation dialog box to ensure it is not accidentally clicked on
      if (!confirm("Confirm?")) return;

      // @todo Validate all required input is entered
    },

    reset() {
      // Reset the data values to its original state by re-running the data method
      // https://github.com/vuejs/vue/issues/702#issuecomment-308991548
      // https://www.carlcassar.com/articles/reset-data-in-a-vue-component
      Object.assign(this.$data, this.$options.data());

      // Only use this if `this` is used in the data method
      // Object.assign(this.$data, this.$options.data.apply(this));

      // Reset scroll position to top too to allow admin to quickly create a new user
      window.scrollTo(0, 0);
    },
  },
};
</script>
