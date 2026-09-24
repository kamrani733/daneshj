# Daneshjoam SRS (converted for AI tooling)

Source: `SRS_daneshjoam_V0__SRV050630.docx` — version V0, dated 1405/06/30 (≈ 2026-09-21).
Authors: Hani Taheri (created), Maryam Ahangar (last edited).

The SRS text in these files is **verbatim** Persian. Only the layout was changed: the feature summary table now
appears once per feature instead of before every path, and each path is a `####` heading followed by a
precondition / operation details / postcondition table. The SRS contains **Chapter 2 only** (no introduction,
no non-functional requirements, no data model).

## Files

| File | Service | Feature codes | Status in SRS |
| --- | --- | --- | --- |
| `01-SRV-general-service-pages.md` | General service pages (terms, help, providers, products, user services, approvals) | Act(SRV)-503/504/505/506/525, Usr(SRV)-522 | Specified, light |
| `02-Rwd-rewards.md` | Rewards (پاداش) | Rwd-1, Rwd-2, Rwd-4 | Partial |
| `03-Dsc-discount.md` | Discount on goods & services (تخفیف کالا و خدمات) | Dsc-1 … Dsc-7 | Most detailed |
| `04-Rfl-invite-friends.md` | Invite friends / referral (دعوت از دوستان) | Rfl-1, Rfl-2 | Specified |
| `05-Msg-messaging.md` | Messaging (پیام) | Msg-1, Msg-2, Msg-3 | Specified |
| `06-Nws-news.md` | News (اخبار) | Nws-1 … Nws-6 | Specified |
| `07-Nwl-newsletter.md` | Newsletter (خبرنامه) | Nwl-1 … Nwl-10 | Specified; "Settings" (2-35-11) empty |
| `08-Cln-calendar-events.md` | Calendar events (رخدادهای تقویمی) | Cln-1 … Cln-7 | Specified |
| `99-not-specified.md` | Cashback, gift cards, university courses, cross-border events, research, Patogh, all jobs/internship/military-service/BID services | — | Headings only |
| `path-index.md` | Every declared path code (≈550) with actor, type, feature and file | — | Checklist for implementation status |

## Code format

- Feature code: `<Service>-<n>`, e.g. `Dsc-2`. General pages use `Act(SRV)-5xx`.
- Path code: `<Actor>-<Service>-<n><N|E><k>`, e.g. `Adm-Dsc-2N1` (normal path 1), `Usr-Nws-1E1` (exception path 1).
  General pages use `<Actor>(<Service>)-5xxN<k>`, e.g. `Usr(Bus)-505N1`.
- Actors: `Usr` = user/student (کاربر), `ASR` = service provider (سرویس‌دهنده), `Adm` = administrator (راهبر),
  `Sys` = system-triggered path, `Act` = any actor. Guest = کاربر میهمان.
- `SRV` = any service, `Bus` = the discount/business service, `Rfl` = referral.

## Glossary (Persian → English)

| Persian | English |
| --- | --- |
| راهبر | Admin |
| سرویس‌دهنده / کسب و کار | Service provider / business |
| کاربر / کاربر میهمان | User / guest |
| عملگر | Actor (whoever performs the action) |
| پنل عملیاتی / پنل راهبری | Operational panel (user/provider) / admin panel |
| محصول | Product (discount offer) |
| برگه تخفیف | Discount voucher |
| رسید پرداخت | Payment receipt |
| کد تخفیف عمومی / خصوصی | Public / private discount code |
| انتشار / لغو انتشار | Publish / unpublish |
| تایید / رد | Approve / reject |
| دلیل رد / لغو / تعلیق | Rejection / cancellation / suspension reason |
| تعلیق / بازگشت از تعلیق | Suspend / unsuspend |
| آرشیو / لغو آرشیو | Archive / unarchive |
| حذف / بازگردانی | Delete (soft) / restore |
| دسته‌بندی اصلی / فرعی | Main / sub category |
| گفتگو / پیام | Conversation / message |
| برگزیدن | Pin / favourite |
| حذف یکطرفه / دوطرفه | Delete for me / delete for everyone |
| خبرنامه | Newsletter |
| رخداد تقویمی | Calendar event |
| پیشنهاد رخداد | Event suggestion (by user) |
| پاداش / پاداش منفی | Reward / negative reward (penalty) |
| اعلان | Notification |
| گزارش کردن | Report (abuse) |
| گزارش‌ها، آمارها و نمودارها | Reports, statistics and charts |
| لاگ در دیتابیس | Audit log entry |

## Cross-service patterns (repeated across Dsc, Nws, Nwl, Cln)

These recur almost identically and should be implemented once as shared abstractions:

1. Approval workflow: provider submits → admin approves or rejects with a reason chosen from a managed list;
   field-level approve/reject on edits of published items (Dsc-2).
2. Soft delete with restore "for a specified period" (the period is never defined in the SRS).
3. Archive / unarchive.
4. Two-level categories with errors for duplicate names and for deleting a main category that has sub-categories.
5. Managed reason lists (rejection / cancellation / suspension) with an error when deleting a reason in use.
6. Notifications to the counterpart actor on create / edit / approve / reject.
7. Audit logging with actor ID, timestamp and entity ID.
8. Reports, statistics and charts per service.
9. File upload errors for wrong format and wrong size.
10. Guest access error ("خطای عدم دسترسی کاربر میهمان").

## Known issues in the SRS

Treat these as SRS errors, not as requirements. The correct value is the one in the feature summary table unless
noted otherwise.

- 3-1-2: path header says `(Rfl)-503N2`; summary says `(Bus)-503N2` (correct).
- 4-1-2: path header says `(Rfl)-509N2` and is titled "Terms"; should be `(Bus)-504N2`, "Help".
- 5-1-2: detail tables use feature code `Act(SRV)-501`; should be `505`.
- 4-8-2: summary uses `Usr-Rwd-4N2/4N4/4N6`; details use `Adm-…`.
- 1-12-2 (referral link) appears twice; the second copy has one path only. Some tables use `Rfl1` instead of `Rfl-1`.
- 3-22-2: one path is coded `Adm-Rwd-4N1` (copied from Rewards).
- 5-34-2 (News categories): labeled feature `Nws-4` (should be `Nws-5`); path headers use `Adm-Dsc-5N…` copied from Discount.
- 2-35-5 (Report newsletter): feature name reads "Suspend / unsuspend newsletter"; path header uses `Nwl-6N1` instead of `Nwl-5N1`.
- 2-35-8: some tables coded `Nwl-9`; 2-35-9 exceptions coded `Adm-Nwl-4E1…E3`; `Nwl_7` appears as a malformed code.
- Newsletter: `ARS-` appears as a typo for `ASR-` (`ARS-Nwl-1N3`, `ARS-Nwl-2N3`).
- 2-38-1 summary lists `Usr-Cln-3N1/3N2`; 2-38-2 details use `Cln-3N7/3N8` instead of `Cln-2N7/2N8`.

## Declared but not detailed

Paths listed in a summary table with no detail block:
`Usr(Bus)-506N4`, `Usr-Rwd-2E1`, `ASR-Dsc-2N9`, `ASR-Dsc-3E3`, `Dsc-4N4…N7` and `Usr-Dsc-4E2` (flagged red: pending
decision), `Adm-Dsc-5N9/N10`, `Usr-Msg-2E2`, `Adm-Msg-3N1`, `Usr-Msg-3N5`, `Adm-Cln-1N5/N8/N9`, `ASR-Nwl-10N13`.

## Review flags from the original document

The Word file uses highlight colors for review status. They are not preserved here; the important ones are:

- Red (decide keep/remove): Rewards TOC items 2-8-2 … 8-8-2 (cash-out, pay to user, add to wallet, active services list,
  pay with reward, define rewarded activities, define rewards per service) — none are specified in the body;
  Dsc-4 paths N4–N7 (create public code, approve / reject / edit payment receipt).
- Yellow (ambiguous): TOC items 23-1-2, 2-10-2 … 4-10-2 (similar/nearby campaigns, related tags), 7-10-2, 7-12-2;
  path `Adm-Nwl-3N1` (admin creates newsletter).
- Magenta (needs verification), heaviest in: Dsc categories (5-10-2), Messaging conversations, News viewing (1-34-2),
  News reports, Newsletter report/archive/download logging, Newsletter reasons and categories (2-35-8, 2-35-9),
  Calendar event suggestions (2-38-4).
- Green (recently added): Dsc product create/edit field-level approval flow, Dsc-4 automatic private codes,
  Dsc-6E1, Nws-4E1, Cln-1 paths, 2-38-6.
