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
    path: "/",
    name: "login",
    component: () => import("@/views/Login.vue"),
    meta: { Auth_requirements: AuthType.public_only },
  },
];

export default routes;
