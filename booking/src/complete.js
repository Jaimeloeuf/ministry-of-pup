import { text, a, img, h1, b, br, div, button, label, p } from "@hyperapp/html";

import { google, outlook, office365, yahoo, ics } from "calendar-link";

// @todo Add a link where they can click to request for us to contact them
// @todo Remove all the gaurd rails
const calendarDescription = (name, dogName = "French bulldog") => `Hey${
  name ? " " + name : ""
}!

Our puppies ${dogName && `and ${dogName}`} can't wait to see you!

Location: https://www.google.com/maps/place/Ministry+Of+Pup/@1.276847,103.836264,15z/data=!4m2!3m1!1s0x0:0x8e0ceb011e0b9fbe?sa=X&ved=2ahUKEwit9f_25JzzAhVPdCsKHYpSDHsQ_BJ6BAhHEAU
Carpark slots: Available!
Nearest MRT: Outram park

Call us at 88022177 daily between 10am - 8pm for help`;

// Generate event object for the calendar links using data from state
const getCalendarEventObj = (state) => ({
  // Based on time, set it to, Morning/Afternoon/Night with $DOG_NAME
  // Also, only add the dog name if viewing a specific dog
  title: `On site viewing with ${state.dog.name}`,

  // start: state.selectedDate.date,
  start: state.selectedDate?.date || new Date(),
  duration: [30, "minutes"],
  busy: true,

  description: calendarDescription(state.details?.fname),
  location: "43 Kampong Bahru Rd, Singapore 169359",
});

const calendarLinks = (event) => [
  div(
    { class: "column is-full" },
    a(
      {
        class: "button is-fullwidth",
        href: google(event),
        target: "_blank",
      },
      text("Google Calendar")
    )
  ),

  // @todo Only show this if user using iphone
  div(
    { class: "column is-full" },
    a(
      {
        class: "button is-fullwidth",
        href: ics(event), // Standard ICS file based on https://icalendar.org
        target: "_blank",
      },
      text("iOS Calendar")
    )
  ),

  div(
    { class: "column is-full" },
    a(
      {
        class: "button is-fullwidth",
        href: outlook(event),
        target: "_blank",
      },
      text("Outlook Calendar")
    )
  ),

  div(
    { class: "column is-full" },
    a(
      {
        class: "button is-fullwidth",
        href: office365(event),
        target: "_blank",
      },
      text("Office 365 Calendar")
    )
  ),

  div(
    { class: "column is-full" },
    a(
      {
        class: "button is-fullwidth",
        href: yahoo(event),
        target: "_blank",
      },
      text("Yahoo Calendar")
    )
  ),
];

const view = ({ dog, selectedDate, details }) =>
  div({ class: "px-5 pt-5 mt-6", style: { "max-width": "30em" } }, [
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
        h1({ class: "subtitle is-3" }, text("Add to Calendar"))
      ),

      ...calendarLinks(getCalendarEventObj({ dog, selectedDate })),

      // @todo Add a section with our contact details like the email so they can find us if anything
      // The generated google cal invite should have a details, with a link to cancel or change appt time if needed
    ]),
  ]);

export default view;
