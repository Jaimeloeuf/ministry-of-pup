/**
 * Vuex module for user related state
 */

import initialState from "./initialState";
import setter from "../../utils/setter";

import firebase from "firebase/app";
import { ffetch, getAuthHeader } from "../../../utils/fetch";

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
      // @todo Slice away the "@scdf.gov.sg"
      const email = firebase.auth().currentUser.email.toLowerCase();

      // Scaffold to test out UI first
      return commit("setter", [
        "user",
        {
          // @todo Load from DB? Or use custom claims value of RBAC token?
          ic: "T0012345A",
          email: email,
          name: "JJ",
          firestationID: 2,
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
      const response = await ffetch(
        process.env.NODE_ENV === "production"
          ? "https://api-pivlacyi5a-as.a.run.app/settings/save"
          : "http://localhost:3000/settings/save",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: await getAuthHeader(firebase.auth),
          },
        },
        {
          // @todo Might not need this as email can be read from token with admin SDK on backend
          user: firebase.auth().currentUser.email,
          ...settings,
        }
      ).then((response) => response.json());

      if (!response.ok) throw new Error(response.error);

      commit("setter", ["user", settings]);
    },
    /**
     * Async function to sent API server a help request for it to notify admins
     * @function getHelp
     */
    async getHelp() {
      const response = await ffetch(
        process.env.NODE_ENV === "production"
          ? "https://api-pivlacyi5a-as.a.run.app/help"
          : "http://localhost:3000/help",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: await getAuthHeader(firebase.auth),
          },
        },
        {
          // @todo Might not need this as email can be read from token with admin SDK on backend
          user: firebase.auth().currentUser.email,
        }
      ).then((response) => response.json());

      if (!response.ok) throw new Error(response.error);
    },
  },
};
