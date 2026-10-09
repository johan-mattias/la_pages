/* Shared site frame. Every page loads it as the first thing in <body>:
     <script src="site-nav.js"></script>
   It draws three things around the page's own content:
     - the menu: the story page, then the chapters in reading order, grouped into parts;
     - a strip under the menu that says where the chapter sits in the story and what it adds;
     - a previous/next pager at the end of the page.
   It also styles the "story thread" notes that chapters use to point at each other:
     <div class="lathread" role="note"><span class="lathread-k">Story thread</span><p>…</p></div>
   (add the class "flush" where the note sits in a grid or flex container that already spaces its items).
   To add, rename or reorder a chapter, edit PARTS and CHAPTERS below. The story page
   (index.html) describes the chapters in its own words, so update its chapter list too.
   Nothing is sticky, so the pages' own sticky section rails and control rows keep working. */
(function () {
  var STORY = { file: "index.html", nav: "The story", title: "The story: when students improve, stall and drop" };

  var PARTS = [
    { n: "I", name: "The yardstick" },
    { n: "II", name: "The course year" },
    { n: "III", name: "The setting" },
    { n: "IV", name: "The check" }
  ];

  // states: which of the story's three questions the chapter informs (up = improves, flat = stalls, down = drops)
  var CHAPTERS = [
    {
      file: "report.html", part: 0, nav: "Start & finish",
      title: "Where students start and finish",
      question: "Who climbs, who slips, and does self-efficacy follow?",
      role: "Sets the yardstick. Entry score, grade and self-efficacy form a chain, and self-efficacy follows the grade (ρ\u00a0.60) more than the starting point (ρ\u00a0.36). About a third of students change lanes: climbers hand everything in and work outside class; slippers leave work missing.",
      states: ["up", "down"]
    },
    {
      file: "self-efficacy-granularity-study.html", part: 0, nav: "Mastery & self-efficacy",
      title: "Mastery experience in the logs",
      question: "Which traces of practice go with high self-efficacy, and when do they show?",
      role: "Turns mastery experience into log measures. Finishing what you attempt (ρ\u00a0.41), getting past an error on the next run (ρ\u00a0.33) and coming back regularly go with higher end-of-course self-efficacy. The signal is invisible in the first month and appears around week 12.",
      states: ["up", "flat"]
    },
    {
      file: "log-atlas.html", part: 1, nav: "Log atlas",
      title: "Two school years in the logs",
      question: "What does practice look like across 2.6 million events?",
      role: "The wide view of practice. Weekly engagement settles into a lower gear by week 20, a missed week is hard to come back from, students rerun code after an error instead of editing it, and the hardest exercises and the lowest self-ratings point to the same wall.",
      states: ["flat", "down"]
    },
    {
      file: "te22-te23-activity-trajectories.html", part: 1, nav: "Unit trajectories",
      title: "Activity across the units",
      question: "Who keeps up from unit to unit, who drops, and who comes back?",
      role: "Follows students unit by unit. Relative activity is fairly stable from unit to unit (ICC\u00a0.50), a middle group moves between neighbouring states, and the least active group drops after unit 3 and partly recovers for the final project in 13 of 14 state definitions.",
      states: ["up", "flat", "down"]
    },
    {
      file: "error-escape-curves.html", part: 1, nav: "Error escape",
      title: "Inside the run–error loop",
      question: "Which errors do students learn to get past, and which keep stopping them?",
      role: "The smallest mastery experience: an error met and escaped. When the message names the fix, students get faster with every encounter; when the error is about meaning, they do not, and trial-and-error debugging never declines. The page reads this behaviourally; the story reads it as the raw material of self-efficacy.",
      states: ["up", "flat"]
    },
    {
      file: "te22a-schedule-and-activity.html", part: 2, nav: "One class's year",
      title: "One class, in lessons and out",
      question: "When and where does the practice happen?",
      role: "The setting up close, for te22a. A third of active time falls outside lessons, mostly on creative tasks and the final project, and after-school minutes track the final-project grade (ρ\u00a0.64). The spring is weaker than the autumn.",
      states: ["up", "flat"]
    },
    {
      file: "how-often-and-how-long-classes-meet.html", part: 2, nav: "Timetables",
      title: "How timetables shape practice time",
      question: "Does how often and how long a class meets change how far it gets?",
      role: "The setting at scale: 734 US classes, a different population with no self-efficacy measure. Progress follows total weekly class time rather than how it is split, and classes that meet more often keep slightly more students up with the class.",
      states: ["flat", "down"]
    },
    {
      file: "programmering-1-te24c.html", part: 3, nav: "te24c up close",
      title: "One class, surveyed before and after",
      question: "Which ways of working go with a higher grade and a rise in self-efficacy?",
      role: "The newest class (2025/26, 32 students) and the only one here surveyed both before and after the course. Self-efficacy already correlates ρ 0.56 with the final grade five months before the course and 0.81 by August, and students who earned more points and worked ahead gained the most. What students built (final-project decisions, ρ 0.74) and how efficiently they worked track the grade; time away from the platform in lessons goes with lower grades (ρ −0.44). Error, reading and focus measures cover units 1–4.",
      states: ["up", "flat", "down"]
    },
    {
      file: "te22-vs-te23.html", part: 3, nav: "TE22 vs TE23",
      title: "The te24c findings in two full years",
      question: "Do the te24c findings hold in TE22 and TE23, and how do the two cohorts differ?",
      role: "Reruns the te24c analysis on TE22 (2023/24) and TE23 (2024/25), with te24c as a reference. The grade ladder repeats: students who solve more, work ahead, take on harder exercises, finish what they start and build more decisions into the final project get higher grades. Specific syntax messages get faster to fix in both cohorts; 'invalid syntax' and NameError do not. Self-efficacy tracks the grade in TE22 but barely in TE23 (32 answers). TE22 spent more time; TE23 worked faster, made more errors and guessed more.",
      states: ["up", "flat"]
    }
  ];

  var STATE_LABEL = { up: "Improves", flat: "Stalls", down: "Drops" };
  var STATE_ICON = { up: "↗", flat: "→", down: "↘" };

  var LIGHT = "--lanav-bg:#ffffff;--lanav-fg:#1d2127;--lanav-muted:#5b636e;--lanav-rule:#dadfe5;--lanav-hover:#eef1f4;" +
    "--lanav-accent:#0f6f7a;--lanav-tint:#eef6f7;--lanav-link:#0b5961;--lanav-up:#2a78d6;--lanav-flat:#7d7a72;--lanav-down:#e34948;";
  var DARK = "--lanav-bg:#15181c;--lanav-fg:#e8ebef;--lanav-muted:#9da6b1;--lanav-rule:#2a3038;--lanav-hover:#232931;" +
    "--lanav-accent:#4fb3bf;--lanav-tint:#13292c;--lanav-link:#7fd0da;--lanav-up:#3987e5;--lanav-flat:#8f8c84;--lanav-down:#e66767;";
  var FRAME = ".lanav,.lastrip,.lapager,.lathread,.lachip";
  var SANS = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
  var MONO = "ui-monospace,'SF Mono',Menlo,Consolas,monospace";
  var PR = "max(16px,env(safe-area-inset-right,0px))", PL = "max(16px,env(safe-area-inset-left,0px))";

  var CSS =
    FRAME + "{" + LIGHT + "box-sizing:border-box;letter-spacing:0;text-align:left}" +
    "@media (prefers-color-scheme:dark){:root:not([data-theme='light']) :is(" + FRAME + "){" + DARK + "}}" +
    ":root[data-theme='dark'] :is(" + FRAME + "){" + DARK + "}" +
    ":is(" + FRAME + ") *{box-sizing:border-box}" +

    // menu
    ".lanav{display:block;margin:0;background:var(--lanav-bg);border-bottom:1px solid var(--lanav-rule);" +
      "font:500 14px/1.3 " + SANS + ";color:var(--lanav-fg)}" +
    ".lanav .lanav-in{position:relative;display:flex;align-items:center;gap:2px;overflow-x:auto;scrollbar-width:none;" +
      "padding:6px " + PR + " 6px " + PL + ";margin:0}" +
    ".lanav .lanav-in::-webkit-scrollbar{display:none}" +
    "@media (min-width:720px){.lanav .lanav-in{flex-wrap:wrap;overflow-x:visible}}" +
    ".lanav a{flex:none;display:block;margin:0;padding:6px 10px;border-radius:6px;white-space:nowrap;" +
      "font:inherit;color:var(--lanav-muted);text-decoration:none;background:transparent}" +
    ".lanav a .lanav-n{font:500 12px/1 " + MONO + ";margin-right:6px;color:var(--lanav-muted)}" +
    ".lanav a:hover{color:var(--lanav-fg);background:var(--lanav-hover)}" +
    ".lanav a[aria-current='page']{color:var(--lanav-fg);background:var(--lanav-hover);font-weight:650}" +
    ".lanav a.lanav-story{color:var(--lanav-link);font-weight:650}" +
    ".lanav a:focus-visible{outline:2px solid var(--lanav-accent);outline-offset:-2px}" +
    ".lanav .lanav-sep{flex:none;width:1px;height:18px;margin:0 6px;background:var(--lanav-rule)}" +

    // chapter strip
    ".lastrip{display:block;margin:0;background:var(--lanav-tint);border-bottom:1px solid var(--lanav-rule);" +
      "font:400 14px/1.5 " + SANS + ";color:var(--lanav-fg)}" +
    ".lastrip .lastrip-in{max-width:1120px;margin:0 auto;padding:10px " + PR + " 12px " + PL + "}" +
    ".lastrip .lastrip-top{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:2px 16px}" +
    ".lastrip .lastrip-k{font:600 11.5px/1.4 " + MONO + ";letter-spacing:.06em;text-transform:uppercase;color:var(--lanav-link)}" +
    ".lastrip a{color:var(--lanav-link);text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:1px}" +
    ".lastrip .lastrip-home{font-size:13px;font-weight:600;white-space:nowrap}" +
    ".lastrip details{margin:3px 0 0}" +
    ".lastrip summary{display:block;cursor:pointer;list-style:none;font:500 15.5px/1.4 " + SANS + ";color:var(--lanav-fg)}" +
    ".lastrip summary .lastrip-t{font-weight:700}" +
    ".lastrip summary::-webkit-details-marker{display:none}" +
    ".lastrip summary .lastrip-more{font:500 12.5px/1 " + SANS + ";color:var(--lanav-link);margin-left:8px;white-space:nowrap}" +
    ".lastrip summary .lastrip-more::after{content:' ▾'}" +
    ".lastrip details[open] summary .lastrip-more::after{content:' ▴'}" +
    ".lastrip summary:focus-visible{outline:2px solid var(--lanav-accent);outline-offset:2px;border-radius:3px}" +
    ".lastrip .lastrip-r{margin:4px 0 0;max-width:86ch;color:var(--lanav-muted);font:inherit}" +
    ".lastrip .lastrip-tags{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:8px 0 0}" +
    ".lastrip .lastrip-tags .lastrip-k{margin-right:2px}" +

    // state chips, used by the strip and by the story page
    ".lachip{display:inline-flex;align-items:center;gap:5px;padding:2px 9px 2px 7px;border:1px solid var(--lanav-rule);" +
      "border-radius:999px;background:var(--lanav-bg);font:600 12px/1.45 " + SANS + ";color:var(--lanav-fg);white-space:nowrap}" +
    ".lachip .lachip-i{font-weight:700;font-size:13px;line-height:1}" +
    ".lachip.up .lachip-i{color:var(--lanav-up)}.lachip.flat .lachip-i{color:var(--lanav-flat)}.lachip.down .lachip-i{color:var(--lanav-down)}" +

    // pager
    ".lapager{display:block;margin:40px 0 0;background:var(--lanav-bg);border-top:1px solid var(--lanav-rule);" +
      "font:400 14px/1.45 " + SANS + ";color:var(--lanav-fg)}" +
    ".lapager .lapager-in{max-width:1120px;margin:0 auto;padding:20px " + PR + " 28px " + PL + ";" +
      "display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:12px}" +
    ".lapager a.lapager-a{display:block;padding:12px 14px;border:1px solid var(--lanav-rule);border-radius:8px;text-decoration:none;" +
      "color:var(--lanav-fg);background:var(--lanav-bg)}" +
    ".lapager a.lapager-a:hover{background:var(--lanav-hover)}" +
    ".lapager a.lapager-a:focus-visible{outline:2px solid var(--lanav-accent);outline-offset:2px}" +
    ".lapager a.lapager-next{text-align:right}" +
    ".lapager .lapager-k{display:block;font:600 11.5px/1.4 " + MONO + ";letter-spacing:.06em;text-transform:uppercase;color:var(--lanav-link)}" +
    ".lapager .lapager-t{display:block;margin-top:2px;font:600 15.5px/1.35 " + SANS + "}" +
    ".lapager .lapager-q{display:block;margin-top:2px;color:var(--lanav-muted);font-size:13.5px}" +

    // story-thread notes inside chapters
    ".lathread{display:block;max-width:72ch;margin:20px 0;padding:10px 14px 11px 13px;border-left:3px solid var(--lanav-accent);" +
      "border-radius:0 6px 6px 0;background:var(--lanav-tint);font:400 14.5px/1.55 " + SANS + ";color:var(--lanav-fg)}" +
    ".lathread .lathread-k{display:block;margin:0 0 3px;font:600 11px/1.4 " + MONO + ";letter-spacing:.07em;text-transform:uppercase;color:var(--lanav-link)}" +
    ".lathread.flush{margin:0}" +
    ".lathread p{margin:0;max-width:none;font:inherit;color:inherit}" +
    ".lathread p+p{margin-top:6px}" +
    ".lathread a{color:var(--lanav-link);text-decoration:underline;text-underline-offset:2px;text-decoration-thickness:1px}" +
    ".lathread a:focus-visible{outline:2px solid var(--lanav-accent);outline-offset:2px}" +
    ".lathread b,.lathread strong{font-weight:650;color:var(--lanav-fg)}" +

    "@media print{.lanav,.lastrip,.lapager{display:none}.lathread{background:none}}";

  function stem(name) {
    try { name = decodeURIComponent(name); } catch (e) {}
    return (name || STORY.file).replace(/\.html$/i, "");
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function link(file) { return encodeURIComponent(file); }

  var here = stem(location.pathname.split("/").pop());
  var onStory = here === stem(STORY.file);
  var idx = -1;
  CHAPTERS.forEach(function (c, i) { if (stem(c.file) === here) idx = i; });
  var chapter = idx >= 0 ? CHAPTERS[idx] : null;

  var style = el("style");
  style.textContent = CSS;

  // Menu
  var nav = el("nav", "lanav");
  nav.setAttribute("aria-label", "Story and chapters");
  var inner = el("div", "lanav-in");
  var current = null;
  var home = el("a", "lanav-story", STORY.nav);
  home.href = link(STORY.file);
  if (onStory) { home.setAttribute("aria-current", "page"); current = home; }
  inner.appendChild(home);
  CHAPTERS.forEach(function (c, i) {
    if (i === 0 || c.part !== CHAPTERS[i - 1].part) {
      var sep = el("span", "lanav-sep");
      sep.setAttribute("aria-hidden", "true");
      inner.appendChild(sep);
    }
    var a = el("a");
    a.href = link(c.file);
    a.title = "Chapter " + (i + 1) + " · Part " + PARTS[c.part].n + ": " + PARTS[c.part].name + " · " + c.title;
    a.appendChild(el("span", "lanav-n", String(i + 1)));
    a.appendChild(document.createTextNode(c.nav));
    if (i === idx) { a.setAttribute("aria-current", "page"); current = a; }
    inner.appendChild(a);
  });
  nav.appendChild(inner);

  function chips(states) {
    var wrap = el("div", "lastrip-tags");
    wrap.appendChild(el("span", "lastrip-k", "Informs"));
    states.forEach(function (s) {
      var c = el("span", "lachip " + s);
      var i = el("span", "lachip-i", STATE_ICON[s]);
      i.setAttribute("aria-hidden", "true");
      c.appendChild(i);
      c.appendChild(document.createTextNode(STATE_LABEL[s]));
      wrap.appendChild(c);
    });
    return wrap;
  }

  // Chapter strip: where this page sits in the story
  var strip = null;
  if (chapter) {
    strip = el("aside", "lastrip");
    strip.setAttribute("aria-label", "This chapter in the story");
    var sin = el("div", "lastrip-in");
    var top = el("div", "lastrip-top");
    top.appendChild(el("span", "lastrip-k",
      "Chapter " + (idx + 1) + " of " + CHAPTERS.length + " · Part " + PARTS[chapter.part].n + ": " + PARTS[chapter.part].name));
    var back = el("a", "lastrip-home", "Read the whole story");
    back.href = link(STORY.file) + "#chapters";
    top.appendChild(back);
    sin.appendChild(top);
    var det = el("details");
    var sum = el("summary");
    sum.appendChild(el("span", "lastrip-t", chapter.title + "."));
    sum.appendChild(document.createTextNode(" " + chapter.question));
    sum.appendChild(el("span", "lastrip-more", "How it fits"));
    det.appendChild(sum);
    det.appendChild(el("p", "lastrip-r", chapter.role));
    det.appendChild(chips(chapter.states));
    // Open on wide screens; on phones the question alone keeps the page's own header in view.
    det.open = !window.matchMedia || window.matchMedia("(min-width: 720px)").matches;
    sin.appendChild(det);
    strip.appendChild(sin);
  }

  var anchor = document.currentScript;
  if (anchor && anchor.parentNode) {
    anchor.parentNode.insertBefore(style, anchor.nextSibling);
    anchor.parentNode.insertBefore(nav, style.nextSibling);
    if (strip) anchor.parentNode.insertBefore(strip, nav.nextSibling);
  } else {
    document.head.appendChild(style);
    document.body.insertBefore(nav, document.body.firstChild);
    if (strip) document.body.insertBefore(strip, nav.nextSibling);
  }

  // Pager: previous and next chapter at the end of the page
  function pagerLink(target, cls, kicker) {
    var a = el("a", "lapager-a " + cls);
    a.href = link(target.file);
    a.appendChild(el("span", "lapager-k", kicker));
    a.appendChild(el("span", "lapager-t", target.title));
    if (target.question) a.appendChild(el("span", "lapager-q", target.question));
    return a;
  }
  function addPager() {
    if (!chapter && !onStory) return;
    var pager = el("nav", "lapager");
    pager.setAttribute("aria-label", "Previous and next chapter");
    var pin = el("div", "lapager-in");
    if (onStory) {
      pin.appendChild(pagerLink(CHAPTERS[0], "lapager-next", "Start reading · Chapter 1 →"));
    } else {
      var prev = idx > 0 ? CHAPTERS[idx - 1] : STORY;
      var next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : STORY;
      var a = pagerLink(prev, "lapager-prev", idx > 0 ? "← Chapter " + idx : "← Back to");
      a.rel = "prev";
      pin.appendChild(a);
      var b = pagerLink(next, "lapager-next", idx < CHAPTERS.length - 1 ? "Chapter " + (idx + 2) + " →" : "Back to →");
      b.rel = "next";
      pin.appendChild(b);
    }
    pager.appendChild(pin);
    document.body.appendChild(pager);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addPager);
  else addPager();

  // On narrow screens the menu scrolls sideways; bring the current page's link into view.
  // Repeated on load because the page's own CSS is parsed after this script runs.
  function reveal() {
    if (current && current.offsetLeft + current.offsetWidth > inner.clientWidth) {
      inner.scrollLeft = current.offsetLeft - 16;
    }
  }
  reveal();
  window.addEventListener("load", reveal);
})();
