import Vue from "vue";

// @todo Monkeypatch before writing actual error handler...
function newError(err) {
  console.error("Uncaught error:", err);
}

/**
 * @param {object} err The error thrown
 * @param {object} vm Component in which the error is thrown from
 * @param {String} info Vue-specific error info, e.g. which lifecycle hook the error was found in.
 */
Vue.config.errorHandler = async function (err, vueComponent, info) {
  // console.error(err);

  // Discarding stack as not very useful and hard to send over to server
  // console.error(err.stack);

  // Dispatch without awaitng for store to handle all error logging/reporting logic
  // @todo Create error of type error.type.UNKNOWN here
  newError({
    via: "Vue.config.errorHandler",
    error: err.message,
    info,
  });
};

/**
 * event.promise contains the promise object
 * event.reason contains the reason for the rejection
 */
window.addEventListener("unhandledrejection", function (event) {
  // console.error(event);

  // Dispatch without awaitng for store to handle all error logging/reporting logic
  newError({
    via: "window.addEventListener.unhandledrejection",
    event,
  });
});

window.onerror = function (message, source, lineno, colno, error) {
  // console.error(error);

  newError({
    via: "window.onerror",
    error: {
      error: error.message,
      message,
      source,
      lineno,
      colno,
    },
  });
};
