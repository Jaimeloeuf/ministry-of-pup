import { text, h1, h3, p, hr, div, button } from "@hyperapp/html";

function selectDate(state, date) {
  // Still push state to show on URL but no actual effect
  history.pushState(undefined, undefined, "/details");

  return {
    ...state,

    selectedDate: date,
    route: "/details",
  };
}

// @todo Call API too
function getMoreDates(state) {
  return { ...state };
}

const selectDateView = (datesAvailable) =>
  div(
    { class: "card px-5" },
    div({ class: "card-content content" }, [
      h1({ class: "subtitle is-6" }, text("Select a date")),

      datesAvailable &&
        div(
          datesAvailable.map((date) =>
            div([
              div(
                {
                  class: "level is-mobile",
                  onclick: [selectDate, date],
                },
                [
                  div({ class: "level-right" }, [
                    div({ class: "level-item" }, [
                      text(
                        `${date.date.toLocaleString("default", {
                          weekday: "long",
                        })}`
                      ),
                    ]),
                  ]),

                  div(
                    { class: "level-left" },
                    div({ class: "level-item" }, [
                      text(
                        `${date.date.getDate()} ${date.date.toLocaleString(
                          "default",
                          { month: "long" }
                        )}`
                      ),
                    ])
                  ),
                ]
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
