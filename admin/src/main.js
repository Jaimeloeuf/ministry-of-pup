import { auth, onAuthStateChanged } from "./firebase";

// Import first before this is used elsewhere to set the baseUrl
import { oof } from "simpler-fetch";
oof.baseUrl(
  process.env.NODE_ENV === "production"
    ? "https://api.ministryofpup.com"
    : "http://localhost:3000"
);

import Vue from "vue";
import App from "./App.vue";
import "./utils/setupUncaughtErrorHandlers";

import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// Register global custom directive called `v-autofocus`
import autofocus from "./directives/autofocus";
Vue.directive("autofocus", autofocus);

// App variable to store reference to the vue App object
let app;

/**
 * Why new vue is wrapped in this?
 *
 * Wait for firebase to finish initialization before creating the app.
 * So that the router navigation wont break due to invalid auth
 */
const unsubscribe = onAuthStateChanged(auth, () => {
  // Prevent app initialization from running more than once
  if (!app)
    // Create new vue app
    app = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");

  // Use the firebase.Unsubscribe function returned from adding auth state change listner to unsubscribe
  // To prevent new Vue from running more than once
  unsubscribe();
});
