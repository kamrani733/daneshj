---
title: "Deployment Checklist: [Environment / Release Name]"
description: "Pre-deploy, deploy, and post-deploy verification"
category: "operations"
last_updated: "YYYY-MM-DD"
---

# Deployment Checklist: [Environment / Release Name]

## Release summary

| Field | Value |
|-------|-------|
| Version / tag | |
| Target environment | staging / production |
| Deploy owner | |
| Rollback owner | |
| Maintenance window | |

## Pre-deploy

### Code quality
- [ ] PR approved
- [ ] CI green (lint, test, build)
- [ ] No open Critical/Major review findings

### Backend dependencies
- [ ] Required microservice versions deployed
- [ ] Mock-to-real switches verified per service

### Configuration
- [ ] New env vars added to host secrets
- [ ] `.env.example` and `docs/08-configuration.md` updated
- [ ] Feature flags set correctly

### Communications
- [ ] Stakeholders notified if user-visible downtime
- [ ] Support runbook updated if needed

## Deploy steps

1. Merge to deploy branch: `[branch name]`
2. Trigger deploy: `[platform / command]`
3. Verify deploy version: `[how]`

## Post-deploy verification

### Smoke tests (production/staging)

| Check | Expected | Pass |
|-------|----------|------|
| App loads | 200, login works | ☐ |
| Critical Workflow A | completes | ☐ |
| Health / API endpoint | OK | ☐ |

### Monitoring

- [ ] Error rate normal
- [ ] Latency normal
- [ ] Background jobs processing
- [ ] External integrations (email, payments) healthy

## Rollback plan

**Trigger conditions:**
- ...

**Steps:**
1. ...
2. ...

**Migration rollback notes:**
- Forward-only migrations: describe repair strategy

## Post-release

- [ ] Update `docs/CURRENT-PROGRESS.md`
- [ ] Close release ticket
- [ ] Schedule follow-up for known gaps (if any)

## Incident contacts

| Role | Contact |
|------|---------|
| On-call | |
| DBA / infra | |
