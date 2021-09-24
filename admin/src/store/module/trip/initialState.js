/**
 * Initial State applied into vuex module
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    // Right now any trip that is not the current trip, is technically an old trip
    // Because this does not allow you to pre-create a trip first, before u actually go on the trip
    // The app assumes you are going on the trip immediately when u create the new trip, so no pre-created trips for now
    trips: {},

    // Trip ID, where trip is in trips, undefined if user is not currently on any trip
    // Current trip is defined by a trip that has been started but not yet completed, with missing trip object fields
    currentTrip: undefined,
  };
}
