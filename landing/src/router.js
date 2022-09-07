import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./components/Home.vue";

export default createRouter({
  history: createWebHashHistory(),

  /**
   * Scroll to savedPosition if there is a savedPosition from supported browser,
   * triggered by user clicking back and forward navigation buttons.
   * If there is no savedPosition, check if there is a anchor/hash,
   * if there is one, scroll to that selector, and scroll to it "instantly".
   * It must be instant to work, because router uses hash mode, and in this mode,
   * there will be 2 hash in the URL when using scroll to anchor too,
   * which will cause the browser to mess up the scrolling if "smooth" behavior is used.
   * Thus by scrolling to it instantly, it is not a "scroll" but rather immediate positioning.
   * If there is no savedPosition and no anchor to scroll to, just scroll to top of view,
   * "scroll" instantly too, to make it feel more responsive.
   *
   * Alternative solution for smooth scrolling to anchor
   * https://github.com/vuejs/vue-router/issues/1668#issuecomment-437744248
   */
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    else if (to.hash) return { selector: to.hash, behavior: "instant" };
    else return { x: 0, y: 0, behavior: "instant" };
  },

  routes:
    /**
     * @notice
     * Routes uses lazily loaded components with route level code-splitting
     * this generates a separate chunk (about.[hash].js) for this route
     * which is lazy-loaded when the route is visited.
     */
    [
      {
        path: "/",
        name: "home",
        component: Home,
      },

      {
        path: "/directions",
        name: "directions",
        component: () => import("./components/Directions.vue"),
      },

      {
        path: "/guides/all",
        name: "guides-all",
        component: () => import("./components/Guides/Guides.vue"),
      },

      {
        path: "/guides/new-pawrent",
        name: "guides-new-pawrent",
        component: () => import("./components/Guides/NewPawrent.vue"),
      },

      {
        path: "/unsubscribe/:newsletterDocID",

        // Call API to unsubscribe and redirect
        // Since API call is async, it is a Promise, so redirect returns, Promise<any> && HomeRoute
        // Return HomeRoute object, this is fine as the API call will run in the background
        redirect(to) {
          async function unsub() {
            const { getRecaptchaToken } = await import("./recaptcha.js");
            const token = await getRecaptchaToken("unsubscribeNewsletter");

            const { oof } = await import("simpler-fetch");
            const { res, err } = await oof
              .POST(
                (import.meta.env.MODE === "development"
                  ? "http://localhost:3000"
                  : "https://api.ministryofpup.com") +
                  `/newsletter/cancel/${to.params.newsletterDocID}`
              )
              .once()
              .header({ "x-recaptcha-token": token })
              .runJSON();

            // Simply alert user on failure
            if (err || !res.ok) {
              console.error(err);
              alert(`Failed to unsubscribe: \n${err || res.error}`);
            } else {
              alert("Subscription Cancelled");
            }
          }

          // Call unsub function and let it run in the background on the first await inside
          // So that the page can be redirected back to home page while the API call runs in the background
          unsub();

          return { name: "home" };
        },
      },

      // {
      //   // Or maybe this should be terms and conditions, but inside also includes the privacy and data policy
      //   path: "/terms",
      //   name: "terms",
      //   component: () => import("./components/Terms.vue"),
      // },
      // {
      //   // Or maybe this should be terms and conditions, but inside also includes the privacy and data policy
      //   path: "/privacy-policy",
      //   name: "privacy-policy",
      //   component: () => import("./components/PrivacyPolicy.vue"),
      // },
    ],
});
