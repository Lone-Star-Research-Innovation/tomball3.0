/*
 * Growing LSC-Tomball 3.0 — page behavior
 * Renders milestones, resources, and the team roster from js/data.js and
 * wires up the year filter, resource search/filter, and in-page nav highlight.
 * Content edits belong in data.js, not here.
 */
(function () {
  "use strict";

  var data = window.TOMBALL3;

  var TYPE_LABELS = { pdf: "PDF", web: "Web page", survey: "Survey" };
  var INITIATIVE_LABELS = { "249": "249 Corridor", neurodiversity: "Neurodiversity", gpa: "GPA+" };
  // Widgets have only a hidden h1, so their headings start one level higher
  // than on the modern page (where sections already use h2).
  var HEADING = document.body.classList.contains("widget")
    ? { group: "h2", item: "h3" }
    : { group: "h3", item: "h4" };
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

  // Icon sprite, inserted once per page and referenced with <use href="#i-name">.
  var ICON_SYMBOLS = [
    '<symbol id="i-pdf" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M14 3v5h5M8.5 13h7M8.5 16.5h5"/></symbol>',
    '<symbol id="i-web" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3.5 12h17M12 3.5c2.4 2.6 3.5 5.4 3.5 8.5s-1.1 5.9-3.5 8.5c-2.4-2.6-3.5-5.4-3.5-8.5S9.6 6.1 12 3.5z"/></symbol>',
    '<symbol id="i-survey" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M9 3v2.5h6V3M8.5 11l1.5 1.5 2.5-2.5M8.5 16.5l1.5 1.5 2.5-2.5M14.5 11.5h1.5M14.5 17h1.5"/></symbol>',
    '<symbol id="i-ext" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></symbol>',
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 6l6 6-6 6"/></symbol>',
    '<symbol id="i-check" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></symbol>',
    '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 16l4 4"/></symbol>'
  ].join("");

  /* ---------- Helpers ---------- */

  // Small DOM builder: h("p", { class: "x" }, "text", childNode)
  function h(tag, attrs) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = value;
        else node.setAttribute(key, value === true ? "" : value);
      });
    }
    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (child === null || child === undefined || child === false) continue;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
  }

  function icon(name, cls) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "icon" + (cls ? " " + cls : ""));
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  function srOnly(text) {
    return h("span", { class: "visually-hidden", text: text });
  }

  // Only allow http(s) links from the data file.
  function safeUrl(url) {
    return /^https?:\/\//i.test(url || "") ? url : "#";
  }

  // Parse "YYYY-MM-DD" as a local date (avoids timezone shifts).
  function parseDate(str) {
    var p = String(str || "").split("-").map(Number);
    if (p.length !== 3 || p.some(isNaN)) return null;
    return new Date(p[0], p[1] - 1, p[2]);
  }

  function formatDate(d) {
    return MONTHS[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  }

  function formatRange(start, end) {
    if (!end || end.getTime() === start.getTime()) return formatDate(start);
    if (start.getFullYear() !== end.getFullYear()) return formatDate(start) + " – " + formatDate(end);
    if (start.getMonth() !== end.getMonth()) {
      return MONTHS[start.getMonth()] + " " + start.getDate() + " – " +
        MONTHS[end.getMonth()] + " " + end.getDate() + ", " + end.getFullYear();
    }
    return MONTHS[start.getMonth()] + " " + start.getDate() + "–" + end.getDate() + ", " + end.getFullYear();
  }

  function plural(n, word) {
    return n + " " + word + (n === 1 ? "" : "s");
  }

  // A milestone's initiative field may be a single key or a list of keys.
  function initiativesOf(m) {
    if (!m.initiative) return [];
    return Array.isArray(m.initiative) ? m.initiative : [m.initiative];
  }

  function today() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function showError(container, message) {
    container.replaceChildren(h("div", { class: "notice notice--error", role: "alert" }, message));
  }

  function linkMeta(item) {
    var parts = [TYPE_LABELS[item.type] || "Link"];
    if (item.size) parts.push(item.size);
    parts.push("opens in a new tab");
    return " (" + parts.join(", ") + ")";
  }

  // Build a group of toggle buttons where exactly one is pressed.
  function renderChips(container, options, current, onSelect) {
    container.replaceChildren();
    options.forEach(function (opt) {
      var btn = h("button", {
        type: "button",
        class: "chip",
        "aria-pressed": String(opt.value === current)
      }, opt.label, h("span", { class: "chip__count", text: "(" + opt.count + ")" }));
      btn.addEventListener("click", function () {
        container.querySelectorAll(".chip").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        onSelect(opt.value);
      });
      container.appendChild(btn);
    });
  }

  /* ---------- Milestones ---------- */

  function initMilestones() {
    var list = document.getElementById("timeline");
    var filters = document.getElementById("year-filters");
    var status = document.getElementById("milestone-status");
    if (!list) return;

    var now = today();
    var items = (data.milestones || []).map(function (m) {
      var start = parseDate(m.date);
      if (!start) return null;
      var end = parseDate(m.endDate) || start;
      var state = end < now ? "completed" : start > now ? "upcoming" : "in-progress";
      return {
        raw: m, start: start, end: end, year: start.getFullYear(), state: state,
        label: m.dateLabel || formatRange(start, parseDate(m.endDate))
      };
    }).filter(Boolean).sort(function (a, b) { return a.start - b.start; });

    // Strategy pages embed this widget as milestones.html?initiative=gpa (etc.)
    // to list only that strategy's milestones.
    var only = new URLSearchParams(location.search).get("initiative");
    if (only) items = items.filter(function (it) { return initiativesOf(it.raw).indexOf(only) !== -1; });

    if (!items.length) {
      showError(list, "No milestones found. Check js/data.js.");
      return;
    }

    var years = [];
    items.forEach(function (it) { if (years.indexOf(it.year) === -1) years.push(it.year); });
    var upcomingCount = items.filter(function (it) { return it.state !== "completed"; }).length;

    var options = [{ value: "all", label: "All years", count: items.length }];
    years.forEach(function (y) {
      options.push({ value: String(y), label: String(y), count: items.filter(function (it) { return it.year === y; }).length });
    });
    if (upcomingCount) options.push({ value: "upcoming", label: "Upcoming", count: upcomingCount });

    function render(filter) {
      var shown = items.filter(function (it) {
        if (filter === "all") return true;
        if (filter === "upcoming") return it.state !== "completed";
        return String(it.year) === filter;
      });

      var groups = [];
      shown.forEach(function (it) {
        var g = groups[groups.length - 1];
        if (!g || g.year !== it.year) groups.push(g = { year: it.year, items: [] });
        g.items.push(it);
      });

      list.replaceChildren.apply(list, groups.map(function (g) {
        var headingId = "year-" + g.year;
        return h("section", { class: "year-group", "aria-labelledby": headingId },
          h(HEADING.group, { class: "year-group__label", id: headingId },
            String(g.year),
            h("span", { class: "year-group__count", text: plural(g.items.length, "milestone") })),
          h("ol", { class: "milestones" }, ...g.items.map(renderMilestone)));
      }));

      var scope = filter === "all" ? "" : filter === "upcoming" ? " that are upcoming" : " from " + filter;
      status.textContent = "Showing " + plural(shown.length, "milestone") + scope + ".";
    }

    function renderMilestone(it) {
      var m = it.raw;
      var stateLabel = { completed: "Completed", upcoming: "Upcoming", "in-progress": "In progress" }[it.state];
      var links = (m.links || []).map(function (link) {
        return h("li", null,
          h("a", { href: safeUrl(link.url), target: "_blank", rel: "noopener" },
            icon(link.type === "pdf" ? "pdf" : link.type === "survey" ? "survey" : "web"),
            link.label,
            srOnly(linkMeta(link))));
      });

      return h("li", { class: "milestone milestone--" + it.state },
        h("span", { class: "milestone__marker", "aria-hidden": "true" },
          it.state === "completed" ? icon("check") : null),
        h("div", { class: "milestone__card" },
          h("div", { class: "milestone__meta" },
            h("time", { class: "milestone__date", datetime: m.date, text: it.label }),
            h("span", { class: "tag " + (it.state === "completed" ? "tag--done" : "tag--upcoming"), text: stateLabel }),
            // Tag other strategies only; the filtered one is implied by the page.
            ...initiativesOf(m).filter(function (key) { return key !== only && INITIATIVE_LABELS[key]; })
              .map(function (key) { return h("span", { class: "tag", text: INITIATIVE_LABELS[key] }); })),
          h(HEADING.item, { class: "milestone__title", text: m.title }),
          m.description ? h("p", { class: "milestone__desc", text: m.description }) : null,
          links.length ? h("ul", { class: "milestone__links", "aria-label": "Related documents" }, ...links) : null));
    }

    renderChips(filters, options, "all", render);
    render("all");
  }

  /* ---------- Resources ---------- */

  function initResources() {
    var listEl = document.getElementById("resource-list");
    var featuredEl = document.getElementById("featured-resource");
    var filters = document.getElementById("category-filters");
    var search = document.getElementById("resource-search");
    var status = document.getElementById("resource-status");
    if (!listEl) return;

    var resources = (data.resources || []).slice();
    if (!resources.length) {
      showError(listEl, "No resources found. Check js/data.js.");
      return;
    }

    // Categories in the order listed in data.js, then any unlisted ones.
    var categories = (data.resourceCategories || []).slice();
    resources.forEach(function (r) {
      if (r.category && categories.indexOf(r.category) === -1) categories.push(r.category);
    });

    // Pages without a featured slot (e.g. the CMS widget) list every item normally.
    var featured = featuredEl ? resources.filter(function (r) { return r.featured; })[0] : null;
    var state = { category: "all", query: "" };

    var options = [{ value: "all", label: "All", count: resources.length }];
    categories.forEach(function (c) {
      var n = resources.filter(function (r) { return r.category === c; }).length;
      if (n) options.push({ value: c, label: c, count: n });
    });

    function matches(r) {
      if (state.category !== "all" && r.category !== state.category) return false;
      if (!state.query) return true;
      var haystack = [r.title, r.description, r.category, TYPE_LABELS[r.type], r.note, r.date]
        .join(" ").toLowerCase();
      return state.query.split(/\s+/).every(function (word) { return haystack.indexOf(word) !== -1; });
    }

    function metaFor(r) {
      var bits = [h("span", { class: "tag", text: TYPE_LABELS[r.type] || "Link" })];
      var d = parseDate(r.date);
      if (d) bits.push(h("span", null, h("time", { datetime: r.date, text: formatDate(d) })));
      if (r.size) bits.push(h("span", { text: r.size }));
      if (r.note) bits.push(h("span", { class: "tag tag--upcoming", text: r.note }));
      return h("p", { class: "resource__meta" }, ...bits);
    }

    function renderResource(r) {
      var iconName = r.type === "pdf" ? "pdf" : r.type === "survey" ? "survey" : "web";
      return h("li", null,
        h("article", { class: "resource" },
          h("span", { class: "resource__icon resource__icon--" + iconName, "aria-hidden": "true" }, icon(iconName)),
          h("div", { class: "resource__body" },
            h(HEADING.item, { class: "resource__title" },
              h("a", { href: safeUrl(r.url), target: "_blank", rel: "noopener" },
                r.title, srOnly(linkMeta(r)), icon("ext"))),
            r.description ? h("p", { class: "resource__desc", text: r.description }) : null,
            metaFor(r))));
    }

    function renderFeatured(r) {
      if (!r) return null;
      return h("article", { class: "featured" },
        r.image ? h("img", { class: "featured__cover", src: r.image, alt: "", loading: "lazy", width: "140", height: "178" }) : null,
        h("div", null,
          h("p", { class: "eyebrow", text: "Start here" }),
          h("h3", null,
            h("a", { href: safeUrl(r.url), target: "_blank", rel: "noopener" }, r.title, srOnly(linkMeta(r)))),
          r.description ? h("p", { text: r.description }) : null,
          metaFor(r)));
    }

    function render() {
      var filtering = state.category !== "all" || state.query !== "";
      // The featured item gets its own card when browsing everything; while
      // searching or filtering it is listed with the rest so results stay complete.
      if (featuredEl) featuredEl.hidden = filtering;
      var shown = resources.filter(function (r) {
        return matches(r) && (filtering || r !== featured);
      });

      var groups = categories.map(function (c) {
        return { name: c, items: shown.filter(function (r) { return r.category === c; }) };
      }).filter(function (g) { return g.items.length; });

      if (!groups.length) {
        var clear = h("button", { type: "button", class: "link-button", text: "Clear search and filters" });
        clear.addEventListener("click", reset);
        listEl.replaceChildren(h("div", { class: "empty-state" },
          h("p", null, "No resources match your search. ", clear)));
      } else {
        listEl.replaceChildren.apply(listEl, groups.map(function (g) {
          var id = "cat-" + g.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return h("section", { class: "resource-group", "aria-labelledby": id },
            h(HEADING.group, { class: "resource-group__title", id: id }, g.name, h("span", { text: plural(g.items.length, "item") })),
            h("ul", { class: "resource-list" }, ...g.items.map(renderResource)));
        }));
      }

      var total = shown.length + (filtering || !featured ? 0 : 1);
      status.textContent = filtering
        ? "Showing " + plural(total, "resource") + (state.query ? " matching “" + search.value.trim() + "”" : "") +
          (state.category !== "all" ? " in " + state.category : "") + "."
        : plural(total, "resource") + ".";
    }

    function reset() {
      state.category = "all";
      state.query = "";
      search.value = "";
      renderChips(filters, options, "all", selectCategory);
      render();
      search.focus();
    }

    function selectCategory(value) {
      state.category = value;
      render();
    }

    if (featuredEl) featuredEl.replaceChildren(renderFeatured(featured) || document.createTextNode(""));
    renderChips(filters, options, "all", selectCategory);

    search.addEventListener("input", function () {
      state.query = search.value.trim().toLowerCase();
      render();
    });
    search.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && search.value) { search.value = ""; state.query = ""; render(); }
    });

    render();
  }

  /* ---------- Team ---------- */

  function initTeam() {
    var listEl = document.getElementById("team-list");
    var noticeEl = document.getElementById("roster-notice");
    if (!listEl) return;

    if (!data.rosterVerified) {
      noticeEl.replaceChildren(h("div", { class: "notice", role: "note" },
        h("span", null, h("strong", null, "Roster pending verification. "),
          "These names are carried over from the current public page and may be out of date. Confirm before publishing.")));
    }

    var groups = (data.team || []).filter(function (g) { return g.members && g.members.length; });
    if (!groups.length) {
      showError(listEl, "No team members found. Check js/data.js.");
      return;
    }

    listEl.replaceChildren.apply(listEl, groups.map(function (g) {
      return h("div", { class: "team-group" },
        h("h3", { text: g.group }),
        h("ul", null, ...g.members.map(function (m) {
          return h("li", null,
            h("span", { class: "team-member__name", text: m.name }),
            m.title ? h("span", { class: "team-member__title", text: m.title }) : null);
        })));
    }));
  }

  /* ---------- In-page nav highlight ---------- */

  function initNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".page-nav a[href^='#']"));
    if (!("IntersectionObserver" in window) || !links.length) return;

    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute("aria-current"); });
        var active = byId[entry.target.id];
        if (active) {
          active.setAttribute("aria-current", "true");
          // Keep the active link visible in the horizontally scrolling mobile nav.
          var nav = active.closest("ul");
          if (nav.scrollWidth > nav.clientWidth) {
            nav.scrollLeft = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2;
          }
        }
      });
    }, { rootMargin: "-35% 0px -60% 0px" });

    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* ---------- Video ---------- */

  // YouTube refuses to play embeds on pages opened straight from disk
  // (file://), showing "Error 153". Swap in a link so local reviewers aren't
  // confused; the real embed is used on any web server, including GitHub Pages.
  function initVideo() {
    if (location.protocol !== "file:") return;
    document.querySelectorAll(".video__frame iframe").forEach(function (frame) {
      var id = (frame.src.match(/embed\/([\w-]+)/) || [])[1];
      if (!id) return;
      var link = h("a", { class: "video__fallback", href: "https://www.youtube.com/watch?v=" + id, target: "_blank", rel: "noopener" },
        h("span", { class: "video__play", "aria-hidden": "true" }),
        h("span", null, "Watch the video on YouTube", srOnly(" (opens in a new tab)")),
        h("small", { text: "Embedded playback works once the page is served from a web server." }));
      frame.replaceWith(link);
    });
  }

  /* ---------- Start ---------- */

  function injectIcons() {
    if (document.getElementById("i-pdf")) return;
    var holder = document.createElement("div");
    holder.innerHTML = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">' +
      ICON_SYMBOLS + "</svg>";
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  }

  function init() {
    injectIcons();
    if (!data) {
      ["timeline", "resource-list", "team-list"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) showError(el, "Content could not be loaded. Check that js/data.js exists and has no syntax errors.");
      });
      return;
    }

    document.querySelectorAll("[data-js-only]").forEach(function (el) { el.hidden = false; });

    var reviewed = parseDate(data.lastReviewed);
    var reviewedEl = document.getElementById("last-reviewed");
    if (reviewed && reviewedEl) reviewedEl.textContent = formatDate(reviewed);

    initMilestones();
    initResources();
    initTeam();
    initNav();
    initVideo();
  }

  init();
})();
