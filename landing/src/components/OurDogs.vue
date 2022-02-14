<template>
  <section class="section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <div class="column is-one-quarter">
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
              <img
                loading="lazy"
                :src="require(`../assets/dog_pics/${dog.imageSrc}.jpg`)"
                :alt="dog.name"
              />

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
            <p class="subtitle">{{ dog.title }}</p>
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
      dogs: [
        {
          name: "Frank",
          title: "French Bulldog",
          imageSrc: "8",
        },
        {
          name: "Mochi",
          title: "French Bulldog",
          imageSrc: "0",
        },
        {
          name: "Gus",
          title: "Pug",
          imageSrc: "10",
        },
        {
          name: "Kellog",
          title: "Black Cockapoo",
          imageSrc: "11",
        },
      ],
    };
  },
};
</script>
