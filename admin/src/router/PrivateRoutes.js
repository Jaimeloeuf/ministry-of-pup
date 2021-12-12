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
    path: "/appointment/new",
    name: "new-appointment",
    component: () => import("@/views/NewAppointment.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    // This route has to be defined after All and Current appointments,
    // to prevent e.g. "all" in /appointment/all to be used as the ID
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
    // Pass URL query parameters as prop to component
    // Allows a dogID to be passed in to directly select a dog
    props: (route) => route.query,
  },
  {
    // This route has to be defined after the other /dog/ routes
    // to prevent e.g. "all" in /dog/all to be used as the dogID
    path: "/dog/:dogID",
    props: true,
    name: "dog",
    component: () => import("@/views/Dog.vue"),
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
  {
    path: "/sale/manual",
    name: "sale-manual",
    component: () => import("@/views/ManualSale.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/transactions/all",
    name: "transactions",
    component: () => import("@/views/Transactions.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/user/create",
    name: "user-create",
    // Pass URL query parameters as prop to component
    // Mainly used for the redirect prop to redirect somewhere once account created
    props: (route) => route.query,
    component: () => import("@/views/CreateUser.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/user/details",
    name: "user-details",
    // Pass URL query parameters as prop to component
    props: (route) => route.query,
    component: () => import("@/views/UserDetails.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/user/all",
    name: "user-all",
    component: () => import("@/views/AllUsers.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/paynow",
    name: "paynow",
    component: () => import("@/views/Paynow.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
  {
    path: "/booking-links",
    name: "booking-links",
    component: () => import("@/views/BookingLinks.vue"),
    meta: { Auth_requirements: AuthType.private },
  },
];

export default routes;
