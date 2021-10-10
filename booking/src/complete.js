import { text, a, img, h1, b, br, div, label, p } from "@hyperapp/html";

import { google, outlook, office365, yahoo, ics } from "calendar-link";

// @todo Add reschedule appointment link
// @todo Add a link where they can click to request for us to contact them
const calendarDescription = (name, appointmentID) =>
  `Hey ${name}!

Our puppies can't wait to see you!

Location
https://goo.gl/maps/Jw9MpEPx9cuuGVGDA

Carpark slots are available! Here is a map of the carpark slot and how to get to us from there.
https://goo.gl/maps/UAcHeKbps4EyH4by7

Nearest MRT is Outram Park (EW16 / NE3)

Public transport from Outram Park
https://goo.gl/maps/zB2oUzyMxFnAoBABA

Walking over from Outram Park
https://goo.gl/maps/WQe1cVQo5d8Ztgz76

-----

In the event where your schedule got blocked up and you need to cancel your appointment. Click on the link below!
https://booking.ministryofpup.com/#/cancel/${appointmentID}

-----

Whatsapp us through https://wa.me/6588022177

Email us at ministryofpup@gmail.com

Or call us at 88022177 daily between 10am - 8pm for help`;

// Generate event object for the calendar links using data from state
const getCalendarEventObj = (state) => ({
  title: "Play session at Ministry Of Pup!",

  start: state.selectedTimeslot,
  duration: [30, "minutes"],
  busy: true,

  description: calendarDescription(state.details.fname, state.appointmentID),
  location: "43 Kampong Bahru Rd, Singapore 169359",
});

const calendarLinks = (event) => [
  // @todo Only show this if user using iphone
  div(
    { class: "column is-half" },
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
    { class: "column is-half" },
    a(
      {
        class: "button is-fullwidth",
        href: google(event),
        target: "_blank",
      },
      text("Google Calendar")
    )
  ),

  div(
    { class: "column is-half" },
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
    { class: "column is-half" },
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
    { class: "column is-half" },
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

const view = ({ dog, selectedTimeslot, details, appointmentID }) =>
  div({ class: "px-5 pt-5", style: { "max-width": "30em" } }, [
    div({ class: "columns is-multiline is-mobile" }, [
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
          text(new Date(selectedTimeslot)),
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

      ...calendarLinks(
        getCalendarEventObj({ selectedTimeslot, details, appointmentID })
      ),

      // @todo Add a section with our contact details like the email so they can find us if anything
      // The generated google cal invite should have a details, with a link to cancel or change appt time if needed
    ]),
  ]);

export default view;
