import { createRouter, createWebHashHistory } from "vue-router";

import Booking from "./components/Booking.vue";

const router = createRouter({
  history: createWebHashHistory(),

  // Always scroll to top of view on first visit and no savedPosition, else reuse savedPosition
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    else return { top: 0 };
  },

  /**
   * @notice
   * Routes uses lazily loaded components with route level code-splitting
   * this generates a separate chunk (about.[hash].js) for this route
   * which is lazy-loaded when the route is visited.
   */
  routes: [
    {
      path: "/",
      name: "booking",
      component: Booking,
    },
    {
      path: "/select-timeslot",
      name: "select-timeslot",
      component: () => import("./components/Timeslots.vue"),
    },
    {
      path: "/details",
      name: "details",
      component: () => import("./components/Details.vue"),
    },
    {
      path: "/complete",
      name: "complete",
      component: () => import("./components/Complete.vue"),
    },
    {
      path: "/reschedule/:appointmentID/:originalTimeslot",
      redirect: (to) => {
        /*
          If it is a reschedule, set all the values into vuex,
          and redirect to Booking view to select new date & timeslot.
        */

        store.commit("setter", ["reschedule", true]);
        store.commit("setter", ["appointmentID", to.params.appointmentID]);

        // All URL params are string because the URL is a string,
        // Thus calling parseInt on originalTimeslot to make it a Number first
        store.commit("setter", [
          "originalTimeslot",
          parseInt(to.params.originalTimeslot),
        ]);

        return { name: "booking" };
      },
    },
    {
      path: "/reschedule/confirm",
      name: "reschedule",
      component: () => import("./components/Reschedule.vue"),
    },
    {
      path: "/cancel/:appointmentID",
      props: true,
      name: "cancel",
      component: () => import("./components/Cancel.vue"),
    },

    // @todo Add a 404 not found
  ],
});

export default router;
