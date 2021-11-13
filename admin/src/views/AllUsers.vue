<template>
  <div class="columns is-multiline is-vcentered" style="max-width: 50em">
    <div class="column">
      <p class="subtitle">All Users ({{ users.length }})</p>
    </div>

    <div class="column is-narrow">
      <button class="button is-success is-light" @click="getUsers">
        Refresh
      </button>
    </div>

    <div class="column is-full">
      <label>
        <b>Search (by name)</b>

        <div class="field has-addons">
          <div class="control is-expanded">
            <!-- @todo Auto focus not working when the site first loads for iOS safari, to test on other mobile devices.. chrome desktop works -->
            <input
              v-autofocus
              ref="searchField"
              type="text"
              v-model="search_input"
              placeholder="E.g. John"
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

        <div class="column is-half" v-for="(user, i) in results" :key="i">
          <router-link
            class="box content"
            :to="{ name: 'user-details', query: { userID: user.id } }"
          >
            <b>{{ `${user.lname} ${user.fname}` }}</b>
            <br />

            <ul>
              <li>{{ user.number }}</li>
              <li>{{ user.email }}</li>
              <li>
                {{ new Date(user.createdAt * 1000).toLocaleDateString() }}
              </li>
            </ul>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { oof } from "simpler-fetch";
import { getAuthHeader } from "../firebase.js";

import Fuse from "fuse.js";

export default {
  name: "AllUsers",

  created() {
    this.getUsers();
  },

  data() {
    return {
      loading: true,

      search_input: "",
      search_options: {
        keys: ["lname", "fname"],

        // When to give up search. A threshold of 0.0 requires a perfect match of both letters and location, a threshold of 1.0 would match anything, default to 0.6
        threshold: 0.36,
      },

      /* Values set by the methods after reading from API */
      users: [],
    };
  },

  computed: {
    // Update fuse object when search options is updated
    fuse() {
      return new Fuse(Object.values(this.users), this.search_options);
    },

    // Continously search as user input changes
    results() {
      // Return the entire user array if search input is empty to show all users
      //
      // Limit max number of returned search results to ensure not too many results are returned (esp for lower spec mobile devices),
      // especially at the start of the search where alot of results will be matched when only 1 - 4 characters are entered
      //
      // After getting search results back, map to an array of items only to match the shape of an users array
      return this.search_input
        ? this.fuse
            .search(this.search_input, { limit: 12 })
            .map((result) => result.item)
        : this.users;
    },
  },

  methods: {
    // Clear the search input box and re-focus on the search field
    clearSearchInput() {
      this.search_input = "";
      this.$refs.searchField.focus();
    },

    // @todo Get more and more instead of get all at once
    async getUsers() {
      this.loading = true;

      const res = await oof
        .GET("/admin/user/all")
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return confirm(`Error: \n${res.error}\n\nTry again?`) && this.getUsers;

      this.users = res.users;

      this.loading = false;
    },

    async deleteUser(userID) {
      return alert("Feature only available in v2");
    },
  },
};
</script>
