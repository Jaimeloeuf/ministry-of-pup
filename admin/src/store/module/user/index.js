/**
 * Vuex module for user related state
 */

import initialState from "./initialState";
import setter from "../../utils/setter";

import { auth, getAuthHeader } from "../../../firebase.js";

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setter,
  },
  actions: {
    /**
     * Initialization function for this module
     * @function init
     */
    async init({ dispatch }) {
      dispatch("getUserDetails");
    },
    /**
     * Function to get basic user's details
     * @function getUserDetails
     */
    async getUserDetails({ commit }) {
      // Get the current user's email
      const email = auth.currentUser.email.toLowerCase();

      // Scaffold to test out UI first
      return commit("setter", [
        "user",
        {
          // @todo Load from DB? Or use custom claims value of RBAC token?
          email: email,
          name: "JJ",
        },
      ]);

      // const response = await apiWithLoader.get(`/user/${email}`);
      // if (!response.success)
      //   return alert(
      //     `Failed to load your user details. Unable to proceed. Please logout and re-login.\n${response.error}`
      //   );

      // commit("setter", ["user", response.user]);
    },
    /**
     * Get list of available topup options
     * @function getPlans
     */
    async saveSettings({ commit }, settings) {
      commit("setter", ["user", settings]);
    },
    /**
     * Async function to sent API server a help request for it to notify admins
     * @function getHelp
     */
    async getHelp() {
      //
    },
  },
};
