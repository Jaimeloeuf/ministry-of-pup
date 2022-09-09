"use strict";

/**
 * @module mem
 *
 * CLI Module used to run the API server and check how much ram it is using.
 *
 * To use this script:
 * `node .\mem.js .\src\index.js`
 */

const pidusage = require("pidusage");

const child = require("child_process").spawn(
  // reuse to work with the same binary name used to run this (node|nodejs|...)
  process.argv[0],

  // array with filePath & arguments to spawn for this analisis
  [process.argv[2]],

  {
    // So the child_process doesn't behave like a child
    // detached: true,
    // stdio: ["ignore"],
    stdio: "inherit",
  }
);

console.log(
  // reuse to work with the same binary name used to run this (node|nodejs|...)
  process.argv[0],

  // array with filePath & arguments to spawn for this analisis
  [process.argv[2]],

  child.pid
);

process.on("SIGINT", () => {
  console.log("Terminating...");
  child.kill("SIGINT");
  process.exit(0);
});

process.on("exit", function () {
  child.kill("SIGINT");
});

const interval = (time) =>
  setTimeout(async function () {
    // Print out memory usage in megabytes
    const { memory } = await pidusage(child.pid);
    console.log(Math.round(memory / 1000 / 1000) + " megabytes");

    // Only call itself again after pidusage has successfully returned a value
    interval(time);
  }, time);

// Compute statistics every second:
interval(1000);
