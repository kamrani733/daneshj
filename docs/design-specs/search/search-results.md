# Search results («نتایج جستجو») — desktop

Source: four Figma frame screenshots shared by the owner on 2026-10-07 (default, filter collapsed with service
picker, service picked with categories, query «کافه»). Figma file `aKH5AZkwgcEfmh96gHTTWE`; **node ids not
known** — the Figma MCP call limit was reached, so nothing below was read from Figma variables. Values are
measured from the 1512-wide screenshots and mapped to existing tokens. Verify when MCP is available.

## Texts (verbatim)

نتایج جستجو · موضوع جستجو · ۳۱ نتیجه یافت شد · محصولات (۲۵) · سرویس‌ها (۳) ·
سرویس دهنده‌ها (نتیجه ای یافت نشد) · کاربران (۳) · فیلتر ها · مشاهده همه · مشاهده کمتر · عنوان سرویس ·
پس از انتخاب سرویس، فیلترهای بیشتر نمایش داده می‌شود. · با تغییر سرویس، فیلترهای دسته‌بندی به روزرسانی می‌شوند ·
پاک کردن · اعمال فیلتر

## Layout

| Element | Measure | Implementation |
|---|---|---|
| Content | 1312 wide (100 px side padding at 1512) | same container as home |
| Title | orange bar + dark-green title | `SectionHeading` tone secondary, `as="h1"` |
| Query field | pill, 720 × 56, start-aligned, search icon start, × end | `SearchField` size xl + `onClear`, `max-w-180` |
| Group header | 1312 × 72, radius 12, border, title (primary, bold) + «فیلتر ها» | `rounded-medium border-outline-variant bg-surface-container-low`, `min-h-18` |
| Cards | 3 columns, gap 24, card 96 high, 80 × 80 image at start, radius 8 | `CompactMediaCard` |
| User cards | faint green surface | `tone="accent"` → `bg-app-filter-bar` |
| Show more | orange bold, end-aligned under the grid | `Button` link + `text-secondary` |
| Filter row | service picker in column 1 (outlined 56, radius 4), info hint (primary) in columns 2–3 | `SearchSelect` + lucide `Info` |
| Categories | 3 columns, 52 per row, checkbox in a 40 state layer + label, chevron at column end | `CategoryFilterList` + `Checkbox` |
| Actions | end-aligned: «پاک کردن» (soft) then «اعمال فیلتر» (filled), pill 40 | `Button` `soft` / default, `pillSm` |

## Token mapping (assumed — confirm in Figma)

Group header fill → `surface-container-low`; card fill → `surface-container-lowest` (rule default; the
screenshot looks slightly warmer); border → `outline-variant`; group title → `primary`; empty group title →
`primary` too (filter + mobile frames; the first page frame showed it dark); hint → `primary`; show-more →
`secondary`.

## Not in the design (decisions taken)

- Tablet: no page frame — grid 2 columns from 640; filter grids per the filter frames.
- Provider card: not shown (empty group in every frame) — uses `CompactMediaCard` with the name only.
- Filter labels follow the Figma component frames, not the home menu: the mock maps the menu trees
  (`CATEGORY_MENU_ITEMS`, `SERVICES_MENU_ITEMS`) through label/order overrides («کافه و رستوران» → «غذا و
  رستوران / کافه / اسنک», «تعمیرات و نگهداری» … «نظافت», «زیورآلات», books order «کتاب، لوازم التحریر،
  کتاب صوتی», shorter services labels such as «پاداش»). `nav-data.ts` is unchanged; the API is expected to
  send the Figma labels.

## Filters (frames `422:59585` … `422:60438`, shared 2026-10-07)

Every group header has «فیلتر ها»: closed = regular `on-surface-variant`, open = medium `on-surface`.
The panel opens inside the same bordered box; footer «پاک کردن» (soft) + «اعمال فیلتر» (filled) at the end.

| Group | Panel | Options | Columns (phone / tablet / desktop) |
|---|---|---|---|
| محصولات | service picker «عنوان سرویس» + hint (one row from tablet), then the service's categories | discount → discount category tree; other services → their own tree («دسته بندی یک» … in Figma) | picker row 1 / 2 / 3 · categories 1 / 2 / 3 |
| سرویس‌ها | collapsible «دسته بندی های اصلی و فرعی» | services tree: رفاهی, مالی, بیمه, آموزش, اطلاع رسانی و اجتماعی, صنعت و دانشگاه, اشتغال (+ subs) | 1 / 2 / 3 |
| سرویس دهنده‌ها | collapsible «سرویس دهنده» | حقیقی (انفرادی), حقوقی | compact: 144 px items, 224 px from 1024 |
| کاربران | collapsible «کاربران» | کاربر عادی, دانشجو, فارغ‌التحصیل | compact (as above) |

Category item (component frames, 2026-10-07): checkbox 18 inside a 40 × 40 round state layer (hover
`on-surface/8` over the whole row), 8 between it and the label · main label `body-medium` medium
`on-surface` (flat provider/user options regular) · chevron 24, `on-surface`, in a 40 round button, up when
open · subs indented 24, label regular `on-surface-variant`, rows 48 · labels wrap instead of truncating
(long services labels run to two lines on phones).

Measured: header 72 · checklist rows 52 · compact rows 52 + 8 gap · collapsible title row with chevron at
the end of the first column (primary + chevron up when open, on-surface + chevron down when closed) ·
26 px between the last row and the actions · 24 px bottom padding.

Decisions where frames disagree (confirm): actions always visible (desktop «محصولات» frame hides them before
a service is picked); tablet placeholder «انتخاب سرویس» → «عنوان سرویس» like desktop/mobile; copy-paste labels in tablet/mobile frames («حقوقی» under کاربران, «حقوقس»,
«دسته بندی های اصلی و فرعی» under کاربران) follow the desktop frame; «حقیقی (انفرادی)» is not forced onto two
lines; a long picked service is truncated in the picker (the mobile frame wraps it to two lines).

## Mobile page (390, shared 2026-10-07)

Title → query pill → groups (no «N نتیجه یافت شد» line). Group header ~60 high; «(۰)» instead of
«(نتیجه ای یافت نشد)». Up to 4 full-width cards per group (96 high, 80 × 80 image), 12 px apart; 16 px between a
header and its cards; 24 px between groups. Filter panels as in the filter frames (1 column).
The frames show no «مشاهده همه»; it is kept on phones so the rest of a group stays reachable.

## No result (desktop, shared 2026-10-07)

Title → query pill → «پرجستجوترین‌های هفته:» box → illustration → «هیچ نتیجه ای یافت نشد». Measured on the
1512 frame: box full content width, 104 high, fill `#fff5eb` (= `featured-container`), radius 16, title
bold 14 `on-surface-variant` 16 px from the top/start, items regular 14 `on-surface-variant` 40 px apart
(«عنوان (N جستجو)»), 24 px between field and box. Illustration = the owner's `Empty state1.svg` (320 × 320,
fill `#707973` = `outline`), its frame starts right under the box; message 16 medium `outline`, ~20 px below.
No total line, no groups. Shown only when nothing matches and no filter is applied (decision: with a filter
the groups stay so it can be undone). Mobile: no frame — same blocks stacked, illustration 256 px.
