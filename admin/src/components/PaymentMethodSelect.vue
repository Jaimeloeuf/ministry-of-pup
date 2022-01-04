<template>
  <label>
    <b>Payment Method</b>
    <br />

    <div class="select is-fullwidth">
      <select v-on:change="update">
        <option
          v-for="method in availablePaymentMethods"
          :value="method"
          :key="method"
          :selected="method === value"
        >
          {{ method }}
        </option>
      </select>
    </div>
  </label>
</template>

<script>
export default {
  name: "PaymentModalSelect",

  props: ["value"],

  data() {
    return {
      availablePaymentMethods: ["Paynow", "Credit Card", "Cash", "Others"],
    };
  },

  created() {
    // On component creation, set the v-model value used by parent component to default payment method
    // Payment method always defaults to the first payment method in list of available payment methods
    this.$emit("input", this.availablePaymentMethods[0]);
  },

  methods: {
    update(event) {
      this.$emit("input", event.target.value);
    },
  },
};
</script>
