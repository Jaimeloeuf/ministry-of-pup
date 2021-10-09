import { app } from "hyperapp";
import { main, text, h1, b, br, div, label } from "@hyperapp/html";
import { oof } from "simpler-fetch";

import loaderView from "./loader.js";

// Effect to call the cancel appointment API and update state once cancelled
// Have a recaptcha layer to prevent spam/bots
const cancelAppointment = async (dispatch, appointmentID) =>
  grecaptcha.ready(function () {
    grecaptcha
      .execute("6Lcex6QcAAAAADus4RtnoqwskQoXcB2DwgCav11Z", {
        action: "cancelAppointment",
      })
      .then(
        // Main API call logic of the cancel appointment Effect
        async function _cancelAppointment(token) {
          const response = await oof
            .POST(`/appointment/cancel/${appointmentID}?token=${token}`)
            .run()
            .then((response) => response.json());

          // Maybe set something in state instead to show a retry UI or smth
          if (!response.ok) throw new Error(response.error);

          // Anonymous function action
          dispatch((state) => ({ ...state, loader: false }));
        }
      );
  });

export default (appointmentID) =>
  app({
    init: [
      { appointmentID, loader: true },

      // Run `loadDates` effect on init
      [cancelAppointment, appointmentID],
    ],

    view: ({ loader, appointmentID }) =>
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
        loader
          ? loaderView
          : div({ class: "px-5 pt-5", style: { "max-width": "30em" } }, [
              div({ class: "columns is-multiline is-mobile" }, [
                div(
                  { class: "column is-full" },
                  h1(
                    { class: "title is-4 has-text-danger" },
                    text("Your appointment has been cancelled!")
                  )
                ),

                div(
                  { class: "column is-full" },
                  label([
                    b(text("Appointment ID")),
                    br(),
                    text(`${appointmentID}`),
                  ])
                ),
              ]),
            ])
      ),

    node: document.getElementById("app"),
  });
