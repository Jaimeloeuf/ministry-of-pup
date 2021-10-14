/**
 * Vuex module for all things dog related
 */

import initialState from "./initialState";
import setter from "../../setter";

import { oof } from "simpler-fetch";
import { getAuthHeader } from "../../../firebase.js";

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    // @todo Change when changing to object storage for dogs
    dog: (state) => (dogID) => state.dogs.find((dog) => dog.id === dogID),
  },
  mutations: {
    setter,

    setDogs(state, dogs) {
      state.dogs = dogs;
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
     * Function to all the trips that the user went on from API and load into state
     * @function getUserTrips
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
  },
};
