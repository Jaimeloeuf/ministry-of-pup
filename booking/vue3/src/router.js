import { createRouter, createWebHashHistory } from "vue-router";

import Booking from "./components/Booking.vue";

const router = createRouter({
  history: createWebHashHistory(),

  /**
   * @notice
   * Routes uses lazily loaded components with route level code-splitting
   * this generates a separate chunk (about.[hash].js) for this route
   * which is lazy-loaded when the route is visited.
   */
  routes: [
    {
      path: "/",
      name: "Booking",
      component: Booking,
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   component: () => import("../components/AboutUs.vue"),
    // },
    // {
    //   path: "/faq",
    //   name: "faq",
    //   component: () => import("../components/FAQ.vue"),
    // },
  ],
});

export default router;
