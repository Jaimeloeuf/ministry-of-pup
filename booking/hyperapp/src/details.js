import { text, h1, input, div, button, label } from "@hyperapp/html";
import { oof } from "simpler-fetch";

const NewValue = (detailPropertyString) => (state, event) => ({
  ...state,

  details: {
    ...state.details,
    [detailPropertyString]: event.target.value,
  },
});

const back = (state) => ({ ...state, route: "/" });

// Action to run once appointment has been booked and API returned
const booked = (state, appointmentID) => ({
  ...state,
  appointmentID,
  loader: false,
  route: "/complete",
});

// Dun modify state, let the next action run after data is recieved to do action
const book = (state) => [
  // Show loader while waiting for API call to complete
  { ...state, loader: true },
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
                // @todo validate all the inputs

                // @todo Might figure out how to pass dogID or preference into the system later on
                // Tmp fake value used here to prevent firestore document insert from failing
                dogID: 1,

                token,
                time: state.selectedTimeslot,

                // Add in these fields to submit
                // fname / lname / number / email
                ...state.details,
              })
              .run()
              .then((response) => response.json());

            // Maybe set something in state instead to show a retry UI or smth
            if (!response.ok) throw new Error(response.error);

            console.log("Res", response);
            dispatch(booked, response.appointmentID);
          });
      }),
  ],
];

const view = div({ class: "px-5 pt-5", style: { "max-width": "30em" } }, [
  div({ class: "columns is-multiline is-mobile" }, [
    div(
      { class: "column is-full" },
      h1({ class: "title is-4" }, text("Enter your details"))
    ),

    div(
      { class: "column is-full box" },
      div({ class: "columns is-multiline" }, [
        div(
          { class: "column is-full" },
          label([
            text("First name"),
            input({
              oninput: NewValue("fname"),
              type: "text",
              class: "input",
              placeholder: "E.g. John",
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
              placeholder: "E.g. Doe",
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
              pattern: "[s0-9]+",
              min: 10000000,
              max: 99999999,
              class: "input",
              required: true,
              placeholder: "E.g. 92345678",
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
              placeholder: "E.g. example@gmail.com",
            }),
          ])
        ),
      ])
    ),

    div(
      { class: "column is-half" },
      button({ class: "button is-fullwidth py-5", onclick: back }, text("Back"))
    ),

    div(
      { class: "column is-half" },
      button(
        {
          class: "button is-fullwidth py-5 is-light is-success",
          onclick: book,
        },
        text("Book")
      )
    ),
  ]),
]);

export default view;
