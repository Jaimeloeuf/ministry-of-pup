/**
 * Initial State to be applied into vuex
 * Wrapped in function to prevent shallow copying state modification with object references
 */
export default function initialState() {
  return {
    user: {
      // @todo Optional, might remove
      id: undefined,

      email: undefined,
      name: undefined,
    },
  };
}
