<template>
  <div id="main">
    <!-- This contains both the navbar and the main content at the top of the viewport -->
    <div class="columns mt-5 ml-5">
      <!-- is-narrow modifier makes the column shrink to the size of the inner component -->
      <div class="column is-narrow" v-if="showNavbar">
        <Navbar />
      </div>

      <div class="column">
        <!-- Router view for the main view -->
        <router-view />
      </div>
    </div>

    <!-- The version component is at the bottom of the main content below logout button in side nav bar -->
    <version class="ml-5 mb-5" />
  </div>
</template>

<script>
// Load the bulma styles in the top level component
import "bulma/css/bulma.min.css";

import Navbar from "./components/SideNavBar";
import version from "./components/Version.vue";
import AuthType from "./router/AuthType";

export default {
  name: "App",

  components: { Navbar, version },

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

/* Color input pink if it is invalid --> when telephone number does not match the specified pattern */
/* Will only activate if the placeholder is not currently being shown, meaning will not show before user type anything */
input:not(:placeholder-shown):invalid {
  background-color: lightpink;
}
</style>
