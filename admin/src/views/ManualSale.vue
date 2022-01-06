<template>
  <div class="columns is-multiline is-centered" style="max-width: 50em">
    <div class="column is-full">
      <p class="title">Manual Sale</p>
    </div>

    <div class="column is-full pb-0">
      <b>Customer Type</b>
    </div>

    <div class="column is-full">
      <div class="tabs is-toggle is-centered is-fullwidth">
        <ul>
          <li :class="{ 'is-active': showUserLogin }">
            <a @click="showUserLogin = true">Member</a>
          </li>
          <li :class="{ 'is-active': !showUserLogin }">
            <a @click="showUserLogin = false">Anonymous</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="column is-full" v-if="showUserLogin">
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
                query: { redirect: { name: 'sale-manual' } },
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
                  type="number"
                  pattern="[\s0-9]+"
                  min="0"
                  v-model="customer.number"
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

            {{ customer.fname }}
          </div>

          <div class="column is-half">
            <b>Last Name</b>
            <br />

            {{ customer.lname }}
          </div>

          <div class="column is-half">
            <b>Phone Number</b>
            *Without the +65 prefix
            <br />

            {{ customer.number }}
          </div>

          <div class="column is-half">
            <b>Email</b>
            *Sales receipt will be sent here
            <br />

            {{ customer.email }}
          </div>

          <div class="column is-full">
            <b>Address</b>
            *Full Address including any unit number
            <br />

            <span v-if="customer.address">{{ customer.address }}</span>
            <i v-else>nil</i>
          </div>

          <div class="column">
            <b>Postal Code</b>
            *Format is 6 digits only
            <br />

            <span v-if="customer.postalCode">{{ customer.postalCode }}</span>
            <i v-else>nil</i>
          </div>

          <div class="column is-narrow">
            <button class="button is-light is-danger" @click="loggedIn = false">
              logout
            </button>
          </div>

          <div class="column is-narrow">
            <router-link
              :to="{ name: 'user-details', query: { userID: customer.id } }"
              class="button is-light is-warning"
            >
              Update Details
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="column is-full" v-else>
      Create a sale transaction for an <b><i>anonymous customer</i></b>
      <br />

      *Note that no data will be collected, only used for simple item sales, not
      for dog sales / subscriptions.
    </div>

    <div class="column is-full">
      <hr class="my-0" />
    </div>

    <div class="column pb-0 mb-0">
      <p class="subtitle is-4">items</p>
    </div>

    <div class="column is-full pt-0 mt-0">
      <div v-for="(item, i) in items" :key="i">
        <div class="columns is-multiline is-vcentered mt-2">
          <div class="column">
            <!-- Showing item as 1 indexed to make it more human readable -->
            <b>Item {{ i + 1 }}</b>
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
            <hr class="my-0" />
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
                v-model="item.name"
                placeholder="E.g. Dog collar"
                class="input"
              />
            </label>
          </div>

          <div class="column is-full">
            <label>
              <b>Item description</b>

              <input
                type="text"
                v-model="item.description"
                placeholder="Descibe this item, E.g. 15cm collar"
                class="input"
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
              *Price for 1 unit (Total cost per item is "Quantity x Unit Price")

              <input
                type="number"
                v-model="item.price"
                pattern="[\s0-9]+"
                min="0"
                step="0.01"
                placeholder="E.g. 100 for $100 where unit is dollars"
                class="input"
              />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Only show the line break before the add item button if the last item is opened -->
    <div class="column is-full" v-if="showItems[showItems.length - 1]">
      <hr class="my-0" />
    </div>

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
      <hr class="my-0" />
    </div>

    <div class="column is-full">
      <Payment
        v-model="paymentMethod"
        v-on:payment-complete="paymentComplete"
        v-on:close-modal="showPaymentModal = false"
        :showPaymentModal="showPaymentModal"
        :amount="paymentAmount"
        :receiptNumber="receiptNumber"
      />
    </div>

    <div class="column is-full">
      <hr class="my-0" />
    </div>

    <div class="column is-narrow">
      <button @click="reset" class="button is-light is-danger">Reset</button>
    </div>

    <div class="column">
      <button @click="pay" class="button is-light is-success is-fullwidth">
        Pay
      </button>
    </div>
  </div>
</template>

<script>
import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

import generateReceiptNumber from "../utils/generateReceiptNumber.js";
import Payment from "../components/Payment.vue";

/**
 * Simple validation function for an item object
 * Does not type check the properties because price and quantity are going to be strings over here after reading from HTML inputs
 * They will only be converted to Number after creating a new items list for sending to the API
 * @returns {boolean} Returns a boolean indicating if the item object is invalid
 */
const isItemInvalid = (item) =>
  !(
    item.name &&
    typeof item.name === "string" &&
    item.price &&
    item.quantity &&
    // Description is an optional string, only check type if it is there
    // Else defaults to true, to let the previous boolean expression pass through in the && conditional
    (item.description ? typeof item.description === "string" : true)
  );

export default {
  name: "ManualSale",

  components: { Payment },

  data() {
    return {
      showItems: [],
      items: [],

      showUserLogin: true,
      loggedIn: false,

      customer: {
        id: undefined,
        fname: undefined,
        lname: undefined,
        number: undefined,
        email: undefined,
        address: undefined,
        postalCode: undefined,
      },

      paymentMethod: undefined,
      showPaymentModal: false,
      paymentAmount: undefined,

      // Pre-generate the receipt number so that the same one can be accessed by both paylah QR and payment complete method
      receiptNumber: generateReceiptNumber(),
    };
  },

  methods: {
    addItem() {
      this.items.push({
        name: undefined,
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

    async login() {
      if (!this.customer.number) return alert("Missing phone number");

      this.loading = true;

      const res = await oof
        .GET(`/user/number/${this.customer.number}`)
        .header(await getAuthHeader())
        .runJSON();

      this.loading = false;

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Failed to login\nTry again?`) && this.login();

      this.customer = res.user;
      this.loggedIn = true;
    },

    /**
     * Sums up the price of all items and return price to pay in Dollars
     * Parses price and quantity into float and int as the HTML input will be stored as string
     */
    calculateTotalPrice() {
      return this.items.reduce(
        (acc, cur) => acc + parseFloat(cur.price) * parseInt(cur.quantity),
        0
      );
    },

    pay() {
      if (this.items.length === 0) return alert("Error: No items specified");

      // If manual sale for a specific customer is selected but user did not login,
      // Admin should either login or change it to be an anonymous customer
      if (this.showUserLogin && !this.loggedIn)
        return alert("Error: Either login or select Anonymous Customer");

      if (this.items.filter(isItemInvalid).length !== 0)
        return alert(
          `Error: Invalid 'item' in items, all fields are required except description`
        );

      // Set the payment amount and let payment component handle the rest of payment flow
      this.paymentAmount = this.calculateTotalPrice();
      this.showPaymentModal = true;
    },

    // @todo Validate all required input is entered
    async paymentComplete() {
      // Process the items to ensure that all the price are in cents
      // Create a new item instead of modifying the original object to prevent changing things in the form
      const items = this.items.map((item) => {
        // Split up the item price string to the integer and decimal components
        const itemPrice = item.price.split(".");

        return {
          ...item,

          // Ensure that quantity is Number instead of String as it came from the HTML input tag
          quantity: parseInt(item.quantity),

          // How the price is calculated previously. However because of how numbers are represented in JS,
          // doing this can result in numbers like 202.9999999999997 instead of 2.3
          // price: parseFloat(item.price) * 100,
          //
          // Alternative way is to handle everything in String before parsing string to Int and no floating points
          // Ensure that price is Number instead of String as it came from the HTML input tag
          // Convert price from string to float then convert it from dollars to cents
          price: parseInt(
            item.price.split(".")[0] +
              (itemPrice[1]
                ? itemPrice[1].length === 1
                  ? itemPrice[1] + "0"
                  : itemPrice[1]
                : "00")
          ),
        };
      });

      const res = await oof
        .POST("/admin/sale/manual")
        .header(await getAuthHeader())
        .data({
          // Include userID if user is known + loggedIn to prove identity exists
          userID:
            this.showUserLogin && this.loggedIn ? this.customer.id : undefined,

          // Get total price and convert to cents as API requires it in cents
          // Remove fractional decimal places if any, as API expects Ints only
          totalPrice: Math.trunc(this.calculateTotalPrice() * 100),

          receiptNumber: this.receiptNumber,
          paymentMethod: this.paymentMethod,
          items,
        })
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) &&
          this.paymentComplete()
        );

      alert("Sale processed!");

      // Might want to insert the sale data into store for a transactions view so it does not have to load from API again

      this.reset();
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

    reset() {
      // Reset the data values to its original state by re-running the data method
      // https://github.com/vuejs/vue/issues/702#issuecomment-308991548
      // https://www.carlcassar.com/articles/reset-data-in-a-vue-component
      Object.assign(this.$data, this.$options.data());

      // Only use this if `this` is used in the data method
      // Object.assign(this.$data, this.$options.data.apply(this));

      // Reset scroll position to top too to allow admin to quickly enter a new manual sale
      window.scrollTo(0, 0);
    },
  },
};
</script>
