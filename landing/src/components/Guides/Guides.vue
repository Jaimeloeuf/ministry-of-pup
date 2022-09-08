<script setup lang="ts">
const guides = [
  {
    link: { name: "guides-new-pawrent" },
    text: "Getting started as a new Pawrent!",
  },
  {
    link: { name: "guides-new-pawrent" },
    text: "Recommended food for puppies",
  },
  {
    link: { name: "guides-new-pawrent" },
    text: "Vaccinations",
  },
  {
    link: { name: "guides-new-pawrent" },
    text: "Visiting the vet",
  },
  {
    link: { name: "guides-new-pawrent" },
    text: "Staying well groomed",
  },
];
</script>

<template>
  <section class="hero is-fullheight section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <h1 class="title" style="color: #e81050">For New Pawrents</h1>
    <p class="subtitle" style="font-size: 1em; color: grey">
      How to get started as a new Dog Owner?
    </p>

    <div class="content is-medium">
      <p class="subtitle">Here are some Guides</p>

      <ul>
        <li v-for="(guide, i) in guides" :key="i">
          <router-link class="box" :to="guide.link">
            {{ guide.text }}
          </router-link>
        </li>
      </ul>
    </div>
  </section>
</template>

<style>
li:not(:last-child) {
  margin-bottom: 1.6em;
}
</style>
