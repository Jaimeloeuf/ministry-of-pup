module.exports = (time) =>
  new Intl.DateTimeFormat("en-SG", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Singapore",
  }).format(new Date(time));
