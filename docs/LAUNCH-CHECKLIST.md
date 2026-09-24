---
title: "Launch Checklist"
description: "First-launch steps for Daneshjoam"
category: "operations"
last_updated: "2026-09-25"
---

# Launch Checklist

## Handover values

| Item | Value |
|------|-------|
| Production URL | TBD |
| Staging URL | TBD |
| Microservice base URLs | TBD |
| Monitoring project | TBD |

## Backend

- [ ] Actor types / permissions returned in session
- [ ] Endpoints live for each service in scope
- [ ] Soft-delete retention configured
- [ ] Payment gateway callbacks configured (events, Dsc)
- [ ] Rate limits on login/OTP, messages, reports, referral links

## Environment & deployment

- [ ] `.env.example` complete; env matrix per environment on Vercel
- [ ] Security headers verified
- [ ] CI: lint, test, build, e2e (real project)

## Smoke tests

- [ ] Login/logout as Usr, ASR (natural + legal), Adm; guest browsing
- [ ] Each in-scope service: list → detail → main action → admin moderation
- [ ] RTL, Jalali dates, mobile layout on key screens

## Sign-off

- [ ] Security review
- [ ] Product owner
- [ ] Backend team
