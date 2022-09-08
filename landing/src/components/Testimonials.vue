<template>
  <section class="section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <div class="column">
      <h1 class="title mb-6" style="color: #e81050">Customer Testimonials</h1>
      <p class="subtitle mb-6" style="font-size: 1em; color: grey">
        Hear from fellow Pawrents!
      </p>
    </div>

    <!-- Unselectable testimonial text to make it easier to swipe -->
    <div
      v-touch:swipe.left="next"
      v-touch:swipe.right="prev"
      class="column"
      style="
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
      "
    >
      <!-- @todo Add translucent arrows -->
      {{ testimonials[currentTestimonial] }}
    </div>

    <!-- Centered dots to show the different testimonials -->
    <div class="column has-text-centered">
      <div class="control">
        <label v-for="i in testimonials.length" :key="i" class="radio">
          <input
            type="radio"
            name="currentTestimonial"
            :checked="currentTestimonial === i - 1"
            @click="clickHandler(i - 1)"
          />
        </label>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Testimonials",

  data() {
    return {
      // Stores ID for a timeout
      timeout: undefined,

      currentTestimonial: 0,

      testimonials: [
        "When we went to Ministry of Pup, we were amazed by the MOP team on their willingness and patience to share their wealth of knowledge and passion. The place was very clean and they bring in dogs with good health checks to ensure their customers are assured. MOP also provides good after-sale service and this puts us as first time pet owners at ease to know there's someone we can ask for help or guidance for our puppy to settle down well. Thanks a lot! We had a great experience with you! - Merlvin Tan",

        "Getting my frenchie from the Ministry of Pup has been a wonderful experience! Being a first-time owner , there were lots of jitters  and anxiety involved; thankfully, the owners at the Ministry Of Pup are understanding and sensitive  to my needs. They also provide good after care service - checking in to make sure we survived the first night and more.!  :) Will recommend MOM to anyone who looking for a loving and happy doggie to join their family. -Diana",

        "We were looking for puppies by the time we first landed in singapore and found a few pet shop to find our dog to bring us together as a family. from all the pet shop we came to, only one that stands out the most. We didn't initially thought of having a frenchie but when we came to The ministry of pup, The little frenchie we first laid eyes on made us fall in love with his big beautiful eyes and his personality. What makes the ministry of pup stands out the most is that they treat their furkids like family. The shop is super clean and the owners are also very welcoming and friendly, Even though after we brought our pup home, they still keep in touch with us. To be honest this is the best pet shop I have ever seen. I would highly recommend for you guys to visit the shop and just spend time there to feel what exactly I am telling you right now. - Louie's Pawrents",

        "As a family who loves pets, especially for dogs, we missed our pets that we left back in the Philippines. As an OFW, it is extremely difficult for us to own a dog here in Singapore. Then we crossed paths with James and Angelynn, the owners of Ministry of Pups, the warm hearted couple who helped and assisted us with all possibilities so we can adopt our little bella.  A very affectionate, smart and lovely french bulldog. We will be forever grateful to Ministry of Pup and to a friendship that we will treasure for the rest of our lives. - Jon, Sarah and Zion",
      ],
    };
  },

  mounted() {
    // Set the starting testimonial to be a random one between all available testimonials
    this.currentTestimonial = Math.floor(
      Math.random() * this.testimonials.length
    );

    // this.createTimeout();
  },

  methods: {
    // createTimeout() {
    //   this.timeout = setTimeout(() => {
    //     if (this.currentTestimonial < this.testimonials.length - 1)
    //       this.currentTestimonial += 1;
    //     else this.currentTestimonial = 0;

    //     // Once the new testimonial is set, create a new timeout again
    //     this.createTimeout();
    //   }, 7000);
    // },

    next() {
      if (this.currentTestimonial < this.testimonials.length - 1)
        this.currentTestimonial += 1;
      else this.currentTestimonial = 0;
    },

    prev() {
      if (this.currentTestimonial > 0) this.currentTestimonial -= 1;
      else this.currentTestimonial = this.testimonials.length - 1;
    },

    clickHandler(index) {
      // Clear the current timeout first
      // clearTimeout(this.timeout);

      // Set the new current testimonial
      this.currentTestimonial = index;

      // Create a new timeout
      // this.createTimeout();
    },
  },
};
</script>
