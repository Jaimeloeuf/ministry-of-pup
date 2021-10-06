import { text, h1, input, div, button, label } from "@hyperapp/html";

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

function book(state) {
  // @todo Call API too
  return { ...state, route: "/complete" };
}

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
