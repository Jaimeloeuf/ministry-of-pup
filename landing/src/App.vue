<template>
  <div id="main">
    <!-- Where app contains the shared components and the router-view component to show the different views -->
    <HeroHead />
    <router-view />
    <Footer />

    <!-- FAB to link to booking site -->
    <a
      href="https://booking.ministryofpup.com/"
      target="_blank"
      class="button is-floating is-success is-light"
    >
      Book Appointment
    </a>
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

/*
  CSS For the Book Appointment FAB modified from
  https://github.com/alakise/bulma-floating-button/blob/master/dist/css/bulma-floating-button.min.css
*/
.button.is-floating {
  position: fixed;
  bottom: 1em;
  right: 1em;
  border-radius: 10em;
  text-align: center;
  font-size: 1.2rem;
  box-shadow: 0 0.0625em 0.125em rgba(10, 10, 10, 0.05);
  z-index: 3;
}
</style>
