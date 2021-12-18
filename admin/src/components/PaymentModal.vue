<template>
  <div class="modal is-active">
    <!-- Modal can be closed by clicking any part of the modal background -->
    <div class="modal-background" @click="close"></div>

    <div class="modal-content">
      <div v-if="paymentMethod === 'Paynow'">
        <!-- Only show the QR Code and payment complete button after the image is generated -->
        <div v-if="imageDataURI">
          <span class="image is-square">
            <img :src="imageDataURI" />
          </span>

          <button
            class="button is-fullwidth is-success is-light py-6"
            @click="paymentComplete"
          >
            Payment Received ({{ receiptNumber }})
          </button>
        </div>
        <div class="box has-text-centered" v-else>
          <p class="title">...Loading...</p>
          <br />

          <p class="subtitle">Generating Paynow QR Code now</p>
        </div>
      </div>

      <div v-else-if="paymentMethod === 'Credit Card'">
        <div class="box">
          <p class="title">Payment Method: Credit Card</p>

          <p class="subtitle">
            Please request for payment from customer.
            <br />
            <br />

            If possible, enter receipt number in the POS terminal for to track
            the transaction.
            <br />
            <br />

            Receipt Number: {{ receiptNumber }}
          </p>
        </div>

        <button
          class="button is-fullwidth is-success is-light py-6"
          @click="paymentComplete"
        >
          Payment Received ({{ receiptNumber }})
        </button>
      </div>

      <div v-else-if="paymentMethod === 'Cash'">
        <div class="box">
          <p class="title">Payment Method: Cash</p>

          <p class="subtitle">Ensure cash payment is received and counted</p>
        </div>

        <button
          class="button is-fullwidth is-success is-light py-6"
          @click="paymentComplete"
        >
          Payment Received
        </button>
      </div>

      <div v-else-if="paymentMethod === 'Others'">
        <div class="box">
          <p class="title">Payment Method: Others</p>

          <p class="subtitle">
            Please request for payment from customer, if possible, ask them to
            include in the receipt number for you to easily verify.
            <br />
            <br />

            For example, ask customer to write receipt number as transaction
            message in a bank direct transfer transaction.
            <br />
            <br />

            Receipt Number: {{ receiptNumber }}
          </p>
        </div>

        <button
          class="button is-fullwidth is-success is-light py-6"
          @click="paymentComplete"
        >
          Payment Received ({{ receiptNumber }})
        </button>
      </div>

      <!-- This case should normally not appear unless there is a bug -->
      <div v-else>
        <div class="box">
          <p class="subtitle">
            INTERNAL ERROR: Invalid payment method selected
            <br />
            Please ensure payment method field is correctly selected!
          </p>
        </div>

        <!-- Button resets payment method to the default payment method and closes the modal -->
        <button
          class="button is-fullwidth is-success is-light py-6"
          @click="(paymentMethod = 'Paynow') && close()"
        >
          Reset payment method & Close
        </button>
      </div>
    </div>

    <!-- Modal can be closed by clicking the top right X -->
    <button class="modal-close is-large" aria-label="close" @click="close" />
  </div>
</template>

<script>
export default {
  name: "PaymentModal",

  props: ["amount", "paymentMethod", "receiptNumber"],

  created() {
    // If paynow is the selected payment method, trigger method to generate the QR Code image
    if (this.paymentMethod === "Paynow") this.showPaynowQR();
  },

  data() {
    return { imageDataURI: undefined };
  },

  methods: {
    close() {
      this.$emit("close-modal");
    },

    paymentComplete() {
      this.$emit("payment-complete");
    },

    async showPaynowQR() {
      const { default: PaynowQR } = await import("paynowqr");

      // The QR Code should only be valid for 1 hour
      // 60 minutes * 60 seconds * 1000 milliseconds = 3600000 milliseconds
      const d = new Date(new Date().getTime() + 3600000);
      const month = d.getMonth() + 1; // +1 as getMonth is 0 indexed where 0 is Jan
      const pmonth = month > 9 ? month : `0${month}`; // Month with 0 padding
      const date = d.getDate();
      const pdate = date > 9 ? date : `0${date}`; // Date with 0 padding
      const expiryDate = `${d.getFullYear()}${pmonth}${pdate}`;

      //Create a PaynowQR object
      const paynowQRCode = new PaynowQR({
        amount: this.amount,

        // Required: UEN of company, hard coded in as it will not be changed
        uen: "T17LL2360H",

        // Set an expiry date that is only valid for 1 day
        expiry: expiryDate,

        // @todo Call and API to generate a invoice reference number to track later (possibly have the paynow bank app on the ipad)
        // Reference number for Paynow Transaction. Useful if you need to track payments for recouncilation.
        refNumber: this.receiptNumber,
      });

      // Generate the QR code image data URL and set onto component data value
      this.imageDataURI = await import("qrcode").then((QRCode) =>
        QRCode.toDataURL(
          // Generate UTF-8 string from the qrcode to generate the QR code data URL for the image tag
          paynowQRCode.output(),

          // Use high error resistance rate of ~ 30%
          { errorCorrectionLevel: "H" }
        )
      );
    },
  },
};
</script>
