<script setup>
// import "bulma";
// Load the bulma styles in the top level component
import "bulma/css/bulma.min.css";
</script>

<template>
  <router-view></router-view>
</template>

<style>
html {
  /* background: linear-gradient(#e66465, #9198e5); */

  background: #bdc3c7; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #2c3e50,
    #a6a8a8
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #2c3e50,
    #a6a8a8
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
