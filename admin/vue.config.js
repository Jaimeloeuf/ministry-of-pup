// Use the below code to do pre rendering if needed
// const path = require("path");
// const PrerenderSpaPlugin = require("prerender-spa-plugin");

// const productionPlugins = [
//   new PrerenderSpaPlugin({
//     // Assumes that this is running in project root
//     staticDir: path.join(__dirname, "dist"),

//     // Since this is a landing page with only a single route
//     routes: ["/"],

//     renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
//       // We need to inject a value so we're able to
//       // detect if the page is currently pre-rendered.
//       inject: {},

//       // Wait until the "vue-render-complete" event is dispatched, before creating a snapshot of the page
//       // This event is dispatched on window.document by the main vue app in its "mounted" lifecycle hook
//       renderAfterDocumentEvent: "vue-render-complete",

//       // Should only be used if you want to debug, displays the browser window when rendering.
//       // headless: false,
//     }),
//   }),
// ];

const webpack = require("webpack");

// Get git values to be use in the vue app
const childProcess = require("child_process");
const gitValues = {
  commitHash: childProcess.execSync("git rev-parse HEAD").toString(),
  gitBranch: childProcess
    .execSync("git rev-parse --abbrev-ref HEAD")
    .toString(),
};

module.exports = {
  // configureWebpack(config) {
  //   if (process.env.NODE_ENV === "production") {
  //     config.plugins.push(...productionPlugins);
  //   }
  // },

  // Some useful articles for reference on Vue+PWA
  // https://medium.com/@myeris/getting-started-with-pwas-an-ios-nightmare-f0712c2f950
  // https://itnext.io/pwa-splash-screen-and-icon-generator-a74ebb8a130
  //
  // Also note that for ipad, when using vue pwa, pwa.name field defaults to the name in package.json
  // And they expect us to edit public/manifest.json to match it.
  // The problem is that when using manifest.webmanifest, it just fails and does not work...
  // So in order to fix it, have to use manifest.json as a stop gap measure.
  // https://cli.vuejs.org/core-plugins/pwa.html#configuration
  pwa: {
    // Because of this stupid decision to support >iOS 11.3 devices, the set the default to no....
    // Setting it to yet, prevents it from adding a second meta tag that prevents things like IOS splash screen from working
    // https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    // https://github.com/vuejs/vue-cli/issues/2889#issuecomment-551714457
    // https://github.com/vuejs/vue-cli/issues/3269#issuecomment-551713836
    appleMobileWebAppCapable: "yes",
  },

  configureWebpack(config) {
    config.plugins.push(
      // Create a plugin to inject in environment variables like git values and buildTime
      // https://webpack.js.org/plugins/environment-plugin/
      new webpack.EnvironmentPlugin({
        ...gitValues,
        // CI/CD build server might not be in SG, so store date as ISO string, to create a new Date object when viewing to show time in user's locale
        buildTime: new Date(),
      })
    );
  },
};
