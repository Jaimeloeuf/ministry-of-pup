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
    name: "Home",
    component: Home,
  },
  {
    path: "/directions",
    name: "directions",
    component: () => import("./components/Directions.vue"),
  },
];

export default new VueRouter({ routes });
