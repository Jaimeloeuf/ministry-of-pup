<template>
  <!-- @todo Fix this in squarish view, not exactly tablet, but between tablet and desktop -->
  <nav id="nav" class="navbar is-white has-text-left" role="navigation">
    <div class="navbar-menu px-5">
      <div class="navbar-start"></div>

      <div class="navbar-end">
        <aside id="sidenavbar" class="menu">
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
            <li>
              <router-link
                :to="{ name: 'next-appointment' }"
                :class="{ 'is-active': $route.name === 'next-appointment' }"
              >
                Next appointment
              </router-link>
            </li>
            <!-- See all appointments to click into 1 for more details to prep for it -->
            <li>
              <router-link
                :to="{ name: 'all-appointment' }"
                :class="{ 'is-active': $route.name === 'all-appointment' }"
              >
                All appointments
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

          <p class="menu-label">Dogs</p>
          <ul class="menu-list">
            <li>
              <router-link
                :to="{ name: 'new-dogs' }"
                :class="{ 'is-active': $route.name === 'new-dogs' }"
              >
                New dogs
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
      </div>
    </div>
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

<style scoped>
#sidenavbar {
  font-size: 1em;
}
</style>
