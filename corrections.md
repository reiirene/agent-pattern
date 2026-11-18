# Corrections log

One line per time an agent got something wrong. Every change to this plugin traces to an entry here.

| Date | What the agent did | What I wanted | Layer it belongs in | Status |
|---|---|---|---|---|
| 2026-11-17 | Claude said `/agents` helps manage subagents; the wizard was removed in v2.1.198 | Claims about current behavior checked against docs | Verification (cite the source) | Fixed: claude-code-docs MCP server |
| 2026-11-17 | Claude said a Stop hook gives "one push back"; that depends on the hook checking stop_hook_active, and Claude Code also caps consecutive blocks (8 by default) | Product behavior vs. my hook design kept separate | Verification (cite the source) | Fixed: claude-code-docs MCP server |
