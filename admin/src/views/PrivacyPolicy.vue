<template>
  <div class="columns is-multiline is-vcentered" style="max-width: 50em">
    <div class="column">
      <p class="subtitle">Privacy Policy</p>
    </div>

    <div class="column is-narrow">
      <p class="subtitle has-text-success" v-if="showCopied">Copied!</p>
    </div>

    <div class="column is-full">
      <hr class="my-0" style="background-color: #dedede" />
    </div>

    <div class="column is-full">
      <button class="button" @click="showQR">Show QR code to link</button>
    </div>

    <div class="column is-full">
      <button class="button" @click="copy">Copy {{ link }}</button>
    </div>

    <div class="column is-full">
      <a class="button" target="_blank" :href="link">Open {{ link }}</a>
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
export default {
  name: "PrivacyPolicy",

  methods: {
    // Cannot be used directly in the template as navigator is not available in that context
    copy() {
      navigator.clipboard.writeText(this.link).then(() => {
        this.showCopied = true;

        setTimeout(() => (this.showCopied = false), 1100);
      });
    },

    async showQR() {
      const QRCode = await import("qrcode");

      // Generate the QR code image data URL and set onto component data value
      this.imageDataURI = await QRCode.toDataURL(
        this.link,

        // Use high error resistance rate of ~ 30%
        { errorCorrectionLevel: "H" }
      );

      // Open up modal to show the QR Code image
      this.showModal = true;
    },
  },

  data() {
    return {
      link: "https://ministryofpup.com/dpn.pdf",

      showCopied: false,
      showModal: false,
      imageDataURI: undefined,
    };
  },
};
</script>
