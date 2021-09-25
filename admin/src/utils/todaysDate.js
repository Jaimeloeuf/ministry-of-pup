// Function to get today's date in the string format for use with input tag type="date"
export default function todaysDate() {
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1; // Jan is 0, thus convert to 1 indexed first
  const yyyy = today.getFullYear();

  return `${yyyy}-${mm < 10 ? "0" + mm : mm}-${dd < 10 ? "0" + dd : dd}`;
}
