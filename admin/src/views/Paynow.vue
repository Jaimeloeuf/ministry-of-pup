<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="subtitle">Generate Paynow QR codes with fixed amount</p>
    </div>

    <div class="column is-half">
      <label>
        <b>Price</b>
        *Only up to 1 cent (2 d.p.)
        <br />

        <input
          type="number"
          v-model="price"
          pattern="[\s0-9]+"
          step="0.01"
          min="0"
          placeholder="E.g. 100 for $100 where unit is dollars"
          class="input"
        />
      </label>
    </div>

    <div class="column is-half">
      <label>
        <b>Paynow Reference number if any</b>
        <br />

        <input
          type="text"
          v-model="referenceNumber"
          placeholder="Leave blank to auto generate"
          class="input"
        />
      </label>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-one-quarter">
      <button @click="reset" class="button is-light is-fullwidth is-danger">
        Reset
      </button>
    </div>

    <div class="column is-three-quarters">
      <button
        @click="showPaynowQR"
        class="button is-light is-fullwidth is-success"
      >
        Generate QR Code
      </button>
    </div>

    <div class="modal" :class="{ 'is-active': showModal }">
      <!-- Modal can be closed by clicking any part of the modal background -->
      <div class="modal-background" @click="showModal = false"></div>

      <div class="modal-content">
        <span class="image is-square">
          <img :src="imageDataURI" />
        </span>

        <button
          class="button is-fullwidth is-success is-light py-6"
          @click="showModal = false"
        >
          Complete ({{ referenceNumber }})
        </button>
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
import generateReceiptNumber from "../utils/generateReceiptNumber.js";

export default {
  name: "Paynow",

  data() {
    return {
      price: undefined,
      referenceNumber: undefined,

      /* Paynow QR code values */
      showModal: false,
      imageDataURI: undefined,
    };
  },

  methods: {
    async showPaynowQR() {
      const { default: PaynowQR } = await import("paynowqr");

      // @todo Call and API to generate a invoice reference number to track later (possibly have the paynow bank app on the ipad)
      // Reference number for Paynow Transaction. Useful if you need to track payments for recouncilation.
      this.referenceNumber = this.referenceNumber || generateReceiptNumber();

      // The QR Code should only be valid for 1 hour
      // 60 minutes * 60 seconds * 1000 milliseconds = 3600000 milliseconds
      const d = new Date(new Date().getTime() + 3600000);
      const month = d.getMonth() + 1; // +1 as getMonth is 0 indexed where 0 is Jan
      const pmonth = month > 9 ? month : `0${month}`; // Month with 0 padding
      const date = d.getDate();
      const pdate = date > 9 ? date : `0${date}`; // Date with 0 padding
      const expiryDate = `${d.getFullYear()}${pmonth}${pdate}`;

      //Create a PaynowQR object
      const paynowQRCode = new PaynowQR({
        // Required: UEN of company, hard coded in as it will not be changed
        uen: "T17LL2360H",

        // As price from HTML input tag will be of String type
        amount: parseFloat(this.price),

        // Set an expiry date that is only valid for 1 day
        expiry: expiryDate,

        refNumber: this.referenceNumber,
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
