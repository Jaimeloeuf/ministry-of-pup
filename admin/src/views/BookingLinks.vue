<template>
  <div class="columns is-multiline is-vcentered" style="max-width: 50em">
    <div class="column">
      <p class="subtitle">Various links to the booking site</p>
    </div>

    <div class="column is-narrow">
      <p class="subtitle has-text-success" v-if="showCopied">Copied!</p>
    </div>

    <div class="column is-narrow">
      <label class="checkbox">
        <input type="checkbox" v-model="showQRCode" />
        Show QR
      </label>
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

    <div class="modal" :class="{ 'is-active': showModal }">
      <!-- Modal can be closed by clicking any part of the modal background -->
      <div class="modal-background" @click="showModal = false"></div>

      <!-- Modal can be closed by clicking any part of the modal image -->
      <div class="modal-content" @click="showModal = false">
        <span class="image is-square">
          <img :src="imageDataURI" />
        </span>
      </div>

      <!-- Modal can be closed by clicking the top right X -->
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="showModal = false"
      />
    </div>
  </div>
</template>

<script>
import appointmentSource from "mop-appointment-src";

export default {
  name: "BookingLinks",

  methods: {
    // Cannot be used directly in the template as navigator is not available in that context
    copy(link) {
      if (this.showQRCode) this.showQR(link);
      else
        navigator.clipboard.writeText(link).then(() => {
          this.showCopied = true;

          setTimeout(() => (this.showCopied = false), 1100);
        });
    },

    async showQR(link) {
      const QRCode = await import("qrcode");

      // Generate the QR code image data URL and set onto component data value
      this.imageDataURI = await QRCode.toDataURL(
        link,

        // Use high error resistance rate of ~ 30%
        { errorCorrectionLevel: "H" }
      );

      // Open up modal to show the QR Code image
      this.showModal = true;
    },
  },

  data() {
    // Remove UNdefined option from appointment source links first
    delete appointmentSource.UN;

    return {
      showCopied: false,

      showQRCode: false,
      showModal: false,
      imageDataURI: undefined,

      links: [
        // Map the appointment source key, values to objects of text and booking link
        ...Object.entries(appointmentSource).map(([key, text]) => ({
          text,
          link: `https://booking.ministryofpup.com/#/?src=${key}`,
        })),

        // Extra link for the booking site without any tracking / location param
        {
          text: "No Tracker",
          link: "https://booking.ministryofpup.com/",
        },
      ],
    };
  },
};
</script>
