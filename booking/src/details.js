import { text, h1, input, div, button, label } from "@hyperapp/html";

const NewValue = (detailPropertyString) => (state, event) => ({
  ...state,

  details: {
    ...state.details,
    [detailPropertyString]: event.target.value,
  },
});

// @todo Might not be the right way to do this
function back(state) {
  // Still push state to show on URL but no actual effect
  history.pushState(undefined, undefined, "/");

  return { ...state, route: "/" };
}

// @todo Call API too
// function book(state) {
//   history.pushState(undefined, undefined, "/complete");
//   return state;
// }
function book(state) {
  // Still push state to show on URL but no actual effect
  history.pushState(undefined, undefined, "/complete");

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
