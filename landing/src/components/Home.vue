<template>
  <div>
    <section class="hero is-fullheight">
      <img :src="heroImage" alt="Hero" class="image hero-image" />
      <HeroBody />
    </section>

    <Testimonials id="Testimonials" />
    <OurDogs id="OurDogs" />
    <FAQ id="FAQ" />
    <ContactUs id="ContactUs" />
    <AboutUs id="AboutUs" />
  </div>
</template>

<script>
import HeroBody from "./HeroBody.vue";
import Testimonials from "./Testimonials.vue";
import OurDogs from "./OurDogs.vue";
import ContactUs from "./ContactUs.vue";
import AboutUs from "./AboutUs.vue";
import FAQ from "./FAQ.vue";

export default {
  name: "Home",
  components: {
    HeroBody,
    Testimonials,
    OurDogs,
    ContactUs,
    AboutUs,
    FAQ,
  },
  data() {
    return {
      heroImage:
        "https://images.unsplash.com/photo-1603123853880-a92fafb7809f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1949&q=80",
      // "https://images.unsplash.com/photo-1613946278314-42c14694434a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      // "https://images.unsplash.com/photo-1583337426008-2fef51aa841d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2134&q=80",
    };
  },
};
</script>
