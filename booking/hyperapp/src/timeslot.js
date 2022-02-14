import { text, p, button, div } from "@hyperapp/html";

const selectTimeslot = (state, timeslot) => ({
  ...state,

  selectedTimeslot: timeslot,
  route: "/details",
});

const formatMsToTime = (milliseconds) =>
  new Date(milliseconds).toLocaleString("default", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const timeslotString = (timeslotTimeInMilliseconds) =>
  formatMsToTime(timeslotTimeInMilliseconds) +
  " - " +
  formatMsToTime(timeslotTimeInMilliseconds + 30 * 60000);

const selectTimeslotView = (selectedDate) =>
  div(
    { class: "card px-5" },
    div(
      { class: "card-content has-text-centered" },
      selectedDate.timeslots.map((timeslot) =>
        button(
          {
            class: "button is-light is-rounded mb-5 mx-4",
            onclick: [selectTimeslot, timeslot],
          },
          text(timeslotString(timeslot))
        )
      )
    )
  );

const view = (selectedDate) =>
  div({ class: "px-5 pt-5", style: { "text-align": "left" } }, [
    div({ class: "columns is-multiline" }, [
      div(
        { class: "column is-full" },
        p({ class: "title is-4" }, text("Select a time"))
      ),

      div(
        { class: "column is-full" },
        div({ class: "columns is-mobile is-vcentered" }, [
          div(
            { class: "column" },
            p(
              { class: "subtitle" },
              text(
                `On ${new Date(selectedDate.date).toLocaleString("default", {
                  dateStyle: "long",
                })}`
              )
            )
          ),

          div(
            { class: "column is-narrow" },
            button(
              {
                class: "button",
                onclick: (state) => ({ ...state, route: "/" }),
              },
              text("Back")
            )
          ),
        ])
      ),

      div({ class: "column is-full" }, selectTimeslotView(selectedDate)),
    ]),
  ]);

export default view;
