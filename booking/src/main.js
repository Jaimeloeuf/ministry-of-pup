/* Defaults to a hyperapp demo application */

import { app } from "hyperapp";
import { main } from "@hyperapp/html";

// Import first before this is used elsewhere to set the baseUrl
import { oof } from "simpler-fetch";
oof.baseUrl(
  process.env.NODE_ENV === "production"
    ? "https://api.ministryofpup.com"
    : "http://localhost:3000"
);

import bookingView from "./booking.js";
import detailsView from "./details.js";
import completeView from "./complete.js";
import notFoundView from "./notFound.js";
import loaderView from "./loader.js";

import { loadDates } from "./loadDates.js";

app({
  init: [
    {
      // Route is just used to show the different views
      // It does not actually reflect the URL path of the app
      route: "/",

      loader: false,

      dog: { name: "French bull dog 1" },

      datesAvailable: [],
      selectedDate: undefined,

      details: {
        fname: undefined,
        lname: undefined,
        number: undefined,
        email: undefined,
      },

      // Set after appointment is booked, where this is returned from booking API
      appointmentID: undefined,
    },

    // Run `loadDates` effect on init
    [loadDates],
  ],

  view: ({
    route,
    loader,
    dog,
    datesAvailable,
    selectedDate,
    details,
    appointmentID,
  }) =>
    main(
      {
        style: {
          width: "86vw",
          "max-width": "40em",

          // CSS to make entire app centered vertically
          // @todo Although this makes the available x axis smaller esp for booking view
          cssText:
            "display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: left; height: 100vh;",
        },
      },
      [
        loader
          ? loaderView
          : (function () {
              switch (route) {
                case "/":
                  return bookingView({ dog, datesAvailable });
                case "/details":
                  return detailsView;
                case "/complete":
                  return completeView({
                    dog,
                    selectedDate,
                    details,
                    appointmentID,
                  });

                default:
                  // @todo Load it asynchronously   return import("./notFound.js");
                  return notFoundView;
              }
            })(),
      ]
    ),

  node: document.getElementById("app"),
});
