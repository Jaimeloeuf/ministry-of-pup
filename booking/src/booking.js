import { text, h1, h3, p, hr, div, button } from "@hyperapp/html";
import { loadDates } from "./loadDates.js";

function selectDate(state, date) {
  return {
    ...state,

    selectedDate: date,
    route: "/details",
  };
}

const getMoreDates = (state) => [
  state,
  [
    loadDates,

    // Get the last date in available dates to get more timeslots after that date
    state.datesAvailable[state.datesAvailable.length - 1]?.date,
    // SADLY SAFARI does not support .at() ... smh
    // state.datesAvailable.at(-1)?.date,
  ],
];

const selectDateView = (datesAvailable) =>
  div(
    { class: "card px-5" },
    div({ class: "card-content content" }, [
      h1({ class: "subtitle is-6" }, text("Select a date")),

      // Show loading instead of just empty
      datesAvailable &&
        div(
          datesAvailable.map((date) =>
            div([
              div(
                {
                  class: "level is-mobile",
                  style: { cssText: "cursor: pointer" },
                  onclick: [selectDate, date],
                },
                (() => {
                  // Only create date object for the view fn
                  // As the unix timestamp in milliseconds is still preferred for storing in state
                  // As calling load dates API also requires the millisecond value.
                  const dateObj = new Date(date.date);

                  return [
                    div({ class: "level-right" }, [
                      div({ class: "level-item" }, [
                        text(
                          `${dateObj.toLocaleString("default", {
                            weekday: "long",
                          })}`
                        ),
                      ]),
                    ]),

                    div(
                      { class: "level-left" },
                      div({ class: "level-item" }, [
                        text(
                          `${dateObj.getDate()} ${dateObj.toLocaleString(
                            "default",
                            { month: "long" }
                          )}`
                        ),
                      ])
                    ),
                  ];
                })()
              ),

              hr({ style: { "background-color": "#dedede" } }),
            ])
          )
        ),

      div(
        { style: { "text-align": "center" } },
        button(
          { class: "button is-light", onclick: getMoreDates },
          text("See More Available Dates")
        )
      ),
    ])
  );

const view = ({ dog, datesAvailable }) =>
  div({ class: "px-5 pt-5", style: { "text-align": "left" } }, [
    div({ class: "columns is-multiline" }, [
      div(
        { class: "column is-full" },
        h1({ class: "title is-4" }, text("Book a session"))
      ),

      div({ class: "column is-full" }, [
        h3({ class: "subtitle" }, text(`For ${dog.name}`)),
      ]),

      div({ class: "column is-full" }, selectDateView(datesAvailable)),
    ]),
  ]);

export default view;
