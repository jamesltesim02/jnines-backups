const spawn = require("cross-spawn");
const scriptPath = require.resolve('react-app-rewired/scripts/start.js');

process.env.WIDGET_MODE = true

const child = spawn.sync(
  "node",
  [scriptPath],
  { stdio: "inherit" }
);

if (child.signal) {
  if (child.signal === "SIGKILL") {
    console.log(`
      The build failed because the process exited too early.
      This probably means the system ran out of memory or someone called
      \`kill -9\` on the process.
    `);
  } else if (child.signal === "SIGTERM") {
    console.log(`
      The build failed because the process exited too early.
      Someone might have called  \`kill\` or \`killall\`, or the system could
      be shutting down.
    `);
  }

  process.exit(1);
}