---
"@solidaris-danielbodigil/pds-devkit": minor
---

Add `plectrum mcp`, an offline MCP server over stdio that answers editor agents from the installed catalogue, tokens and process (`search_components`, `get_component`, `find_token`, `check_tokens`, `get_process`). `plectrum init` now configures it with the Figma remote MCP server (OAuth in the editor) and the application's own Storybook MCP at `http://localhost:6006/mcp`; generated Storybooks add `@storybook/addon-mcp`. Existing projects keep their `.plectrum/config.json` values; `plectrum doctor` lists the recommended ones.

Measure the Plectrum agent without collecting content: MCP tool calls and CLI commands record tool names, component IDs and outcomes in `.plectrum/telemetry` (ignored by git, off with `telemetry.enabled: false`), and `adoption-report` adds a 30-day `agent` block with these counts and the `Plectrum-Agent:` commit trailers.
