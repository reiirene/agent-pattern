import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const gate = join(import.meta.dirname, "..", "scripts", "verify-gate.mjs");

function repo(scripts) {
  const dir = mkdtempSync(join(tmpdir(), "gate-"));
  if (scripts) writeFileSync(join(dir, "package.json"), JSON.stringify({ scripts }));
  return dir;
}

function runGate(dir, extra = {}) {
  const run = spawnSync("node", [gate], {
    input: JSON.stringify({ cwd: dir, stop_hook_active: false, ...extra }),
    encoding: "utf8",
  });
  assert.equal(run.status, 0, `gate itself crashed: ${run.stderr}`);
  return run.stdout.trim() ? JSON.parse(run.stdout) : null;
}

const fail = 'node -e "console.error(\'boom: 2 tests failed\'); process.exit(1)"';
const pass = 'node -e "process.exit(0)"';

test("blocks when verify fails, and passes the output back", () => {
  const result = runGate(repo({ verify: fail }));
  assert.equal(result?.decision, "block");
  assert.match(result.reason, /boom: 2 tests failed/);
});

test("allows finishing when verify passes", () => {
  assert.equal(runGate(repo({ verify: pass })), null);
});

test("allows finishing on the retry, so the agent reports instead of looping", () => {
  assert.equal(runGate(repo({ verify: fail }), { stop_hook_active: true }), null);
});

test("does nothing in a repo that hasn't adopted the contract", () => {
  assert.equal(runGate(repo({ test: fail })), null);
  assert.equal(runGate(repo()), null);
});

test("gates both the main agent and subagents", () => {
  const { hooks } = JSON.parse(readFileSync(join(import.meta.dirname, "..", "hooks", "hooks.json"), "utf8"));
  for (const event of ["Stop", "SubagentStop"]) {
    const commands = hooks[event]?.flatMap((m) => m.hooks.map((h) => h.command)) ?? [];
    assert.ok(commands.some((c) => c.includes("verify-gate.mjs")), `${event} must run verify-gate.mjs`);
  }
});
