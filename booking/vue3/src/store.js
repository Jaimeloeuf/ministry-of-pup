import { createStore } from "vuex";
import { oof } from "simpler-fetch";

// Set baseUrl before using in actions
oof.baseUrl(
  process.env.NODE_ENV === "production"
    ? "https://api.ministryofpup.com"
    : "http://localhost:3000"
);

const getRecaptchaToken = async (action) =>
  new Promise((resolve, reject) =>
    grecaptcha.ready(() =>
      grecaptcha
        .execute("6Lcex6QcAAAAADus4RtnoqwskQoXcB2DwgCav11Z", { action })
        .then(resolve)
        .catch(reject)
    )
  );

export default createStore({
  state() {
    return {
      // Shared global loading flag to show/hide loader in App.vue
      loading: false,

      datesAvailable: [],
      selectedDate: {},
      selectedTimeslot: undefined,

      details: {
        fname: undefined,
        lname: undefined,
        number: undefined,
        email: undefined,
      },

      // Set after appointment is booked, where this is returned from booking API
      appointmentID: undefined,
    };
  },

  mutations: {
    // Mutation to update the shared global loading state
    loading: (state, loadingState) => (state.loading = loadingState),

    setAvailableDates: (state, dates) => state.datesAvailable.push(...dates),
    setSelectedDate: (state, date) => (state.selectedDate = date),
    setSelectedTimeslot: (state, timeslot) =>
      (state.selectedTimeslot = timeslot),
    setDetails: (state, details) => (state.details = details),
    setAppointmentID: (state, appointmentID) =>
      (state.appointmentID = appointmentID),
  },

  actions: {
    async loadDates({ commit, dispatch }, after) {
      const res = await oof
        .GET(
          after
            ? `/appointment/available/date?after=${after}`
            : "/appointment/available/date"
        )
        .run()
        .then((res) => res.json());

      // If the API call failed, recursively dispatch itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) &&
          dispatch("loadDates", after)
        );

      commit("setAvailableDates", res.timeslots);
    },

    async book({ commit, dispatch, state }) {
      // @todo validate all the inputs

      const token = await getRecaptchaToken("submit");

      const res = await oof
        .POST("/appointment/book")
        .data({
          // @todo Might figure out how to pass dogID or preference into the system later on
          // Tmp fake value used here to prevent firestore document insert from failing
          dogID: null,

          // Include recaptcha token in API call
          token,

          time: state.selectedTimeslot,

          // Add in these fields to submit
          // fname / lname / number / email
          ...state.details,
        })
        .run()
        .then((res) => res.json());

      // If the API call failed, recursively dispatch itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) && dispatch("book")
        );

      commit("setAppointmentID", res.appointmentID);
    },

    async cancel({ dispatch }, appointmentID) {
      const token = await getRecaptchaToken("cancelAppointment");

      const res = await oof
        .POST(`/appointment/cancel/${appointmentID}?token=${token}`)
        .run()
        .then((res) => res.json());

      // If the API call failed, recursively dispatch itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) &&
          dispatch("cancel", appointmentID)
        );
    },
  },
});
