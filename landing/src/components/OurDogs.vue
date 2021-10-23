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
      <div v-for="(dogs, i) in dogss" :key="i" class="column is-3">
        <div class="card">
          <div class="card-image">
            <figure class="image is-square">
              <!-- Use native lazy loading, on none supported devices, fallback to eager loading. -->
              <img
                loading="lazy"
                :src="require(`../assets/dog_pics/${dogs.imageSrc}.jpg`)"
                :alt="dogs.name"
              />

              <!-- <div>
                <ul>
                  <li
                    v-for="(social, i) in dogs.social"
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
            <p class="title">{{ dogs.name }}</p>
            <p class="subtitle">{{ dogs.title }}</p>
          </div>
        </div>
      </div>

      <div class="column is-3">
        <div class="card">
          <div class="card-content">
            <p class="title" style="color: lightcoral">
              Love dogs?
              <br />
              <br />
              Book a play session now!
            </p>
            <a
              href="https://booking.ministryofpup.com"
              class="button is-fullwidth"
              target="_blank"
              style="background: lightcoral; color: white"
            >
              Book appointment
            </a>
          </div>
        </div>
      </div>

      <!-- @todo Google form first? -->
      <!-- Or a form built in landing page, that submits to API and save in DB + notify in tele -->
      <div class="column is-3">
        <div class="card">
          <div class="card-content">
            <p class="title" style="color: lightcoral">
              Have a special dog you want?
            </p>
            <a
              href="#ContactUs"
              class="button is-fullwidth"
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
      dogss: [
        {
          name: "Mochi",
          title: "French Bulldog",
          imageSrc: "dog",
        },
        {
          name: "Skyy",
          title: "French Bulldog",
          imageSrc: "dog",
        },
        {
          name: "Mochirooooo",
          title: "Shiba Inu",
          imageSrc: "dog1",
        },
        {
          name: "Jinny",
          title: "Shiba Inu",
          imageSrc: "dog2",
        },
        {
          name: "Oliy",
          title: "Shiba Inu",
          imageSrc: "dog2",
        },
      ],
    };
  },
};
</script>
