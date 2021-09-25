<template>
  <input
    class="input"
    type="datetime-local"
    :min="currentDatetime"
    v-bind:value="value"
    v-on:input="onUpdate($event.target.value)"
  />
</template>

<script>
// Generate current date time used as the default date time value
// Formatted for input tag of 'datetime-local' type
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
const currentDatetime = now.toISOString().slice(0, 16);

export default {
  name: "DatetimePicker",

  props: {
    value: {
      default: currentDatetime,
    },
  },

  data() {
    return { currentDatetime };
  },

  // Emit default datetime on mounted, so if parent component uses v-model with a undefined variable by default,
  // it will get the default datetime value immediately even if user choose not to edit the date time.
  mounted() {
    this.$emit("input", currentDatetime);
  },

  methods: {
    onUpdate(datetime) {
      this.$emit("input", datetime);
    },
  },
};
</script>
