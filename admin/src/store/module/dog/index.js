/**
 * Vuex module for all things dog related
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
    // Get the dogs as an array
    dogs: (state) => Object.values(state.dogs),
  },
  mutations: {
    setter,

    setDogs(state, dogs) {
      state.dogs = dogs;
    },
    setDog(state, dog) {
      Vue.set(state.dogs, dog.id, dog);
    },
  },
  actions: {
    /**
     * Initialization function for this module
     * @function init
     */
    async init({ dispatch }) {
      dispatch("getUnsoldDogs");
    },
    /**
     * Function to get all available dogs from API and load into state
     * @function getUnsoldDogs
     */
    async getUnsoldDogs({ commit, dispatch }) {
      const res = await oof
        .GET("/admin/pet/available")
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively dispatch itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) &&
          dispatch("getUnsoldDogs")
        );

      commit("setDogs", res.dogs);
    },
    /**
     * Function to get and save dog of given dogID if missing from state.
     * @function getDog
     */
    async getDog({ state, commit, dispatch, getters }, dogID) {
      if (state.dogs[dogID]) return;

      const res = await oof
        .GET(`/admin/pet/${dogID}`)
        .header(await getAuthHeader())
        .runJSON();

      // If the API call failed, recursively dispatch itself again if user wants to retry,
      // And always make sure that this method call ends right here by putting it in a return expression
      if (!res.ok)
        return (
          confirm(`Error: \n${res.error}\n\nTry again?`) && dispatch("getDog")
        );

      commit("setDog", res.dog);
    },
  },
};
