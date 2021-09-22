import { text, h1, b, br, div, button, label, p } from "@hyperapp/html";

// @todo
const addToCalendar = (state) => state;

const view = ({ dog, selectedDate, details }) =>
  div({ class: "px-5 pt-5", style: { "max-width": "30em" } }, [
    div({ class: "columns is-multiline" }, [
      div(
        { class: "column is-full" },
        h1(
          { class: "title is-4 has-text-danger" },
          text("Booked! See you soon :)")
        )
      ),

      div(
        { class: "column is-full" },
        label([
          b(text("Seeing: ")),
          text(dog.name),
          br(),
          b(text("On: ")),
          // @todo Make the date nicer/shorter and easier to read
          text(selectedDate?.date),
        ])
      ),

      div(
        { class: "column is-full" },
        label([
          b(text("Name")),
          br(),
          p({ class: "ml-3" }, text(`${details.lname} ${details.fname}`)),
        ])
      ),

      div(
        { class: "column is-full" },
        label([
          b(text("Number")),
          br(),
          p({ class: "ml-3" }, text(details.number)),
        ])
      ),

      div(
        { class: "column is-full" },
        label([
          b(text("Email")),
          br(),
          p({ class: "ml-3" }, text(details.email)),
        ])
      ),

      div(
        { class: "column is-full" },
        button(
          {
            class: "button is-light is-success is-fullwidth",
            onclick: addToCalendar,
          },
          text("Add to calendar")
        )
      ),

      // @todo Add a section with our contact details like the email so they can find us if anything
      // The generated google cal invite should have a details, with a link to cancel or change appt time if needed
    ]),
  ]);

export default view;
