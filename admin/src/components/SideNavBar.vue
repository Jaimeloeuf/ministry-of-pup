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
        <!--
            See the current appointment
            The && current gaurd is to prevent accessing 'id' of undefined,
            if the appointments has not been loaded or if there is no current appointment
        -->
        <li>
          <a
            @click="currentAppointment"
            :class="{
              'is-active':
                $route.name === 'appointment' &&
                current &&
                $route.params.appointmentID === current.id,
            }"
          >
            Current
          </a>
        </li>
        <!--
            See the very next upcoming appointment
            The && next gaurd is to prevent accessing 'id' of undefined,
            if the appointments has not been loaded or if there is no upcoming appointment
        -->
        <li>
          <a
            @click="nextAppointment"
            :class="{
              'is-active':
                $route.name === 'appointment' &&
                next &&
                $route.params.appointmentID === next.id,
            }"
          >
            Next
          </a>
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
import { mapGetters } from "vuex";
import logout from "../utils/logout.js";

export default {
  name: "SideNavBar",

  computed: mapGetters("appointment", ["current", "next"]),

  methods: {
    logout,

    // Function to route to the appointment view for the current appointment if any
    async currentAppointment() {
      // Trigger the action to load all scheduled appointments from API again,
      // To ensure that the list of appointments available is the latest before getting the current appointment
      await this.$store.dispatch("appointment/getAppointments");

      if (this.current)
        this.$router.push({
          name: "appointment",
          params: { appointmentID: this.current.id },
        });
      else alert("There is no appointments happening right now!");
    },

    // Function to route to the appointment view for the next upcoming appointment if any
    async nextAppointment() {
      // Trigger the action to load all scheduled appointments from API again,
      // To ensure that the list of appointments available is the latest before getting the next appointment
      await this.$store.dispatch("appointment/getAppointments");

      if (this.next)
        this.$router.push({
          name: "appointment",
          params: { appointmentID: this.next.id },
        });
      else alert("There is no more appointments left!");
    },
  },
};
</script>
