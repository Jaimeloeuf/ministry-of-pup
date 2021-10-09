import { oof } from "simpler-fetch";

// Effect to call the cancel appointment API and update state once cancelled
// Have a recaptcha layer to prevent spam/bots
export const cancelAppointment = async (dispatch, appointmentID) =>
  grecaptcha.ready(function () {
    grecaptcha
      .execute("6Lcex6QcAAAAADus4RtnoqwskQoXcB2DwgCav11Z", {
        action: "cancelAppointment",
      })
      .then(
        // Main API call logic of the cancel appointment Effect
        async function _cancelAppointment(token) {
          const response = await oof
            .DEL(`/appointment/cancel/${appointmentID}?token=${token}`)
            .run()
            .then((response) => response.json());

          // Maybe set something in state instead to show a retry UI or smth
          if (!response.ok) throw new Error(response.error);

          // Anonymous function action
          dispatch((state) => ({ ...state, cancelled: true }));
        }
      );
  });
