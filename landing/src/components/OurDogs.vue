<template>
  <section class="section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <div class="column">
      <h1 class="title mb-6" style="color: #e81050">Our Lovely Dogs</h1>
      <p class="subtitle mb-6" style="font-size: 1em; color: grey">
        Fall in love with these pups at first sight
      </p>
    </div>

    <div class="columns is-multiline">
      <!-- At most 4 per row, as 12/3==4 -->
      <div v-for="(dog, i) in dogs" :key="i" class="column is-3">
        <div class="card">
          <div class="card-image">
            <figure class="image">
              <!-- Use native lazy loading, on none supported devices, fallback to eager loading. -->
              <img loading="lazy" :src="dog.imgSrc[0]" :alt="dog.name" />

              <!-- <div>
                <ul>
                  <li
                    v-for="(social, i) in dog.social"
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
            <p class="title">{{ dog.name }}</p>
            <p class="subtitle mb-0 pb-0">{{ dog.breed }}</p>
            <p v-if="dog.reserved" style="opacity: 0.7; color: red">Reserved</p>
          </div>
        </div>
      </div>

      <!-- Show loading card if there is dogs are not loaded yet. Assuming always at least 1 dog available -->
      <div class="column is-3" v-if="dogs.length === 0">
        <div class="card">
          <div class="card-content">
            <p class="subtitle" style="color: lightcoral">
              Loading our lovely dogs...
            </p>
          </div>
        </div>
      </div>

      <div class="column is-3">
        <div class="card">
          <div class="card-content">
            <p class="title" style="color: lightcoral">
              Want to have your own puppy?
            </p>
            <a
              href="https://booking.ministryofpup.com"
              class="button is-fullwidth"
              target="_blank"
              style="background: lightcoral; color: white"
            >
              Book Appointment
            </a>
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
import { oof } from "simpler-fetch";

export default {
  name: "OurDogs",

  data() {
    return { dogs: [] };
  },

  created() {
    this.loadDogs();
  },

  methods: {
    // Function to load the dogs' data from firestore using a cloud function
    async loadDogs() {
      try {
        const token = await new Promise((resolve, reject) =>
          window.grecaptcha.ready(() =>
            window.grecaptcha
              .execute("6Lcex6QcAAAAADus4RtnoqwskQoXcB2DwgCav11Z", {
                action: "loadDogs",
              })
              .then(resolve)
              .catch(reject)
          )
        );

        const res = await oof
          .GET(
            process.env.NODE_ENV === "production"
              ? "https://asia-southeast1-ministryofpup-ekd.cloudfunctions.net/getDogs"
              : "http://localhost:5001/ministryofpup-ekd/asia-southeast1/getDogs"
          )
          .header({ "x-recaptcha-token": token })
          .runJSON();

        if (!res.ok) throw new Error(res.error);
        this.dogs = res.dogs;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
