---
name: new-agent
description: Design a new subagent by interviewing the user, then write it to the project's .claude/agents/. Use when the user wants to create, design, or set up an agent or bot.
---

# New agent

## 1. Interview

Ask one question at a time. Stop when you can answer all of these:

- What one task does the agent do? If the answer has "and" in it, propose two agents or a narrower one.
- What does finished look like, as something a command can check?
- Which files may it read? Which may it change?
- Which tools does it need? Start from none and add only what the task requires.

## 2. Check current behavior

Before writing, use the `claude-code-docs` MCP server to confirm the current subagent frontmatter fields. Don't rely on memory for them.

## 3. Write the agent

Write `.claude/agents/<name>.md` with:

- `name` and a `description` that says when to use it
- `tools`: only the ones from the interview
- A body that includes, word for word:

  > You're done when `npm run verify` passes. Show the command output; don't describe it.
  > List any decisions you made separately from the requirements you were given.

## 4. Restate

Restate in your own words what the agent does and what it may not do. Ask the user to confirm before they use it.
