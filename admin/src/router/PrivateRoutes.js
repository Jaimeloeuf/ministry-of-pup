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
    path: "/appointment/all",
    name: "all-appointments",
    component: () => import("@/views/AllAppointments.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    // This route has to be defined after AllAppointments to prevent "all" in /appointment/all to be used as the ID
    path: "/appointment/:appointmentID",
    props: true,
    name: "appointment",
    component: () => import("@/views/Appointment.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/dog/new",
    name: "new-dog",
    component: () => import("@/views/NewDog.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/dog/all",
    name: "all-dogs",
    component: () => import("@/views/AllDogs.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/dog/sold",
    name: "sold-dog",
    component: () => import("@/views/SoldDog.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/schedule",
    name: "schedule",
    component: () => import("@/views/SeeSchedule.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/schedule/block",
    name: "block-schedule",
    component: () => import("@/views/BlockSchedule.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/schedule/opening",
    name: "set-opening",
    component: () => import("@/views/OpeningHours.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
];

export default routes;
