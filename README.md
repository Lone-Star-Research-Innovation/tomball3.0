# Growing LSC-Tomball 3.0 — Page Redesign

A redesign of the **Growing LSC-Tomball 3.0** page
(current official page: <https://www.lonestar.edu/tomball3-0.htm>).

There are two versions:

| Version | File | What it is |
|---------|------|------------|
| **CMS version (main)** | `index.html` | Built within the limits of the college CMS, using the same techniques as the [XR Lab](https://www.lonestar.edu/Tomball-XR-Lab) and [RIC](https://www.lonestar.edu/tomball-ric) pages. This is the version intended for lonestar.edu. |
| **GPA+ sub-page (CMS)** | `gpa-plus/index.html` | Redesign of [Transferable Skills Benchmark GPA +](https://www.lonestar.edu/118051), a sub-page of the 3.0 page. Same approach as the main CMS version. |
| **Modern option** | `modern/index.html` | A fully custom standalone design. It shows what the page could look like without CMS limits, and it's the source of the CMS version's interactive widgets. |

Both are plain HTML, CSS, and JavaScript, with no framework, no build step, and
nothing to install. Neither is an official Lone Star College page.

---

## Project structure

```
tomball3.0/
├── index.html              CMS version (main): page content + preview wrapper
├── gpa-plus/index.html     CMS version of the GPA+ sub-page (lonestar.edu/118051)
├── widgets/
│   ├── milestones.html     Embeddable timeline with year filter (iframe on the CMS page)
│   └── resources.html      Embeddable resource library with search and categories
├── modern/index.html       Modern standalone design option
├── js/data.js              ← CONTENT: milestones, resources, team (used by widgets + modern)
├── js/main.js              Shared behavior: renders data.js, filters, search, icons
├── css/styles.css          Shared styling for widgets and the modern page
├── assets/favicon.svg
├── archive/                The original single-file prototype
└── README.md
```

## How the CMS version works

lonestar.edu runs **OpenText Web Site Management** (formerly RedDot). It doesn't
reliably keep custom CSS or scripts. The CMS version uses only techniques already
working on the XR Lab and RIC pages:

| Technique | Used for | Proven on |
|-----------|----------|-----------|
| Plain `<h2>`, `<p>`, `<hr />`, comment banners | Page structure | XR Lab, RIC |
| `<h2><a id="x"></a>…</h2>` + pipe-separated link bar | In-page navigation | RIC |
| `<p class="ratio ratio-16x9"><iframe>` | President's video | XR Lab, RIC |
| `<a class="btn btn-primary">` | Strategic plan button | XR Lab, RIC |
| `<div style="width:100%"><iframe … github.io …>` + "Open in a New Window" link | Milestones and Resources widgets | RIC (`ric-events`) |
| Bootstrap `card` / `row` / `col-md-6` classes on `<div>`s | Strategy cards, team groups | Classes and `<div>`s survive on RIC; the cards themselves are untested |

The site already loads **Bootstrap 5.3.3**, so its classes work without adding any CSS.
The site also automatically adds PDF and external-link icons to matching links.

**Why widgets:** the milestones and resource library are the parts that change most
and benefit from filtering and search. As GitHub Pages widgets they:

- keep the year filter, search, and category filters, which need JavaScript the CMS won't run
- read from `js/data.js`, so **adding a milestone or document doesn't need a CMS update
  request**, just a commit to GitHub
- mark milestones *Completed* or *Upcoming* automatically from the date

The static parts (intro, strategies, team) change rarely, so they live in the CMS.

### Copying into the CMS

1. Open `index.html` in a text editor.
2. Copy everything between `BEGIN CMS CONTENT` and `END CMS CONTENT`.
3. Paste it into the CMS page's HTML/source view.
4. The sidebar ("Related") is a template field, not part of the content. The preview
   shows the recommended links.

The widget iframes point to `https://lone-star-xr-lab.github.io/tomball3-0/widgets/…`.
**That address assumes a repository named `tomball3-0` in the `lone-star-xr-lab`
organization.** If you use a different name, update the four URLs (two iframes, two
"Open in a New Window" links) in the content block, plus the `live` address in the
preview-only script at the bottom of `index.html`.

### Iframe heights

The widgets sit in fixed-height iframes, the same as `ric-events`: milestones at
`height="1400"`, resources at `height="1600"`. Those heights fit everything on
desktop. On phones the widget scrolls inside its frame, and the "Open in a New Window"
link gives a full-screen view. If you add many items, raise the `height` values.

## Previewing locally

Double-click `index.html` (CMS version) or `modern/index.html` (modern option).

- The CMS preview loads the **real lonestar.edu stylesheets**, so the layout matches the
  live site. Until the widgets are on GitHub Pages, a preview-only script (outside the
  content block) loads them from the local `widgets/` folder.
- Locally, Font Awesome icons and LSC web fonts show as boxes or fallback fonts. They're
  licensed only for the lonestar.edu domain.
- YouTube refuses to play embeds on pages opened from disk. The modern page swaps in a
  "Watch on YouTube" link; the CMS preview shows YouTube's error box. Both play normally
  from a web server (for example VS Code's *Live Server* extension, or GitHub Pages).

## GPA+ sub-page

`gpa-plus/index.html` redesigns <https://www.lonestar.edu/118051> and is copied into
the CMS the same way (the block between the BEGIN/END markers). Sections:

| Section | Content | Source |
|---------|---------|--------|
| About GPA+ | Goal statement and description | Current page (punctuation fixed) |
| Why It Matters | Two stat cards (75% → 46%, 69%) plus the full paragraph | Current page; quotation marks fixed |
| Problems GPA+ Addresses | Four numbered problems | **New:** strategic plan, page 9 (cited on the page) |
| College 3.0 Framework | Three cards, 1.0 → 3.0 | Current page |
| Progress | Milestones widget filtered to GPA+ (`milestones.html?initiative=gpa`) | `js/data.js` |
| What We Heard | Three themes, each with a participant quote | **New:** Feedback Forum Results by Initiative (cited on the page) |
| Resources | News story, Dell agenda, forum results, strategic plan | Existing official documents |
| GPA+ Team | 10 names in two columns | Current page (provisional) |

The two **New** sections add official content that isn't on the current page. Remove
them if they should stay off the page until approved.

**Reusing for the other strategy pages:** the 249 Corridor (`/118049`) and Neurodiversity
(`/118050`) pages can follow the same template. Tag their milestones in `data.js` with
`initiative: "249"` or `"neurodiversity"`, then embed
`milestones.html?initiative=249` (etc.). The Initiative Team Meetings and Sprint
Meetings are already tagged for both GPA+ and Neurodiversity.

## Updating content

Routine updates only touch **`js/data.js`**. Every section has comments explaining
its fields. Changes appear in the widgets and the modern page as soon as they're
pushed to GitHub, with no CMS request needed.

**Why `data.js` instead of `data.json`:** browsers block loading local JSON files when
a page is opened from disk. A `<script>` file has no such restriction. The file is
still plain data: one object, `window.TOMBALL3`, with no logic.

### Add a milestone

Add an entry to `milestones` (order doesn't matter; the widget sorts by date):

```js
{
  date: "2026-11-12",
  title: "Spring planning session",
  description: "One or two sentences, using official wording where possible.",
  links: [
    { label: "Agenda", url: "https://www.lonestar.edu/departments/...pdf", type: "pdf" }
  ]
},
```

- **Completed vs. upcoming is automatic.** Anything that ended before today shows as
  *Completed*, anything after today as *Upcoming*, and today's events as *In progress*.
  An *Upcoming* filter button appears only when there are upcoming items.
- **Strategy tags:** add `initiative: "gpa"` (or `"249"`, `"neurodiversity"`, or a list
  like `["gpa", "neurodiversity"]`) to show a milestone on that strategy's sub-page too.
- **Year filters are automatic.** Add a 2027 date and a "2027" button appears.
- Use `endDate` for multi-day items and `dateLabel` for approximate dates
  (for example `"July–August 2025"`).

### Add a document or link

Add an entry to `resources`:

```js
{
  title: "Spring 2027 Progress Report",
  description: "One short sentence.",
  category: "Surveys & Feedback",   // must match a name in resourceCategories
  url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/....pdf",
  type: "pdf",                       // "pdf", "web", or "survey"
  date: "2027-02-01",                // optional
  size: "1.2 MB"                     // optional, PDFs only
},
```

To add a category, add its name to `resourceCategories`. That list also controls the
order of categories. Categories with no items are hidden automatically.

### Update the Core Design Team

The team appears in two places:

- **CMS version:** written directly in the content block of `index.html`, so changes
  need a CMS update.
- **Modern option:** the `team` list in `data.js`.

The roster is **provisional**. Once someone confirms it, update both places, and set
`rosterVerified: true` in `data.js` to remove the notice on the modern page.

### After any edit

1. Update `lastReviewed` at the top of `data.js`.
2. Reload a widget page. If it shows a red error box or goes blank, check for a missing
   comma or quotation mark near your change.

## Deploying the widgets to GitHub Pages

1. Create the repository (planned: `lone-star-xr-lab/tomball3-0`) and push these files
   to `main`.
2. In **Settings → Pages**, set **Source** to *Deploy from a branch*, then choose
   `main` / `/ (root)`.
3. Check `https://lone-star-xr-lab.github.io/tomball3-0/widgets/milestones.html` loads.
4. Then paste the content block into the CMS.

The same deployment also hosts the CMS preview (site root) and the modern option
(`/modern/`) for review.

## Accessibility

Targets WCAG 2.2 AA:

- Visible focus rings; keyboard-operable filters (`aria-pressed` toggle buttons)
- Filter and search results announced through polite live regions
- Every iframe has a descriptive `title` and an "Open in a New Window" alternative
- New-tab links say so, with file type and size, for screen reader users
- Text contrast is 6.5:1 or higher in widgets and the modern page; control borders are at
  least 3:1
- No horizontal scrolling at 320px+; respects `prefers-reduced-motion`

**Automated scan (axe-core 4.10, WCAG 2.2 AA + best practices, 2026-10-14):** both
widgets and the modern page have **0 violations**. On the CMS pages, the remaining
failures come from the LSC page template, not the content block:

- Breadcrumb and sidebar links (`#0ea5df` on white, **2.81:1**) and the current
  breadcrumb (`#808080`, 3.94:1) fail text contrast. These appear on every lonestar.edu page.
- Links inside sentences aren't underlined, and the site's link color is only **2.99:1**
  against body text (3:1 needed), so they fail *Use of Color* (WCAG 1.4.1). This is also
  site-wide. Content-level workaround: add `style="text-decoration:underline"` to links
  inside sentences (simple inline styles survive on the RIC page), or move links out of
  sentences onto their own lines.

**Iframes and site scanners:** tools like axe, WAVE, or Siteimprove typically don't scan
inside a cross-origin iframe; axe reports `frame-tested`. Scan the widget URLs on GitHub
Pages directly. The widget pages are complete documents (language, title, `h1`,
landmarks) built for that.

Still worth checking by hand: a screen reader pass (NVDA/VoiceOver), and that the
YouTube video has accurate captions (WCAG 1.2.2).

## Design notes

- Colors match the live site's own CSS: LSC blue `#00589C`, navy `#00213D`, red `#B30838`
  (variables at the top of `css/styles.css`).
- Widgets use the system font stack. The LSC web fonts are licensed only for
  lonestar.edu, so they can't load inside a github.io iframe.
- Images load from lonestar.edu rather than being copied into this repository.

## Before deployment: content to verify

| # | Item | Why |
|---|------|-----|
| 1 | **Core Design Team roster** | Copied from the live page and flagged as needing updates. Fixed the live page's typo "Willliams" → "Williams". |
| 2 | **Tiffany Wooten** vs. **Tiffani Wooten** | Core Design Team spells it "Tiffany"; the GPA+ team page spells it "Tiffani". |
| 3 | **GPA+ official name** | The live page says "Transferable Skills Benchmark or GPA +", the strategic plan says "GPA + Professional Competencies Quotient", and the news story says "GPA + Transferable Skills Benchmark". This redesign uses "Transferable Skills Benchmark (GPA+)". |
| 4 | **State of the College PDF** | It's an exported email from the president that refers to a recording "for employees' internal use." Confirm it's meant to be public, or replace it. |
| 5 | **Strategic Planning Survey link** | The SurveyMonkey survey is closed. Listed as historical; remove if not useful. |
| 6 | **Campus Priorities Survey Report** | Unclear whether these are results of the April 11, 2025 survey. If they are, link it from that milestone. |
| 7 | **Strategic plan edition** | The cover reads "Strategic Plan 2024–2025". Confirm it's the current version. |
| 8 | **Milestone descriptions** | Kept to what official sources state. Have the initiative owners review the wording. |
| 9 | **Upcoming dates** | The latest milestone on the official page is June 22, 2026. Add any newer dates. |
| 10 | **Video captions** | Confirm the president's video has accurate captions. |
| 11 | **Bootstrap cards in the CMS** | Strategy and team cards use `card`/`row` classes on `<div>`s. Classes and `<div>`s survive on the RIC page, but cards haven't been tried. If the editor strips them, the content still reads fine as plain headings and paragraphs. |
| 12 | **GPA+ team roster** | Copied from the current GPA+ page; likely needs the same review as the Core Design Team. "Tiffani Wooten" here vs. "Tiffany Wooten" on the main page. |
| 13 | **GPA+ statistics** | The NACE Job Outlook 2025 figures (75% → 46%) and LinkedIn's 69% come from the current page and strategic plan, which give no direct citation links. Confirm them, and consider linking the reports. |
| 14 | **GPA+ quotation fix** | The current page opens a quote it never closes ("…and “demonstrated proficiency in competencies replace GPA."). The redesign quotes only *demonstrated proficiency in competencies*. Confirm that matches the NACE report. |
| 15 | **GPA+ page title** | The CMS title is "Transferable Skills Benchmark GPA +" (with a space before the +). Consider "Transferable Skills Benchmark (GPA+)" to match the text; see item 3. |

All 16 links from the official 3.0 page returned HTTP 200 on 2026-10-13.
# tomball3.0
