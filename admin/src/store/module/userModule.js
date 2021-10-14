/**
 * Vuex module for all things user related
 */

import setter from "../setter";

export default {
  namespaced: true,
  state: {
    email: "",
  },
  mutations: {
    setter,

    setEmail(state, email) {
      state.email = email;
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
  },
};
