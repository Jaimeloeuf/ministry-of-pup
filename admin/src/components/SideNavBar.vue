<template>
  <!-- @todo Fix this in squarish view, not exactly tablet, but between tablet and desktop -->
  <nav id="nav" class="navbar is-white has-text-left" role="navigation">
    <div class="navbar-brand">
      <!-- @todo What about the is-tablet class to only show if it is tablet or smaller? -->
      <router-link :to="{ name: 'home' }" class="navbar-item is-hidden-desktop">
        <img src="../assets/logo.png" alt="Logo" />
      </router-link>

      <!-- Using <a> instead of button as it does not need an icon and dont have the inverted colors on click behaviour -->
      <a
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': showMobileMenu }"
        aria-label="menu"
        data-target="navbar-menu"
        @click="showMobileMenu = !showMobileMenu"
      >
        <!-- 3 empty span tags to show the burger menu icon -->
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>

    <div class="navbar-menu px-5" :class="{ 'is-active': showMobileMenu }">
      <div class="navbar-start"></div>

      <div class="navbar-end">
        <aside id="sidenavbar" class="menu">
          <p class="menu-label">User</p>
          <!-- Give px-4 padding to align with the other items as a tags carry that padding by default -->
          <ul class="menu-list px-4">
            <li>Name: {{ user.name }}</li>
            <li>Station: {{ user.firestationID }}</li>
          </ul>

          <p class="menu-label">General</p>
          <ul class="menu-list">
            <li><a class="is-active">Dashboard</a></li>
            <li><a>Customers</a></li>
          </ul>

          <p class="menu-label">Reports</p>
          <ul class="menu-list">
            <li><a>Tracking Usage</a></li>
            <li><a>Consumption</a></li>
            <li><a>Drugs & Disposal</a></li>
            <li><a>Stock balance</a></li>
            <li><a>Projection Order</a></li>
            <li><a>Variants</a></li>
          </ul>

          <p class="menu-label">Delivery Order</p>
          <ul class="menu-list">
            <li><a>Add</a></li>
          </ul>

          <p class="menu-label">Expiry</p>
          <ul class="menu-list">
            <li><a>Add</a></li>
          </ul>

          <p class="menu-label">Administration</p>
          <ul class="menu-list">
            <li><a>Team Settings</a></li>
            <li>
              <a>Manage Your Team</a>
              <ul>
                <li><a>Members</a></li>
                <li><a>Invitations</a></li>
              </ul>
            </li>
            <li><a>Cloud Storage Settings</a></li>
          </ul>

          <p class="menu-label">Transactions</p>
          <ul class="menu-list">
            <li><a>Transfers</a></li>
            <li><a>Balance</a></li>
          </ul>

          <hr />

          <button @click="logout" class="button is-light is-fullwidth">
            logout
          </button>
        </aside>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from "vuex";
import logout from "../utils/logout";

export default {
  name: "SideNavBar",

  data() {
    return {
      showMobileMenu: false,
    };
  },

  // Bind vuex's user module's user state object into this component to display user data
  computed: mapState("user", ["user"]),

  methods: { logout },
};
</script>

<style scoped>
#sidenavbar {
  font-size: 1em;
}
</style>
