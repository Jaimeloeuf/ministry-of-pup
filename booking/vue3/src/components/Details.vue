<template>
  <div class="px-5 py-5">
    <div class="columns is-multiline box">
      <div class="column is-full">
        <p class="title is-3">Enter your details</p>
      </div>

      <div class="column is-full">
        <div class="columns is-multiline">
          <div class="column is-full">
            <label>
              <b>First name</b>

              <input
                class="input"
                type="text"
                v-model="fname"
                placeholder="E.g. John"
              />
            </label>
          </div>

          <div class="column is-full">
            <label>
              <b>Last name</b>

              <input
                class="input"
                type="text"
                v-model="lname"
                placeholder="E.g. Doe"
              />
            </label>
          </div>

          <div class="column is-full">
            <label>
              <b>Phone number (+65)</b>

              <input
                class="input"
                type="tel"
                pattern="[\s0-9]+"
                min="10000000"
                max="99999999"
                v-model="number"
                placeholder="E.g. 92345678"
              />
            </label>
          </div>

          <div class="column is-full">
            <label>
              <b>Email</b>

              <input
                class="input"
                type="text"
                v-model="email"
                placeholder="E.g. example@gmail.com"
              />
            </label>
          </div>

          <div class="column is-full">
            <label>
              <b>Preference</b>
              <br />

              <textarea
                v-model="preference"
                class="textarea"
                placeholder="Optional preferences, tell us what you like!
E.g. Cream coloured / French bulldogs / Female dog"
              />
            </label>
          </div>

          <div class="column is-half">
            <button class="button is-fullwidth py-5" @click="$router.back">
              Back
            </button>
          </div>

          <div class="column is-half">
            <button
              class="button is-fullwidth py-5 is-light is-success"
              @click="book"
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Details",

  data() {
    return {
      fname: undefined,
      lname: undefined,
      number: undefined,
      email: undefined,
      preference: undefined,
    };
  },

  methods: {
    async book() {
      if (!(fname && lname && number && email))
        return alert("All fields are required except 'preference'");

      this.$store.commit("loading", true);

      this.$store.commit("setter", [
        "details",
        {
          fname: this.fname,
          lname: this.lname,
          number: this.number,
          email: this.email,
        },
      ]);

      this.$store.commit("setter", ["preference", this.preference || ""]);

      await this.$store.dispatch("book");

      this.$store.commit("loading", false);
      this.$router.push({ name: "complete" });
    },
  },
};
</script>
