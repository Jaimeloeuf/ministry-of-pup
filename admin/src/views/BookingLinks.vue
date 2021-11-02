<template>
  <div class="columns is-multiline is-vcentered" style="max-width: 50em">
    <div class="column">
      <p class="subtitle">Various links to the booking site</p>
    </div>

    <div class="column is-narrow">
      <p class="subtitle has-text-success" v-if="showCopied">Copied!</p>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <!-- @todo Allow admin to create new links for specific campaigns -->

    <div class="column is-full">
      <b>Click to copy the link</b>
    </div>

    <div class="column is-narrow" v-for="(link, i) in links" :key="i">
      <button
        class="button"
        :class="{ 'is-light': i & 1 }"
        @click="copy(link.link)"
      >
        {{ link.text }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookingLinks",

  methods: {
    // Cannot be used directly in the template as navigator is not available in that context
    copy(link) {
      navigator.clipboard.writeText(link).then(() => {
        this.showCopied = true;

        setTimeout(() => (this.showCopied = false), 1100);
      });
    },
  },

  data() {
    return {
      showCopied: false,

      // Might load this from DB...?
      links: [
        {
          text: "Whatsapp",
          link: "https://booking.ministryofpup.com/#/?ref=WA",
        },
        {
          text: "Facebook",
          link: "https://booking.ministryofpup.com/#/?ref=FB",
        },
        {
          text: "Instagram",
          link: "https://booking.ministryofpup.com/#/?ref=IG",
        },
        { text: "WeChat", link: "https://booking.ministryofpup.com/#/?ref=WC" },
        { text: "Google", link: "https://booking.ministryofpup.com/#/?ref=GG" },
        {
          text: "Friend Referral",
          link: "https://booking.ministryofpup.com/#/?ref=RF",
        },
        {
          text: "Others / Unknown",
          link: "https://booking.ministryofpup.com/#/?ref=OT",
        },
        {
          text: "No Tracker",
          link: "https://booking.ministryofpup.com/",
        },
      ],
    };
  },
};
</script>
