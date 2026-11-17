import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const MAX_OUTPUT = 4000;

const input = JSON.parse(readFileSync(0, "utf8") || "{}");

// One retry: the agent was already sent back once, so let it finish and report.
if (input.stop_hook_active) process.exit(0);

const dir = input.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
const pkgPath = join(dir, "package.json");
if (!existsSync(pkgPath)) process.exit(0);

const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
if (!pkg.scripts?.verify) process.exit(0);

const run = spawnSync("npm", ["run", "verify", "--silent"], {
  cwd: dir,
  encoding: "utf8",
  shell: process.platform === "win32",
});
if (run.status === 0) process.exit(0);

const output = `${run.stdout ?? ""}${run.stderr ?? ""}${run.error ? String(run.error) : ""}`;
const tail = output.length > MAX_OUTPUT ? `…${output.slice(-MAX_OUTPUT)}` : output;

console.log(
  JSON.stringify({
    decision: "block",
    reason:
      `npm run verify failed (exit ${run.status}). Fix it and finish again. ` +
      `If you can't, say so plainly and include this output; do not claim the work is done.\n\n${tail}`,
  }),
);
