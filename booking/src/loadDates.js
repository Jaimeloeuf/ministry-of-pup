import { oof } from "simpler-fetch";

// @todo Might add in recaptcha again to help recaptcha learn user's usage behaviour
// Effect to get more timeslots from the API and add them to state
export const loadDates = async (dispatch, after) => {
  const response = await oof
    .GET(
      after
        ? `/appointment/available/date?after=${after}`
        : "/appointment/available/date"
    )
    .run()
    .then((response) => response.json());

  // Maybe set something in state instead to show a retry UI or smth
  if (!response.ok) throw new Error(response.error);

  dispatch(
    // Anonymous function action
    (state, newTimeslots) => ({
      ...state,
      datesAvailable: [...state.datesAvailable, ...newTimeslots],
    }),

    response.timeslots
  );
};
