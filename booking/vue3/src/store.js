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

      preference: undefined,

      // Set after appointment is booked, where this is returned from booking API
      appointmentID: undefined,
    };
  },

  mutations: {
    // Mutation to update the shared global loading state
    loading: (state, loadingState) => (state.loading = loadingState),

    // Generic mutation to set anything in state
    setter: (state, payload) => (state[payload[0]] = payload[1]),

    setAvailableDates: (state, dates) => state.datesAvailable.push(...dates),
  },

  actions: {
    async loadDates({ commit, dispatch }, after) {
      const res = await oof
        .GET(
          after
            ? `/appointment/available/date?after=${after}`
            : "/appointment/available/date"
        )
        .runJSON();

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
      const token = await getRecaptchaToken("submit");

      const res = await oof
        .POST("/appointment/book")
        .header({ "x-recaptcha-token": token })
        .data({
          time: state.selectedTimeslot,
          preference: state.preference,

          // Add in these fields to submit
          // fname / lname / number / email
          ...state.details,
        })
        .runJSON();

      // If the API call failed, recursively dispatch itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) && dispatch("book")
        );

      commit("setter", ["appointmentID", res.appointmentID]);
    },

    async cancel({ dispatch }, appointmentID) {
      const token = await getRecaptchaToken("cancelAppointment");

      const res = await oof
        .POST(`/appointment/cancel/${appointmentID}`)
        .header({ "x-recaptcha-token": token })
        .runJSON();

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
