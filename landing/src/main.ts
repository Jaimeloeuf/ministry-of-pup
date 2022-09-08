/* For sites that can be accessed via multiple domains */
// Function to redirect user to the preferred domain instead of the default firebase hosting domains if they land there.
// Wrapped in its own code block to not pollute the global namespace
{
  const location = window.location.hostname;
  console.log(`Window location: ${location}`);

  if (
    location === "ministryofpup.web.app" ||
    location === "ministryofpup.firebaseapp.com"
  )
    window.location.replace("https://yourdomain.com");
}

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";

// @todo Move this directive registration into the Testimonial.vue only
import Vue3TouchEvents from "vue3-touch-events";

// Create new vue app
createApp(App).use(router).use(Vue3TouchEvents).mount("#app");
