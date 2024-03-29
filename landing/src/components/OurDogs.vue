<script setup lang="ts">
import { ref } from "vue";
import { oof } from "simpler-fetch";

// Not the full type but just enough for all the values used in this view
type Dog = {
  imgSrc: Array<string>;
  name: string;
  breed: string;
  reserved: boolean;
};

const dogs = ref<Array<Dog> | undefined>(undefined);

// Function to get dogs from 'gapi'
async function getDogs() {
  const { getRecaptchaToken } = await import("../recaptcha");
  const token = await getRecaptchaToken("loadDogs");

  const { res, err } = await oof
    .GET(
      import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : "https://gapi.ministryofpup.com"
    )
    .once()
    .header({ "x-recaptcha-token": token })
    .runJSON();

  // Currently, the user does not have an option to retry if it fails, so to retry they have to reload page
  if (err || !res.ok) {
    // @todo Show a unable to load dogs UI on failure

    // Break out of the function
    return console.error(err);
  }

  dogs.value = res.dogs;
}

// Trigger getDogs just before setup script exits to fire and let getDogs run in the background
getDogs();
</script>

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

      <!-- Show loading card if dogs are not loaded yet -->
      <div v-if="dogs === undefined" class="column is-3">
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
