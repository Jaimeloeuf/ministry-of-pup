import { text, h1, input, div, button, label } from "@hyperapp/html";
import { oof } from "simpler-fetch";

const NewValue = (detailPropertyString) => (state, event) => ({
  ...state,

  details: {
    ...state.details,
    [detailPropertyString]: event.target.value,
  },
});

function back(state) {
  return { ...state, route: "/" };
}

// Action to run once appointment has been booked and API returned
const booked = (state, appointmentID) => ({
  ...state,
  appointmentID,
  route: "/complete",
});

// Dun modify state, let the next action run after data is recieved to do action
const book = (state) => [
  /* show loading using a state value, only remove loading after complete API call */
  { ...state },
  [
    (dispatch) =>
      grecaptcha.ready(function () {
        grecaptcha
          .execute("6Lcex6QcAAAAADus4RtnoqwskQoXcB2DwgCav11Z", {
            action: "submit",
          })
          .then(async function (token) {
            const response = await oof
              .POST("/appointment/book")
              .data({
                token,

                dogID: 1,

                time: state.selectedTimeSlot,

                // Add in these fields to submit
                // fname / lname / number / email
                ...state.details,
              })
              .run()
              .then((response) => response.json());

            // Maybe set something in state instead to show a retry UI or smth
            if (!response.ok) throw new Error(response.error);

            dispatch(booked, response.appointmentID);
          });
      }),
  ],
];

const view = div({ class: "px-5 pt-5", style: { "max-width": "30em" } }, [
  div({ class: "columns is-multiline" }, [
    div(
      { class: "column is-full" },
      h1({ class: "title is-4" }, text("Enter your details"))
    ),

    div(
      { class: "column is-full" },
      label([
        text("First name"),
        input({
          oninput: NewValue("fname"),
          type: "text",
          class: "input",
        }),
      ])
    ),

    div(
      { class: "column is-full" },
      label([
        text("Last name"),
        input({
          oninput: NewValue("lname"),
          type: "text",
          class: "input",
        }),
      ])
    ),

    div(
      { class: "column is-full" },
      label([
        text("Phone number (+65)"),
        input({
          oninput: NewValue("number"),
          type: "tel",
          class: "input",
        }),
      ])
    ),

    div(
      { class: "column is-full" },
      label([
        text("Email"),
        input({
          oninput: NewValue("email"),
          type: "text",
          class: "input",
        }),
      ])
    ),

    div(
      { class: "column is-full" },
      button(
        { class: "button is-light is-danger is-fullwidth", onclick: back },
        text("Back")
      )
    ),

    div(
      { class: "column is-full" },
      button(
        { class: "button is-light is-success is-fullwidth", onclick: book },
        text("Book")
      )
    ),
  ]),
]);

export default view;
