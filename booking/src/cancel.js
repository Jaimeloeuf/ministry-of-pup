import { text, h1, b, br, div, label } from "@hyperapp/html";

const view = ({ appointmentID }) =>
  div({ class: "px-5 pt-5", style: { "max-width": "30em" } }, [
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
        label([b(text("Appointment ID")), br(), text(`${appointmentID}`)])
      ),
    ]),
  ]);

export default view;
