/* Defaults to a hyperapp demo application */

import { app } from "hyperapp";
import { main } from "@hyperapp/html";

import bookingView from "./booking.js";
import detailsView from "./details.js";
import completeView from "./complete.js";
import notFoundView from "./notFound.js";

const now = new Date();

app({
  init: {
    // Route is just used to show the different views
    // It does not actually reflect the URL path of the app
    route: "/",

    dog: { name: "French bull dog 1" },

    datesAvailable: [
      {
        date: new Date(now),
      },
      {
        date: new Date(now.setDate(now.getDate() + 1)),
      },
      {
        date: new Date(now.setDate(now.getDate() + 2)),
      },
    ],
    selectedDate: undefined,

    details: {
      fname: undefined,
      lname: undefined,
      number: undefined,
      email: undefined,
    },
  },

  view: ({ route, dog, datesAvailable, selectedDate, details }) =>
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
        (function () {
          switch (route) {
            case "/":
              return bookingView({ dog, datesAvailable });
            case "/details":
              return detailsView;
            case "/complete":
              return completeView({ dog, selectedDate, details });

            default:
              // @todo Load it asynchronously   return import("./notFound.js");
              return notFoundView;
          }
        })(),
      ]
    ),

  node: document.getElementById("app"),
});
