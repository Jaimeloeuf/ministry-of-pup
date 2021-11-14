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
