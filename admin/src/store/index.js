import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import userModule from "./module/user";
import dogModule from "./module/dog";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV.toLowerCase() !== "production",

  state: {},
  modules: {
    user: userModule,
    dog: dogModule,
  },
  actions: {
    /**
     * Main init function of store that calls all the other init actions from all the modules
     * @function init
     */
    async init({ dispatch }) {
      console.log("Initializing vuex store and its modules...");

      // Run asynchronous actions without awaiting for them to complete
      // dispatch("user/init");
      // dispatch("trip/init");
    },
  },

  plugins: [
    /* Note that createPersistedState use the same key "vuex" in storage, but they do not clash as they use different storage APIs */
    // Register modules for persistent state using localStorage
    createPersistedState({
      paths: ["user"],
    }),
    // Register modules for persistent state using sessionStorage
    createPersistedState({
      storage: window.sessionStorage,
      paths: ["dog"],
    }),
  ],
});
