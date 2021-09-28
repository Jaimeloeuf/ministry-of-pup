<template>
  <div id="main">
    <!-- Where app contains the shared components and the router-view component to show the different views -->
    <HeroHead />
    <router-view />
    <Footer />
  </div>
</template>

<script>
/* Parent component that contains and switches between all the view components using view router's router-view */

// Load the bulma styles in the top level component
import "bulma/css/bulma.min.css";

import HeroHead from "@/components/HeroHead";
import Footer from "@/components/Footer";

export default {
  name: "App",
  components: {
    HeroHead,
    Footer,
  },
  data() {
    return {
      heroImage:
        "https://images.unsplash.com/photo-1603123853880-a92fafb7809f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1949&q=80",
      // "https://images.unsplash.com/photo-1613946278314-42c14694434a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      // heroImage2:
      //   "https://images.unsplash.com/photo-1583337426008-2fef51aa841d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2134&q=80",
    };
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
  text-align: center;
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

.hero-image {
  overflow: hidden;
  position: absolute;
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
}
</style>
