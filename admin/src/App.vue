<template>
  <div id="main" class="columns mt-5 ml-5">
    <!-- is-narrow modifier makes the column shrink to the size of the inner component -->
    <div class="column is-narrow" v-if="showNavbar">
      <Navbar />
    </div>

    <div class="column">
      <!-- Router view for the main view -->
      <router-view />
    </div>
  </div>
</template>

<script>
// Load the bulma styles in the top level component
import "bulma/css/bulma.min.css";

import Navbar from "./components/SideNavBar";
import AuthType from "./router/AuthType";

export default {
  name: "App",

  components: { Navbar },

  computed: {
    // @todo Remove this and rely on router to pass in prop to decide if nav bar should be shown
    showNavbar() {
      return this.$route.meta.Auth_requirements !== AuthType.public_only;
    },
  },
};
</script>

<style>
/* Alternative bulma import using CDN */
/* @import "https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css"; */

#main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

/* Shared class for all views. */
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: left;
  height: 100vh;
}
</style>
