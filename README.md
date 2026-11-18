# agent-pattern

A Claude Code plugin that makes agents prove their work instead of claiming it. Install it once; it applies to every repo that adopts the contract below.

## Habits

| Habit | Enforcement | Strength |
|---|---|---|
| 1. Checks over written rules | `npm run verify`, run by the gate | Deterministic |
| 2. Validate at the boundary | Lint bans `as` casts and `any` | Deterministic, TypeScript only |
| 3. Invalid states can't exist | Strict mode + exhaustive switches | Deterministic, TypeScript only |
| 4. Tests fail when behavior breaks | PR shows the test failing before the fix | Evidence |
| 5. Check before claiming done | Gate blocks finishing once while verify fails; then the agent must report the failure | Deterministic gate |
| 6. Remove before adding | `reviewer` agent | Judgment |
| 7. Error messages say what failed | `reviewer` agent | Judgment |
| 8. Comments only for constraints | `reviewer` agent | Judgment |

## What's in it

| Path | What it does |
|---|---|
| `hooks/hooks.json`, `scripts/verify-gate.mjs` | On `Stop` and `SubagentStop`, runs `npm run verify`. On failure, sends the agent back once with the output. |
| `agents/reviewer.md` | Read-only review for habits 6–8. |
| `skills/new-agent/` | Interviews you, then writes a narrow agent to `.claude/agents/`. |
| `.mcp.json` | Claude Code docs server, so agents check current behavior instead of guessing. |
| `.claude-plugin/marketplace.json` | Lists this repo as the `reiirene` marketplace, so `/plugin` can install it. |

## Use

Install once, in a Claude Code session (v2.1.275 or later):

```
/plugin install agent-pattern --marketplace reiirene/agent-pattern
```

Or in two steps, which works on older versions:

```
/plugin marketplace add reiirene/agent-pattern
/plugin install agent-pattern@reiirene
```

From your shell, run the same commands as `claude plugin marketplace add ...` and `claude plugin install ...`.

To get a new release, run `claude plugin update agent-pattern@reiirene`. Updates arrive only when `version` in `plugin.json` changes.

To try a local checkout for one session without installing:

```
claude --plugin-dir /path/to/agent-pattern
```

## The per-repo contract

A repo opts in by defining `verify` in `package.json`. Without it, the gate does nothing.

```json
"scripts": { "verify": "tsc --noEmit && eslint . && npm test" }
```

Run the same command in CI; hooks only run inside Claude Code.

For TypeScript repos, `tsconfig.json` sets `"strict": true`, and `eslint.config.js` turns on:

```js
"@typescript-eslint/no-explicit-any": "error",
"@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
"@typescript-eslint/switch-exhaustiveness-check": "error",
```

The last rule needs type-aware linting.

## Changing this plugin

Every change traces to an entry in `corrections.md`. `npm run verify` must pass.
