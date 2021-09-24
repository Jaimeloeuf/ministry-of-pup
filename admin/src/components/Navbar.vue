<template>
  <!-- Hero head: will stick at the top on load -->
  <div class="hero-head">
    <!-- is fixed top will keep it sticky at the top of the page -->
    <nav id="nav" class="navbar is-fixed-top is-white" role="navigation">
      <!-- Container to force nav bar into center with wider side margins -->
      <div class="container">
        <div class="navbar-brand">
          <router-link :to="{ name: 'home' }" class="navbar-item">
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

        <div
          class="navbar-menu has-text-right"
          :class="{ 'is-active': showMobileMenu }"
        >
          <!-- Show the menu at the other end -->
          <div class="navbar-end">
            <!-- Using v-html instead of string interpolation to support html link names like using icons -->
            <router-link
              v-for="(menuItem, i) in menuItems"
              :key="i"
              :to="menuItem.link"
              class="navbar-item"
            >
              <span v-html="menuItem.name" @click="showMobileMenu = false" />
            </router-link>

            <!-- Using router-link to show logout to use a consistent UI, but since not actually a link, the :to prop is empty -->
            <router-link class="navbar-item" :to="{}">
              <span @click="logout">logout</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Give extra spacing between navbar line and view content -->
    <br />
  </div>
</template>

<script>
import logout from "../utils/logout";

export default {
  name: "Navbar",

  data() {
    return {
      showMobileMenu: false,

      menuItems: [
        { name: "Home", link: { name: "home" } },
        { name: "Settings", link: { name: "settings" } },
      ],
    };
  },

  methods: { logout },
};
</script>

<style scoped>
/* Gives the nav bar a white fill background and a super thin and light bottom underline to give visual seperation from the content */
#nav {
  /* background: black; */
  background: white;
  border-bottom: 1px solid rgb(231, 231, 231);
}
</style>
