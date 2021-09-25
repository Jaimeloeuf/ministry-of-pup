<template>
  <div style="font-size: 0.7em">
    Version: {{ gitBranch + " " + commitHash.slice(0, 6).toString() }}
    <br />
    Build Time: {{ buildTime }}
  </div>
</template>

<script>
export default {
  name: "version",

  data() {
    // Environment variables injected in by webpack, configured in vue.config.js
    return {
      // buildTime is ISO string format, so convert to Date and print in user's locale
      buildTime: new Date(process.env.buildTime).toString(),

      commitHash: process.env.commitHash,
      gitBranch: process.env.gitBranch,
    };
  },
};
</script>
