import { text, h1, hr, div, button } from "@hyperapp/html";

// @todo Add a back button
const back = (state) => ({ ...state, route: "/" });

const selectTimeslot = (state, timeslot) => ({
  ...state,

  selectedTimeslot: timeslot,
  route: "/details",
});

const formatDateToTime = (date) =>
  date.toLocaleString("default", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const view = (selectedDate) =>
  div(
    { class: "card px-5" },
    div({ class: "card-content content" }, [
      h1({ class: "subtitle is-6" }, text("Select a time")),

      // @todo API to ensure to not return an empty array if that day is fully booked
      div(
        selectedDate.timeslots.map((timeslot) =>
          div([
            div(
              {
                class: "level is-mobile",
                style: { cssText: "cursor: pointer" },
                onclick: [selectTimeslot, timeslot],
              },
              (() => {
                // Only create date object for the view fn
                // As the unix timestamp in milliseconds is still preferred for storing in state
                // As calling load dates API also requires the millisecond value.
                const dateObj = new Date(timeslot);

                return [
                  div(
                    div(
                      { class: "level-item" },
                      text(formatDateToTime(dateObj))
                    )
                  ),

                  text(" - "),

                  div(
                    div(
                      { class: "level-item" },
                      text(
                        formatDateToTime(
                          new Date(dateObj.getTime() + 30 * 60000)
                        )
                      )
                    )
                  ),
                ];
              })()
            ),

            hr({ style: { "background-color": "#dedede" } }),
          ])
        )
      ),
    ])
  );

export default view;
