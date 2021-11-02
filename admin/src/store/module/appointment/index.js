/**
 * Vuex module for appointment related state
 */

import Vue from "vue";

import initialState from "./initialState";
import setter from "../../setter";

import { oof } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase.js";

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    // Return appointments as an array sorted by nearest appointment first
    appointments: (state) =>
      Object.values(state.appointments).sort((a, b) => a.time - b.time),

    // Assuming appointments do not overlap
    // Return the appointment in the appointments array that has a starting time before now and an ending time after now
    // Returns a function so that the time to filter with can be refreshed when used
    getCurrent:
      (_, getters) =>
      (nowInMilliseconds = new Date().getTime()) =>
        getters.appointments.find(
          (appointment) =>
            appointment.time < nowInMilliseconds &&
            // 30 * 60 * 1000 = 1800000 Milliseconds in a 30 minute interval
            appointment.time + 1800000 > nowInMilliseconds
        ),

    current: (_, getters) => getters.getCurrent(),

    // Assuming appointments do not overlap
    // And since appointments getter is already sorted by ascending appointment time
    // Return the first appointment in the appointments array that starts after the current time
    next: (_, getters) =>
      getters.appointments.find(
        (appointment) => appointment.time > new Date().getTime()
      ),
  },
  mutations: {
    setter,

    setAppointments(state, appointments) {
      // @todo Maybe this should combine both objects using spread instead of just setting it straight
      state.appointments = appointments;
    },
    setAppointment(state, appointment) {
      Vue.set(state.appointments, appointment.id, appointment);
    },
  },
  actions: {
    /**
     * Initialization function for this module
     * @function init
     */
    // async init({ dispatch }) {
    //   dispatch("");
    // },
    /**
     * Function to get all scheduled appointments from API and load into state
     *
     * @todo Appointments that hasn't ended yet or hasn't started
     * Actually it is much easier to ask API for appointments that have yet to start than appointments that have yet to end.
     * because havent end requires an additional processing round to do 'time + 30min interval' > currentTime
     *
     * @function getAppointments
     */
    async getAppointments({ commit, dispatch }) {
      const res = await oof
        .GET("/admin/appointment/scheduled")
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively dispatch itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) &&
          dispatch("getAppointments")
        );

      commit("setAppointments", res.appointments);
    },
    /**
     * Function to get and save appointment of given appointmentID if missing from state.
     * @function getAppointment
     */
    async getAppointment({ state, commit, dispatch }, appointmentID) {
      if (state.appointments[appointmentID]) return;

      const res = await oof
        .GET(`/admin/appointment/${appointmentID}`)
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively call itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) &&
          dispatch("getAppointment")
        );

      commit("setAppointment", res.appointment);
    },

    async cancelAppointment({ dispatch }, appointmentID) {
      const res = await oof
        .POST(`/appointment/cancel/${appointmentID}`)
        .runJSON();

      // If the API call failed, recursively dispatch itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) &&
          dispatch("cancelAppointment", appointmentID)
        );
    },
  },
};
