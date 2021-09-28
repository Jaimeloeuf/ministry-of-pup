import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";

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
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../components/AboutUs.vue"),
  },
  {
    path: "/faq",
    name: "faq",
    component: () => import("../components/FAQ.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
