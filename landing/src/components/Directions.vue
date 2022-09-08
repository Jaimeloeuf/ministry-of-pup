<script setup lang="ts"></script>

<template>
  <section class="section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <h1 class="title" style="color: #e81050">Directions</h1>
    <p class="subtitle" style="font-size: 1em; color: grey">
      Where is Ministry Of Pup?
    </p>

    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.827630737846!2d103.83407531475387!3d1.2768469990687092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da193871b0cab7%3A0x8e0ceb011e0b9fbe!2sMinistry%20Of%20Pup!5e0!3m2!1sen!2ssg!4v1636817519233!5m2!1sen!2ssg"
      width="100%"
      height="500"
      style="border: 0"
      allowfullscreen=""
      loading="lazy"
    />

    <p class="subtitle is-3 mt-5" style="color: gray">Getting here</p>

    <div class="columns is-multiline">
      <div class="column is-one-third">
        <a
          class="button is-light is-fullwidth"
          href="https://goo.gl/maps/tC2LnVXhAQ1dYSWE8"
          target="_blank"
        >
          Driving (How to come from carpark)
        </a>
      </div>

      <div class="column is-one-third">
        <a
          class="button is-light is-fullwidth"
          href="https://www.google.com/maps/dir/Outram+Road,+Outram+Park+MRT+Station+(EW16),+Singapore/Kampong+Bahru+Road,+Ministry+Of+Pup,+Singapore/@1.2789184,103.8355479,17z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x31da199c2c3270b1:0xc23769edf0d9b8a0!2m2!1d103.8391239!2d1.2813358!1m5!1m1!1s0x31da193871b0cab7:0x8e0ceb011e0b9fbe!2m2!1d103.836264!2d1.276847!3e3"
          target="_blank"
        >
          Public Transport (From Outram Park MRT)
        </a>
      </div>

      <div class="column is-one-third">
        <a
          class="button is-light is-fullwidth"
          href="https://www.google.com/maps/dir/Outram+Road,+Outram+Park+MRT+Station+(EW16),+Singapore/Kampong+Bahru+Road,+Ministry+Of+Pup,+Singapore/@1.2791394,103.8373016,18z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x31da199c2c3270b1:0xc23769edf0d9b8a0!2m2!1d103.8391239!2d1.2813358!1m5!1m1!1s0x31da193871b0cab7:0x8e0ceb011e0b9fbe!2m2!1d103.836264!2d1.276847!3e2"
          target="_blank"
        >
          Walking (From Outram Park MRT)
        </a>
      </div>
    </div>
  </section>
</template>
