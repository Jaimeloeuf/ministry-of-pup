<template>
  <div
    class="columns is-multiline is-centered is-vcentered"
    style="max-width: 50em"
  >
    <div class="column">
      <p class="subtitle">Create User Account</p>
    </div>

    <div class="column is-narrow">
      <button class="button is-light is-success" @click="showQR">
        Show QR link
      </button>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <div class="columns is-multiline is-vcentered">
        <div class="column is-half">
          <label>
            <b>First Name</b>

            <input
              type="text"
              v-model="customer.fname"
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
              v-model="customer.lname"
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
              v-model="customer.number"
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
              v-model="customer.email"
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
              v-model="customer.address"
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
              v-model="customer.postalCode"
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

    <div class="column is-narrow">
      <button @click="reset" class="button is-light is-fullwidth is-danger">
        Reset
      </button>
    </div>

    <div class="column">
      <button @click="create" class="button is-light is-fullwidth is-success">
        Create
      </button>
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
  name: "CreateUser",

  data() {
    return {
      customer: {
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

  methods: {
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
      // Address and postal code is not required, BUT REQUIRED if buying something

      this.reset();
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
