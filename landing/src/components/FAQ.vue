<template>
  <section class="section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <!-- Wrapped in a column div class to put it in a single block on the left matching the profile pic columns -->
    <div class="column is-one-quarter">
      <h1 class="title mb-6" style="color: #e81050">FAQ</h1>
      <p class="subtitle mb-6" style="font-size: 1em; color: grey">
        Have a question? Here is some frequently asked stuff
      </p>
    </div>

    <div class="columns is-multiline">
      <div v-for="(faq, i) in faqs" :key="i" class="column is-full">
        <div @click="faq.hide = !faq.hide" class="card" style="cursor: pointer">
          <div class="card-content">
            <p class="subtitle has-text-weight-bold">
              {{ faq.ques }}
            </p>

            <p :class="{ 'is-hidden': faq.hide }">{{ faq.ans }}</p>
          </div>
        </div>
      </div>

      <div class="column is-full">
        <div class="card">
          <div class="card-content">
            <p class="title" style="color: lightcoral">
              Have another question in mind?
              <a
                href="#ContactUs"
                class="button mx-6"
                style="background: lightcoral; color: white"
              >
                Ask us now!
              </a>
            </p>
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
      faqs: [
        {
          ques: "Whats your operating hours?",
          ans: "Mon to Sun, 10am to 8pm",
          hide: true,
        },
        {
          ques: "Where are your puppies from?",
          ans: "United Kingdom",
          hide: true,
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
