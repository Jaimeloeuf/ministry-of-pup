// Import AuthType Enum
import AuthType from "./AuthType";

/**
 * @notice
 * Routes uses lazily loaded components with route level code-splitting
 * this generates a separate chunk (about.[hash].js) for this route
 * which is lazy-loaded when the route is visited.
 */
const routes = [
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/Home.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/dog/new",
    name: "new-dog",
    component: () => import("@/views/NewDog.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/dog/sold",
    name: "sold-dog",
    component: () => import("@/views/SoldDog.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    // Have to add the extra /details if not, all the other routes with /trip/$ANYTHING will get matched with this
    path: "/trip/new/:tripID",
    props: true,
    name: "new-trip",
    component: () => import("@/views/NewTrip.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
];

export default routes;
