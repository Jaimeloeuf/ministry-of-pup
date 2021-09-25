<template>
  <nav class="navbar navbar-menu mr-5" role="navigation">
    <aside class="menu">
      <p class="menu-label">User</p>
      <!-- Give px-4 padding to align with the other items as a tags carry that padding by default -->
      <ul class="menu-list px-4">
        <li>Name: {{ user.name }}</li>
      </ul>

      <p class="menu-label">General</p>
      <ul class="menu-list">
        <li>
          <router-link
            :to="{ name: 'home' }"
            :class="{ 'is-active': $route.name === 'home' }"
          >
            Dashboard
          </router-link>
        </li>
      </ul>

      <p class="menu-label">Appointments</p>
      <ul class="menu-list">
        <!-- See the very next upcoming appointment -->
        <!-- @todo This should get the next appointment ID, then route to appointment vue with the ID. Alert if nothing -->
        <li>
          <router-link
            :to="{ name: 'next-appointment' }"
            :class="{ 'is-active': $route.name === 'next-appointment' }"
          >
            Next
          </router-link>
        </li>
        <!-- See all appointments to click into 1 for more details to prep for it -->
        <li>
          <router-link
            :to="{ name: 'all-appointments' }"
            :class="{ 'is-active': $route.name === 'all-appointments' }"
          >
            All
          </router-link>
        </li>
      </ul>

      <p class="menu-label">Dogs</p>
      <ul class="menu-list">
        <li>
          <router-link
            :to="{ name: 'new-dog' }"
            :class="{ 'is-active': $route.name === 'new-dog' }"
          >
            New dog
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'all-dogs' }"
            :class="{ 'is-active': $route.name === 'all-dogs' }"
          >
            All dogs
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'sold-dog' }"
            :class="{ 'is-active': $route.name === 'sold-dog' }"
          >
            Sold a dog
          </router-link>
        </li>
      </ul>

      <p class="menu-label">Schedule</p>
      <ul class="menu-list">
        <li>
          <router-link
            :to="{ name: 'schedule' }"
            :class="{ 'is-active': $route.name === 'schedule' }"
          >
            See Schedule
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'block-schedule' }"
            :class="{ 'is-active': $route.name === 'block-schedule' }"
          >
            Block Schedule
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'set-opening' }"
            :class="{ 'is-active': $route.name === 'set-opening' }"
          >
            Opening hours
          </router-link>
        </li>
      </ul>

      <p class="menu-label">Customers</p>
      <ul class="menu-list">
        <li>
          <router-link
            :to="{ name: 'all-customers' }"
            :class="{ 'is-active': $route.name === 'all-customers' }"
          >
            All customers
          </router-link>
        </li>
      </ul>

      <p class="menu-label">Administration</p>
      <ul class="menu-list">
        <li>
          <router-link
            :to="{ name: 'settings' }"
            :class="{ 'is-active': $route.name === 'settings' }"
          >
            Settings
          </router-link>
        </li>
        <li>
          <a>Manage Team</a>
          <ul>
            <li><a>Members</a></li>
            <li><a>Invite</a></li>
          </ul>
        </li>
        <li><a>Others</a></li>
      </ul>

      <!-- <p class="menu-label">Transactions</p>
          <ul class="menu-list">
            <li><a>Transfers</a></li>
            <li><a>Balance</a></li>
          </ul> -->

      <hr />

      <button @click="logout" class="button is-light is-fullwidth">
        logout
      </button>
    </aside>
  </nav>
</template>

<script>
import { mapState } from "vuex";
import logout from "../utils/logout";

export default {
  name: "SideNavBar",

  // Bind vuex's user module's user state object into this component to display user data
  computed: mapState("user", ["user"]),

  methods: { logout },
};
</script>
