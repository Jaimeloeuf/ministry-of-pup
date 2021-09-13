<template>
  <section class="section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <!-- Wrapped in a column div class to put it in a single block on the left matching the profile pic columns -->
    <div class="column is-one-quarter">
      <h1 class="title mb-6" style="color: #e81050">Our Lovely Dogs</h1>
      <p class="subtitle mb-6" style="font-size: 1em; color: grey">
        Fall in love with these pups at first sight
      </p>
    </div>

    <div class="columns is-multiline">
      <!-- At most 4 per row, as 12/3==4 -->
      <div v-for="(teamMember, i) in teamMembers" :key="i" class="column is-3">
        <div class="card">
          <div class="card-image">
            <figure class="image is-square">
              <!-- Use native lazy loading, on none supported devices, fallback to eager loading. -->
              <img
                loading="lazy"
                :src="require(`../assets/dog_pics/${teamMember.imageSrc}.jpg`)"
                :alt="teamMember.name"
              />

              <!-- Social media links, only shown on hover for desktop and shown on click for mobile -->
              <!-- <div class="overlay" width="2em">
                <ul>
                  <li
                    v-for="(social, i) in teamMember.social"
                    :key="i"
                    v-html="social.icon"
                  >
                    <a :href="social.link" target="_blank" />
                  </li>
                </ul>
              </div> -->
            </figure>
          </div>
          <div class="card-content">
            <p class="title">{{ teamMember.name }}</p>
            <p class="subtitle">{{ teamMember.title }}</p>
          </div>
        </div>
      </div>

      <div class="column is-3">
        <div class="card">
          <div class="card-content">
            <p class="title" style="color: lightcoral">
              Have a special dog you want?
            </p>
            <a
              href="#ContactUs"
              class="button"
              style="background: lightcoral; color: white"
            >
              Tell us now!
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "OurDogs",

  data() {
    return {
      teamMembers: [
        {
          name: "Catherine",
          title: "French Bulldog",
          imageSrc: "dog",
        },
        {
          name: "Joshua",
          title: "French Bulldog",
          imageSrc: "dog",
        },
        {
          name: "Nicholas",
          title: "Shiba Inu",
          imageSrc: "dog1",
        },
        {
          name: "Jin",
          title: "Shiba Inu",
          imageSrc: "dog2",
        },
        {
          name: "Olivia",
          title: "Shiba Inu",
          imageSrc: "dog2",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* The overlay effect - lays on top of the container and over the image */
.overlay {
  position: absolute;
  /* bottom: 0; */
  right: 100;

  /* Pink see-through */
  background: rgba(255, 103, 103, 0.8);

  /* Color of the icons */
  color: white;
  opacity: 0;

  transition: 0.5s ease;

  width: 100%;
  font-size: 1.4em;
  padding: 0.2em;
  /* text-align: center; */
}

/* When you mouse over the container, fade in the overlay title */
.container:hover .overlay {
  opacity: 1;
}
</style>
