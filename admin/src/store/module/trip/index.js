/**
 * Vuex module for all things trip related
 */

import Vue from "vue";

import initialState from "./initialState";
import setter from "../../utils/setter";

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
  },
};
