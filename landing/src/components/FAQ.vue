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
      <div v-for="(faq, i) in faqs" :key="i" class="column is-4">
        <div @click="faq.show = !faq.show" class="card" style="cursor: pointer">
          <div class="card-content">
            <p class="subtitle has-text-weight-bold">
              {{ faq.ques }}
            </p>

            <!-- <span v-if="faq.show" v-html="faq.ans">{{ faq.ans }}</span> -->
            <span v-if="faq.show" v-html="faq.ans"></span>
          </div>
        </div>
      </div>

      <div class="column is-full" />

      <div class="column is-8">
        <div class="card">
          <div class="card-content">
            <p class="title" style="color: lightcoral">
              Have another question in mind?
              <br />
              <br />
              <a
                href="#ContactUs"
                class="button is-flex-mobile"
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
          show: false,
        },
        {
          ques: "Where are your puppies from?",
          ans: "United Kingdom!",
          show: false,
        },
        {
          ques: "Do you have pedigree dogs?",
          ans:
            "Yes we do! See the listing details for each dog, and you can learn more during your on site viewing session",
          show: false,
        },
        {
          ques: "What type of dogs do you have?",
          ans:
            "Primarily French Bulldogs and Shiba Inus, but you can let us know what you are looking for via our booking system and we will notify you when we find a dog that suits your preferences.",
          show: false,
        },
      ],
    };
  },
};
</script>
