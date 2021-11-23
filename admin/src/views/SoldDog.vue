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

    <!-- 
      Show MSRP without auto fill to force admin to type it out again
      Then if differs from MSRP, warn user before allowing them to proceed
      This is to prevent user from just clicking sold without updating the price if it has change after negotiation
    -->
    <div class="column is-full">
      <label>
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

    <div class="column is-full pb-0">
      <b>Customer from</b>
    </div>

    <div class="column is-full">
      <div class="tabs is-toggle is-centered is-fullwidth">
        <ul>
          <li>
            <a @click="show = 'a'">Appointment</a>
          </li>
          <li>
            <a @click="show = 'w'">Walk In</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="column is-full" v-if="show === 'a'">
      <!-- Embed the component here -->
    </div>

    <div class="column is-full" v-if="show === 'w'">
      <!-- Embed the component here -->
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
import { mapState } from "vuex";

import formatCurrency from "../utils/formatCurrency.js";

export default {
  name: "SoldDog",

  props: ["dogID"],

  computed: {
    // If a dogID is passed in as a URL query
    // @todo Load the dog using this.dogID after admin choose from the dropdown
    dog() {
      return this.dogID ? this.$store.state.dog.dogs[this.dogID] : undefined;
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

      /* Paynow QR code values */
      showModal: false,
      imageDataURI: undefined,
    };
  },

  methods: {
    formatCurrency,

    updateUserID(event) {
      this.userID = event.target.value;
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
      await this.showPaynowQR();
    },
  },
};
</script>
