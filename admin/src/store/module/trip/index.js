/**
 * Vuex module for all things trip related
 */

import Vue from "vue";

import initialState from "./initialState";
import setter from "../../utils/setter";

import firebase from "firebase/app";
import { ffetch, getAuthHeader } from "../../../utils/fetch";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,

    // Add a trip to trips object in state
    addTrip(state, [tripID, trip]) {
      Vue.set(state.trips, tripID, trip);
    },
  },
  actions: {
    /**
     * Initialization function for this module
     * @function init
     */
    async init({ dispatch }) {
      dispatch("getUserTrips");
    },
    /**
     * Function to all the trips that the user went on from API and load into state
     * @function getUserTrips
     */
    async getUserTrips({ commit }) {},
    /**
     * Function to all the trips that the user went on from API and load into state
     * @function getUserTrips
     * @param {object} trip object with the form data filled in new trip view
     */
    async newTrip({ commit }, trip) {
      // @todo Check trip to ensure all fields are valid and required fields are present

      const response = await ffetch(
        process.env.NODE_ENV === "production"
          ? "https://api-pivlacyi5a-as.a.run.app/take"
          : "http://localhost:3000/take",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: await getAuthHeader(firebase.auth),
          },
        },
        trip
      ).then((response) => response.json());

      if (!response.ok) throw new Error(response.error);

      commit("addTrip", [response.tripID, trip]);
    },
  },
};
