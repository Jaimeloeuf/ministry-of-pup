import { text, b, br, div } from "@hyperapp/html";

const view = div({ id: "loader" }, [
  b({ class: "title is-4" }, text("... LOADING ...")),
  br(),
  div({ id: "spinner" }),
]);

export default view;
