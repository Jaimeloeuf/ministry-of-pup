const isToday = (date, tdy = new Date()) =>
  date.getDate() === tdy.getDate() &&
  date.getMonth() === tdy.getMonth() &&
  date.getFullYear() === tdy.getFullYear();

/**
 * Formats a datetime in milliseconds to a date string, with custom styling if date is today
 * @param {Number} timeInMilliseconds Date time stored as milliseconds since unix epoch time
 * @returns {String} Formatted date string
 */
export default function formatDate(timeInMilliseconds) {
  const date = new Date(timeInMilliseconds);

  return isToday(date)
    ? "Today " +
        date.toLocaleString("default", {
          timeStyle: "short",
        })
    : date.toLocaleString("default", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}
