# Rules — 07 Version Control

---

## Table of Contents

1. [Branches](#1-branches)
2. [Commits](#2-commits)
3. [Pull Requests](#3-pull-requests)

---

## 1. Branches

- All new work happens on a **feature branch** — never directly on `main`
- Branch naming: `feature/{short-description}`, `fix/{short-description}`, `chore/{short-description}`
- Keep branches short-lived — merge or close within the sprint

---

## 2. Commits

- Write clear, descriptive commit messages
- Use the imperative mood: `Add NavShell component`, not `Added NavShell`
- Reference the relevant component or token area in the message
- Do not commit commented-out code, debug statements, or `console.log`

---

## 3. Pull Requests

- All PRs must be reviewed by at least one other developer before merge
- PRs must pass CI (build, lint, tests) before merge
- PRs touching shared `libs/` require a design-system review if they change tokens or components
- Run `npm run generate-index` and commit the updated `index.json` when components are added or modified
