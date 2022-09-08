<script setup lang="ts">
const faqs = [
  {
    ques: "What is your operating hours?",
    ans: "Mon to Sun, 11am to 8pm by appointment only. Book your appointment <a href='https://booking.ministryofpup.com'>here</a>.",
    show: false,
  },
  {
    ques: "Where are your puppies from?",
    ans: "United Kingdom!",
    show: false,
  },
  {
    ques: "Do you have pedigree dogs?",
    ans: "Yes we do! See the listing details for each dog, and you can also learn more during your on site play session with the dogs.",
    show: false,
  },
  {
    ques: "What type of dogs do you have?",
    ans: "Primarily French Bulldogs and Shiba Inus, but you can let us know what you are looking for via our booking system and we will notify you when we find a dog that suits your preferences.",
    show: false,
  },
];
</script>

<template>
  <section class="section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <div class="column is-one-quarter">
      <h1 class="title mb-6" style="color: #e81050">FAQ</h1>
      <p class="subtitle mb-6" style="font-size: 1em; color: grey">
        Have a question? Here is some frequently asked stuff
      </p>
    </div>

    <div class="columns is-multiline">
      <div class="column is-4">
        <router-link class="box" :to="{ name: 'directions' }">
          <p class="subtitle has-text-weight-bold">Where is Ministry Of Pup?</p>
        </router-link>
      </div>

      <div v-for="(faq, i) in faqs" :key="i" class="column is-4">
        <div class="box" style="cursor: pointer" @click="faq.show = !faq.show">
          <p class="subtitle has-text-weight-bold" v-html="faq.ques" />
          <span v-if="faq.show" v-html="faq.ans"></span>
        </div>
      </div>

      <div class="column is-4">
        <router-link class="box" :to="{ name: 'guides-new-pawrent' }">
          <p class="subtitle has-text-weight-bold">
            How to get started as a Pawrent?
          </p>
        </router-link>
      </div>

      <div class="column is-full" />

      <div class="column is-one-third">
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
