<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);

const fname = ref<string | undefined>(undefined);
const lname = ref<string | undefined>(undefined);
const number = ref<string | undefined>(undefined);
const email = ref<string | undefined>(undefined);
const message = ref<string | undefined>(undefined);

async function contact() {
  // Stop function if any of the required inputs are missing
  if (!(fname.value && lname.value && number.value && email.value))
    return alert("All fields are required except 'message'");

  // Disable the button untill API call is done to prevent multiple submissions
  loading.value = true;

  const { getRecaptchaToken } = await import("../recaptcha");
  const token = await getRecaptchaToken("contactUs");

  const { oof } = await import("simpler-fetch");
  const { res, err } = await oof
    .POST(
      (import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : "https://api.ministryofpup.com") + "/contact-us-form"
    )
    .once()
    .header({ "x-recaptcha-token": token })
    .bodyJSON({
      fname: fname.value,
      lname: lname.value,
      number: number.value,
      email: email.value,
      message: message.value,
    })
    .runJSON();

  if (err || !res.ok) {
    console.error(err);

    // If the API call failed for whatever reason, recursively dispatch itself again if user wants to retry.
    confirm(`Error: \n${err}\n\nTry again?`) && contact();
  }

  alert("Saved! We will contact you shortly.");

  // Regardless of API call status, remove loading UIs
  loading.value = false;
}
</script>

<template>
  <section class="section container has-text-left">
    <!-- Extra break spacing so that when navigating with # ids, the navbar's border does not touch the content so closely -->
    <br />

    <!-- Section heading -->
    <div class="column is-full">
      <h1 class="title mb-6" style="color: #e81050">Contact Us</h1>
      <p class="subtitle" style="font-size: 1em; color: grey">
        Leave your details here and we will contact you asap!
        <br />

        Alternatively, you can email us at
        <a href="mailto:ministryofpup@gmail.com" target="_blank">
          ministryofpup@gmail.com
        </a>
      </p>
    </div>

    <div class="column is-full">
      <p class="title is-3">Enter your details</p>
    </div>

    <div class="column is-full">
      <div class="columns is-multiline is-vcentered">
        <div class="column is-one-third">
          <label>
            <b>First name</b>

            <input
              v-model="fname"
              class="input"
              type="text"
              placeholder="E.g. John"
            />
          </label>
        </div>

        <div class="column is-one-third">
          <label>
            <b>Last name</b>

            <input
              v-model="lname"
              class="input"
              type="text"
              placeholder="E.g. Doe"
            />
          </label>
        </div>

        <div class="column is-one-third">
          <label>
            <b>Phone number (+65)</b>

            <input
              v-model="number"
              class="input"
              type="tel"
              pattern="[\s0-9]+"
              min="10000000"
              max="99999999"
              placeholder="E.g. 92345678"
            />
          </label>
        </div>

        <div class="column is-one-third">
          <label>
            <b>Email</b>

            <input
              v-model="email"
              class="input"
              type="text"
              placeholder="E.g. example@gmail.com"
            />
          </label>
        </div>

        <div class="column is-one-third">
          <label>
            <b>Message</b>

            <input
              v-model="message"
              class="input"
              type="text"
              placeholder="Leave a message for us if needed"
            />
          </label>
        </div>

        <div class="column is-one-third">
          <button
            class="button is-fullwidth py-5 is-light is-success"
            :disabled="loading"
            @click="contact"
          >
            Contact Me!
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
