<template>
  <section class="section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <!-- Wrapped in a column div class to put it in a single block on the left matching the profile pic columns -->
    <div class="column is-one-quarter">
      <h1 class="title mb-6" style="color: #e81050">About Us</h1>
      <p class="subtitle mb-6" style="font-size: 1em; color: grey">
        Who are we and why are we doing this?
      </p>
    </div>

    <div class="column is-multiline">
      <p>
        Ministry of Pup is created by Angelynn and Cloris when they took a leap
        of faith to leave their full time jobs in retail and education in early
        2021, to set up a home for <i>Pawrents</i> to find their <i>Furkids</i>.
        It was not an easy decision to venture into this new journey, but being
        dog lovers, they envisage to reduce pet abandonment rates and provide
        support for their owners.
      </p>
      <br />

      <p>
        The setup took nearly a year to complete, as it took comprehensive
        planning to ensure responsible breeding and help customers learn how to
        improve their pet's well-being. We strive to break away from how
        conventional pet shops operate, to create a new normal aimed at
        improving pet's welfare and to provide continuous support to our
        customers.
      </p>
      <br />

      <p>
        Cloris and Angelynn have over a decade of experience as <i>Pawrents</i>.
        We had our fair share of bad experience in dealing with irresponsible
        breeders who were purely profit driven. We believe it is our
        responsibility to provide care and support even after our pets have
        found their forever home. Owning a pet should be fulfilling and
        enjoyable while being stress free.
      </p>
      <br />

      <p>
        We live by the phrase,
        <i>
          "You have everything in the world, however, in the eyes of your pet.
          You are the world to them"
        </i>
      </p>
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
