<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full pt-0 mt-0">
      <div v-for="(item, i) in items" :key="i">
        <div class="columns is-multiline is-vcentered mt-2">
          <div class="column">
            <!-- Showing item as 1 indexed to make it more human readable -->
            <p class="subtitle">Item {{ i + 1 }}</p>
          </div>

          <div class="column is-narrow">
            <button class="button is-light is-danger" @click="deleteItem(i)">
              Delete
            </button>
          </div>

          <div class="column is-narrow">
            <!-- Need to use vm.$set method as setting array elements directly is not reactive -->
            <button
              class="button is-light is-success"
              @click="$set(showItems, i, !showItems[i])"
            >
              {{ showItems[i] ? "Hide" : "Show" }}
            </button>
          </div>

          <div class="column is-full">
            <hr class="my-0" style="background-color: #dedede" />
          </div>
        </div>

        <div v-if="showItems[i]" class="columns is-multiline is-centered">
          <div class="column is-full">
            <label>
              <b>Item name</b>
              <br />
              *Use scanner

              <input
                type="text"
                v-model="item.item"
                placeholder="E.g. Dog collar"
                class="input"
              />
            </label>
          </div>

          <div class="column is-full">
            <label>
              <b>Item description</b>

              <!-- @todo Make textarea grow automatically -->
              <textarea
                v-model="item.description"
                class="textarea"
                placeholder="Describe this item"
              />
            </label>
          </div>

          <div class="column is-full">
            <label>
              <b>Quantity</b>

              <input
                type="number"
                v-model="item.quantity"
                pattern="[\s0-9]+"
                min="0"
                placeholder="E.g. 3"
                class="input"
              />
            </label>
          </div>

          <div class="column is-full">
            <label>
              <b>Unit Price</b>
              <br />
              *Price per unit (Total cost per item is "Quantity x Unit Price")

              <input
                type="number"
                v-model="item.price"
                pattern="[\s0-9]+"
                min="0"
                placeholder="E.g. 100 for $100"
                class="input"
              />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Only show the line break before the add item button if the last item is opened -->
    <div class="column is-full" v-if="showItems[showItems.length - 1]">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <!-- @todo Show QR -->

    <div class="column is-half">
      <button
        @click="resetItems"
        class="button is-light is-fullwidth is-danger"
      >
        Reset Items
      </button>
    </div>

    <div class="column is-half">
      <button @click="addItem" class="button is-light is-fullwidth is-success">
        Add Item
      </button>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <div class="columns is-multiline is-vcentered">
        <div class="column">
          <p class="subtitle">Customer details</p>
        </div>

        <div class="column is-narrow">
          <button class="button is-light is-danger" @click="resetCustomer">
            Reset
          </button>
        </div>

        <div class="column is-narrow">
          <button
            class="button is-light is-success"
            @click="showCustomerDetails = !showCustomerDetails"
          >
            {{ showCustomerDetails ? "Hide" : "Show" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showCustomerDetails" class="column is-full">
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
            *Sales invoice will be sent here

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

    <div class="column is-one-third">
      <button @click="reset" class="button is-light is-fullwidth is-danger">
        Reset form
      </button>
    </div>

    <!-- @todo Maybe change to Pay (others) then open up a modal to show how much to pay and all, and a button to show payment complete -->
    <div class="column is-one-third">
      <button
        @click="paymentComplete"
        class="button is-light is-fullwidth is-warning"
      >
        Payment Complete
      </button>
    </div>

    <div class="column is-one-third">
      <button
        @click="showPaynowQR"
        class="button is-light is-fullwidth is-success"
      >
        Paynow
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

        <button
          class="button is-fullwidth is-success is-light py-6"
          @click="paymentComplete"
        >
          Complete
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
// @todo Load this asynchronously in the sold method
import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

export default {
  name: "ManualSale",

  data() {
    return {
      showItems: [],
      items: [],

      showCustomerDetails: true,
      customer: {
        fname: undefined,
        lname: undefined,
        number: undefined,
        email: undefined,
      },

      /* Paynow QR code values */
      showModal: false,
      imageDataURI: undefined,

      // Used to store the calculated totalPrice of sale when clicking pay button
      totalPrice: undefined,

      dogTypeID: 1,
      dogTypes: [
        { id: 1, text: "French bulldog" },
        { id: 2, text: "Shiba Inu" },
      ],
    };
  },

  methods: {
    addItem() {
      this.items.push({
        item: undefined,
        description: undefined,
        quantity: undefined,
        price: undefined,
      });

      // Collapse for all other items
      this.showItems.fill(false);

      // Add a show item control variable to array
      this.showItems.push(true);
    },

    deleteItem(index) {
      this.items.splice(index, 1);
      this.showItems.splice(index, 1);
    },

    async showPaynowQR() {
      // Specify amount of to pay, this just sums up the price of all items
      this.totalPrice = this.items.reduce(
        (acc, cur) => acc + cur.price * cur.quantity,
        0
      );

      const { default: PaynowQR } = await import("paynowqr");

      // The QR Code should only be valid until tmr
      // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds = 86400000 milliseconds
      const d = new Date(new Date().valueOf() + 86400000);
      const month = d.getMonth() + 1;
      const pmonth = month > 9 ? month : `0${month}`; // Month with 0 padding
      const date = d.getDate();
      const pdate = date > 9 ? date : `0${date}`; // Date with 0 padding
      const expiryDate = `${d.getFullYear()}${pmonth}${pdate}`;

      //Create a PaynowQR object
      const paynowQRCode = new PaynowQR({
        // Required: UEN of company, hard coded in as it will not be changed
        uen: "T17LL2360H",

        // @todo Disallow if price is 0
        amount: this.totalPrice,

        // Set an expiry date for the Paynow QR code (YYYYMMDD, e.g. "20211231")
        // If omitted, defaults to 5 years from current time.
        expiry: expiryDate,

        // @todo Call and API to generate a invoice reference number to track later (possibly have the paynow bank app on the ipad)
        // MOP - Invoice - Manual - 1001
        // Reference number for Paynow Transaction. Useful if you need to track payments for recouncilation.
        refNumber: "MOP-INV-MAN-1001",

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

    // @todo Validate all required input is entered
    async paymentComplete() {
      // Give admin a confirmation dialog box to ensure it is not accidentally clicked on
      if (!confirm("Payment Completed?")) return;

      // Close the payment modal in case it is not closed
      this.showModal = false;

      const res = await oof
        .POST("/admin/sale/manual")
        .header(await getAuthHeader())
        .data({
          paymentMethod: "paynow",
          invoiceNumber: "MOP-INV-MAN-1001",
          totalPrice: this.totalPrice,

          customer: this.customer,

          // Process the items to ensure that all the price are in cents
          items: this.items.map(function (item) {
            let finalItem = { ...item, amount: item.price * 100 };
            delete finalItem.price;
            return finalItem;
          }),
        })
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Error: \n${res.error}\n\nTry again?`) && this.Sell();

      alert("Sale processed!");

      // Might want to insert the sale data into store for a transactions view

      // Check with admin if page should be reset once sale is processed,
      // as they may want to reuse the item details and change customer details only
      if (confirm("Reset entire form?")) this.reset();
    },

    resetItems() {
      // Reset the data values to its original state by re-running the data method
      // https://github.com/vuejs/vue/issues/702#issuecomment-308991548
      // https://www.carlcassar.com/articles/reset-data-in-a-vue-component
      // Object.assign(this.$data.items, this.$options.data().items);

      // The Object.assign syntax above does not work as items is not an object but an array,
      // Thus using the Vue's reactive set method to reset the items array
      this.$set(this.$data, "items", []);
      this.$set(this.$data, "showItems", []);
    },

    resetCustomer() {
      // Reset the data values to its original state by re-running the data method
      // https://github.com/vuejs/vue/issues/702#issuecomment-308991548
      // https://www.carlcassar.com/articles/reset-data-in-a-vue-component
      Object.assign(this.$data.customer, this.$options.data().customer);

      // Only use this if `this` is used in the data method
      // Object.assign(this.$data, this.$options.data.apply(this));
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
