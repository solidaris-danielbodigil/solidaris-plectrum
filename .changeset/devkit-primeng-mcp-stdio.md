---
"@solidaris-danielbodigil/pds-devkit": patch
---

The PrimeNG MCP server now works in application editors. `https://primeng.org/mcp` is not an MCP endpoint, so `plectrum init` and `plectrum update` configure `plectrum-primeng` as the stdio package `@primeng/mcp@21.1.9` in `.cursor/mcp.json` and `.vscode/mcp.json`. New projects get `mcp.primeNg: true`; existing configs that still hold the old URL are read as `true`, and `plectrum update` replaces the URL server it wrote earlier (a server the team edited by hand is reported as a conflict, as before). Another http(s) URL stays a remote server. `plectrum doctor` reports the stdio server, suggests replacing the old URL with `true`, and with `--live` starts the server and checks that it answers `initialize`.

The central rules shipped in `rules/central/` name the stdio server instead of the old URL.
