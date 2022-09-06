import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./components/Home.vue";

Vue.use(VueRouter);

/**
 * @notice
 * Routes uses lazily loaded components with route level code-splitting
 * this generates a separate chunk (about.[hash].js) for this route
 * which is lazy-loaded when the route is visited.
 */
const routes = [
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
    // Since && will short circuit to return HomeRoute object, this is fine as the API call will run in the background
    redirect: (to) =>
      // Get the recaptcha token
      Promise.all([
        new Promise((resolve, reject) =>
          window.grecaptcha.ready(() =>
            window.grecaptcha
              .execute("6Lcex6QcAAAAADus4RtnoqwskQoXcB2DwgCav11Z", {
                action: "unsubscribeNewsletter",
              })
              .then(resolve)
              .catch(reject)
          )
        ),

        // Import oof and parse it out
        import("simpler-fetch").then(({ oof }) => oof),

        // Resolve the full API URL
        Promise.resolve(
          (process.env.NODE_ENV === "production"
            ? "https://api.ministryofpup.com"
            : "http://localhost:3000") +
            `/newsletter/cancel/${to.params.newsletterDocID}`
        ),
      ]).then(([token, oof, URL]) =>
        oof
          .POST(URL)
          .once()
          .header({ "x-recaptcha-token": token })
          .runJSON()
          .then(({ res, err }) =>
            alert(err || !res.ok ? err || res.error : "Subscription Cancelled")
          )
      ) && { name: "home" },
  },
];

export default new VueRouter({
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

  routes,
});
