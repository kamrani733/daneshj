---
title: "Testing Checklist: [Release / Feature Name]"
description: "Manual and automated verification before merge or release"
category: "testing"
last_updated: "YYYY-MM-DD"
---

# Testing Checklist: [Release / Feature Name]

## Run metadata

| Field | Value |
|-------|-------|
| Date | YYYY-MM-DD |
| Tester | |
| Environment | local / staging / production |
| Branch / commit | |
| Data source | mock / real backend |

## Pre-flight

- [ ] `nx affected -t lint` passes
- [ ] `nx affected -t test` passes
- [ ] `nx affected -t build` passes
- [ ] Env vars documented and set
- [ ] RTL + mobile checked on changed screens

## Automated tests

| Suite | Command | Result |
|-------|---------|--------|
| Unit | `nx affected -t test` | Pass / Fail |
| E2E | `[command]` | Pass / Fail / N/A |

## Manual journeys

### Journey 1 — [Name]

**Role:** Role A  
**Preconditions:** ...

| Step | Action | Expected | Pass |
|------|--------|----------|------|
| 1 | | | ☐ |
| 2 | | | ☐ |

### Journey 2 — [Name]

| Step | Action | Expected | Pass |
|------|--------|----------|------|
| 1 | | | ☐ |

## Regression spots

- [ ] Area unrelated to change still works
- [ ] Auth redirects correct for wrong role
- [ ] No console errors on happy path

## Accessibility spot check

- [ ] Keyboard navigation on primary flow
- [ ] Form errors announced / visible
- [ ] Focus visible on interactive controls

## Issues found

| ID | Severity | Summary | Status |
|----|----------|---------|--------|
| | Critical / Major / Minor | | Open / Fixed |

## Sign-off

- [ ] Ready to merge / deploy
- Notes:
