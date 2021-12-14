<template>
  <div class="columns is-multiline is-vcentered" style="max-width: 50em">
    <div class="column">
      <!-- @todo Might not always work if not getting -->
      <p class="subtitle">All Past Transactions ({{ transactions.length }})</p>
    </div>

    <div class="column is-narrow">
      <button class="button is-success is-light" @click="getTransactions">
        Refresh
      </button>
    </div>

    <div class="column is-full">
      <label>
        <b>Search</b>
        (By Customer's name, receipt number, item name, item description)

        <div class="field has-addons">
          <div class="control is-expanded">
            <!-- @todo Auto focus not working when the site first loads for iOS safari, to test on other mobile devices.. chrome desktop works -->
            <input
              v-autofocus
              ref="searchField"
              type="text"
              v-model="search_input"
              placeholder="E.g. John / Bulldog"
              required
              class="input"
              style="width: 100%"
            />
          </div>
          <div class="control">
            <button class="button" @click="clearSearchInput">clear</button>
          </div>
        </div>
      </label>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div v-if="loading" class="column is-full">
      <p class="title">... Loading ...</p>
    </div>

    <div v-else class="column is-full">
      <div class="columns is-multiline">
        <!-- If there is a search input, show the number of users returned -->
        <div class="column is-full" v-if="search_input">
          Number of results: {{ results.length }}
        </div>

        <div
          class="column is-half"
          v-for="(transaction, i) in results"
          :key="i"
        >
          <!-- @todo Change this into a button or smth as not all transactions have receipts -->
          <!-- Only show this link if receiptNumber is present on the transaction object -->
          <a
            class="box"
            target="_blank"
            :href="`https://api.ministryofpup.com/receipt/number/${transaction.receiptNumber}`"
          >
            {{ transaction.receiptNumber }}
            <br />

            {{ formatDate(transaction.time * 1000) }}
            <br />

            <!-- Show this conditionally as buyer's name may not be available for all transactions -->
            <span v-if="transaction.buyer_name">
              <b>{{ transaction.buyer_name }}</b>
              <br />
            </span>

            Total
            {{
              formatCurrency(
                transaction.items.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                )
              )
            }}
            <br />

            <hr class="my-2" />

            <div class="mx-2" v-for="(item, j) in transaction.items" :key="j">
              <b>{{ item.item }}</b>
              <br />

              <span v-if="item.description">
                <i>{{ item.description }}</i>
                <br />
              </span>

              {{ formatCurrency(item.price) }} x{{ item.quantity }}
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import formatDate from "../utils/formatDate.js";
import formatCurrency from "../utils/formatCurrency.js";

export default {
  name: "Transactions",

  created() {
    this.getTransactions();
  },

  data() {
    return {
      loading: true,

      search_input: "",
      search_options: {
        // @todo Maybe give user filters to choose from instead of everything all at once
        keys: [
          "buyer_name",
          "receiptNumber",
          "items.name",
          "items.description",
        ],

        // When to give up search. A threshold of 0.0 requires a perfect match of both letters and location, a threshold of 1.0 would match anything, default to 0.6
        threshold: 0.36,
      },

      /* Values set by the methods after reading from API */
      transactions: [],
    };
  },

  computed: {
    // Update fuse object when search options is updated
    fuse() {
      return new Fuse(Object.values(this.transactions), this.search_options);
    },

    // Continously search as user input changes
    results() {
      // Return the entire array if search input is empty to show all transactions
      //
      // Limit max number of returned search results to ensure not too many results are returned (esp for lower spec mobile devices),
      // especially at the start of the search where alot of results will be matched when only 1 - 4 characters are entered
      //
      // After getting search results back, map to an array of items only to match the shape of the transactions array
      return this.search_input
        ? this.fuse
            .search(this.search_input, { limit: 12 })
            .map((result) => result.item)
        : this.transactions;
    },
  },

  methods: {
    formatDate,
    formatCurrency,

    // Clear the search input box and re-focus on the search field
    clearSearchInput() {
      this.search_input = "";
      this.$refs.searchField.focus();
    },

    // @todo Get more and more instead of get all at once
    async getTransactions() {
      this.loading = true;

      const { oof } = await import("simpler-fetch");
      const { getAuthHeader } = await import("../firebase.js");

      const res = await oof
        .GET("/admin/transactions/all")
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) &&
          this.getTransactions()
        );

      this.transactions = res.transactions;

      this.loading = false;
    },
  },
};
</script>
