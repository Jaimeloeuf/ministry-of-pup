<template>
  <!-- Hero content: will be in the middle -->
  <div class="hero-body">
    <div class="container has-text-left">
      <h2 class="title is-4">
        <!-- <span class="title-bg" style="color: #f7941d">Ministry Of Pup</span> -->
        <span class="title-bg title-color">Ministry Of Pup</span>
      </h2>
      <h2 class="subtitle">
        <span class="title-bg title-color">Premium Pet Boutique</span>
      </h2>

      <router-link :to="{ name: 'home', hash: '#OurDogs' }">
        <figure class="scroll-icon">
          <svg
            version="1.1"
            id="ico-arrow"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="-1002.3 627.3 47 47"
            enable-background="new -1002.3 627.3 47 47"
            xml:space="preserve"
          >
            <line
              class="svg__ico"
              fill="none"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-miterlimit="10"
              x1="-1002.3"
              y1="650.8"
              x2="-956.7"
              y2="650.8"
            />
            <path
              class="svg__ico"
              fill="none"
              stroke="#FFFFFF"
              stroke-width="2"
              stroke-miterlimit="10"
              d="M-979.5,673.6l22.8-22.8l-22.8-22.8"
            />
          </svg>
        </figure>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeroBody",
};
</script>

<style scoped>
.title-color {
  /* color: #2c2c2c; */
  color: white;
}

.scroll-icon {
  width: 3.5rem;
  height: auto;
  transform: rotate(90deg);
  color: #fcbe4c;
}
.title-bg {
  padding: 0 0.2em 0.1em 0.2em;
  border-radius: 0.1em;
}
</style>
