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
      file: "report.html", part: 0, nav: "Start & finish", updated: "21 Oct 2026",
      title: "Where students start and finish",
      question: "Who climbs, who slips, and does self-efficacy follow?",
      role: "Sets the yardstick. Entry score, grade and self-efficacy form a chain, and self-efficacy follows the grade (ρ\u00a0.55) more than the starting point (ρ\u00a0.36). About a third of students change lanes: climbers hand everything in and work outside class; slippers leave work missing.",
      states: ["up", "down"]
    },
    {
      file: "self-efficacy-granularity-study.html", part: 0, nav: "Mastery & self-efficacy", updated: "22 Oct 2026",
      title: "Mastery experience in the logs",
      question: "Which traces of practice go with high self-efficacy, and when do they show?",
      role: "Turns mastery experience into log measures. Finishing what you attempt (ρ\u00a0.38), recovering from an error on the next run (ρ\u00a0.37) and coming back regularly go with higher end-of-course self-efficacy. The signal is almost invisible in the first month and appears around week 10.",
      states: ["up", "flat"]
    },
    {
      file: "log-atlas.html", part: 1, nav: "Log atlas", updated: "22 Oct 2026",
      title: "Two school years in the logs",
      question: "What does practice look like across 2.5 million events?",
      role: "The wide view of practice. Weekly engagement settles into a lower gear by week 20, a missed week is hard to come back from, a quick rerun of the same error is a reflex rather than a strategy, and the hardest exercises and the lowest self-ratings point to the same wall.",
      states: ["flat", "down"]
    },
    {
      file: "te22-te23-activity-trajectories.html", part: 1, nav: "Unit trajectories", updated: "21 Oct 2026",
      title: "Activity across the units",
      question: "Who keeps up from unit to unit, who drops, and who comes back?",
      role: "Follows students unit by unit. Relative activity is fairly stable from unit to unit (ICC\u00a0.50), a middle group moves between neighbouring states, and the least active group drops after unit 3 in all 14 state definitions and partly recovers for the final project in 11. Students on more active trajectories get higher grades in all 14 definitions (ρ\u00a0.26–.48); self-efficacy follows in only 4.",
      states: ["up", "flat", "down"]
    },
    {
      file: "how-many-student-clusters.html", part: 1, nav: "Student clusters", updated: "22 Oct 2026",
      title: "One population, not groups",
      question: "Do students form distinct groups, or one continuous population?",
      role: "Asks directly whether students fall into groups. Clustering 153 TE22 and TE23 students on log-derived factor scores (sessions, mastery, regularity, error proneness), over the full course and from week 8/9, finds one continuous population: silhouettes stay at 0.10–0.15 and the gap statistic picks one cluster. Over the full course the two-component mixture that BIC prefers has a single peak: a core and a wider tail of sparse, error-prone activity, not a second type of student. From week 8/9 BIC prefers three components with three peaks, but that fit returns in only one refit in nine when six random students are left out.",
      states: ["flat", "down"]
    },
    {
      file: "error-escape-curves.html", part: 1, nav: "Error escape", updated: "21 Oct 2026",
      title: "Inside the run–error loop",
      question: "Which errors do students learn to get past, and which keep stopping them?",
      role: "The smallest mastery experience: an error met and escaped. When the message names the fix, students get faster with every encounter; when the error is about meaning, they do not, and trial-and-error debugging never declines. Students who fix more errors at the first retry get higher grades (ρ\u00a0.48) and report higher self-efficacy (.28); how fast they improve with practice does not matter. The page reads this behaviourally; the story reads it as the raw material of self-efficacy.",
      states: ["up", "flat"]
    },
    {
      file: "te22a-schedule-and-activity.html", part: 2, nav: "One class's year", updated: "21 Oct 2026",
      title: "One class, in lessons and out",
      question: "When and where does the practice happen?",
      role: "The setting up close, for te22a. A third of active time falls outside lessons, mostly on creative tasks and the final project, and after-school minutes track the final-project grade (ρ\u00a0.61). The spring is weaker than the autumn. In all five classes, attending more lessons and working more minutes in and outside lessons go with higher grades (pooled ρ\u00a0.34, .46 and .43).",
      states: ["up", "flat"]
    },
    {
      file: "how-often-and-how-long-classes-meet.html", part: 2, nav: "Timetables", updated: "21 Oct 2026",
      title: "How timetables shape practice time",
      question: "Does how often and how long a class meets change how far it gets?",
      role: "The setting at scale: 734 US classes, a different population with no self-efficacy measure. Progress follows total weekly class time rather than how it is split, and classes that meet more often keep slightly more students up with the class.",
      states: ["flat", "down"]
    },
    {
      file: "programmering-1-te24c.html", part: 3, nav: "te24c up close", updated: "21 Oct 2026",
      title: "One class, surveyed before and after",
      question: "Which ways of working go with a higher grade and a rise in self-efficacy?",
      role: "The newest class (2025/26, 27 students whose data may be used, 18 of them with grades) and the only one here surveyed both before and after the course. Self-efficacy already correlates ρ 0.73 with the final grade five months before the course and 0.80 by August; the gains go with points earned and working ahead, but not clearly. What students built (final-project decisions, ρ 0.74) and how efficiently they worked track the grade; time away from the platform in lessons points the same way, less clearly (ρ −0.39). Error, reading and focus measures cover units 1–4.",
      states: ["up", "flat", "down"]
    },
    {
      file: "te22-vs-te23.html", part: 3, nav: "TE22 vs TE23", updated: "22 Oct 2026",
      title: "Two full years, two teachers",
      question: "Which findings hold in both cohorts, and which follow the teacher or the year?",
      role: "The same measures for TE22 (2023/24) and TE23 (2024/25), using the scripts from the te24c analysis. Most findings hold in both cohorts (32 of 45); the decisions students build into their creative programs are one of the strongest grade links. Specific syntax messages get faster to fix in both; 'invalid syntax' and NameError do not. Self-efficacy tracks the grade in TE22 (ρ 0.58) and te23b (0.62) and less clearly in te23c (0.22 with its final-project grade). Teacher style shows in pace and project size, while TE23's extra errors and guessing follow the year.",
      states: ["up", "flat"]
    },
    {
      file: "te23-grade-trajectories.html", part: 3, nav: "Grade trajectories", updated: "21 Oct 2026",
      title: "Grades across the year",
      question: "Do students' grades hold steady from the first estimate to the final grade?",
      role: "Follows te23b and te23c from the February 2025 estimate through the unit 10 grade and the June estimate to the final grade. The estimates are steady (February to June ρ 0.86 in te23b, 0.75 in te23c), and most students who move go up: 29 improved, 23 stayed and 9 went down. Unit 10 is a single, noisy assignment, and te23c's final is the project grade, so it moves more. Every drop of two or more steps ends in F. TE22 and te24c: the course grade follows the final project (ρ\u00a0.98 in te22b, .93 in te22c), early task grades predict it less, and in te24c nobody's final grade fell below their Creative task 3 grade.",
      states: ["up", "flat", "down"]
    },
    {
      file: "TE22-TE23_SCT_replication.html", part: 3, nav: "SCT replication", updated: "21 Oct 2026",
      title: "Self-efficacy, checked in two cohorts",
      question: "Does the self-efficacy scale hold in TE22 and TE23, and what goes with it?",
      role: "Repeats the self-efficacy analysis in the five TE22 and TE23 classes, with the consent rules applied. The 15 core items form one general factor and the cohorts score the same; self-efficacy goes with the final grade clearly in TE22 (ρ\u00a00.54) and less certainly in TE23 (0.38). Enjoyment and trying it yourself first go with self-efficacy, asking AI goes with nothing, and the Year 1 block/text test predicts the final grade (ρ\u00a00.37). The final project carries most of the final grade (65% of the explained variance in TE23).",
      states: ["up", "flat"]
    },
    {
      file: "pace-in-six-classes.html", part: 3, nav: "Pace", updated: "21 Oct 2026",
      title: "Keeping up with the class",
      question: "Does working ahead of the class go with the grade in every class, and what sets the spread?",
      role: "Measures pace the same way in all six classes, as each day's lead over the class median in lesson pages and checkpoints. In each of the five TE22 and TE23 classes, being ahead goes with the final grade (pooled ρ\u00a0.63): students usually ahead average 4.0, those usually behind 1.7. In te24c (18 graded students) the link points the same way but is unclear. How far a class spreads out follows the class: in teacher 1's two classes 75% of students stayed around the median, in teacher 2's 36% and in te24c 22%. Self-efficacy follows less clearly (ρ\u00a0.45), and in the five classes 20 students fell further behind in the second half against 4 who caught up.",
      states: ["up", "down"]
    },
    {
      file: "us-replication.html", part: 3, nav: "US replication", updated: "21 Oct 2026",
      title: "The cohort findings at US scale",
      question: "Which cohort findings hold for 16,909 US students on the same course?",
      role: "Tests the cohort findings again on 16,909 US students in 871 classes who took the same course, with the rule for each test fixed before it ran. 27 of 42 findings hold: how students program (the transition matrix correlates .98 with the cohorts’), fix errors and fall behind is the same at scale, and the three unit trajectories recur. The student profiles reappear but not as stable groups, one population as in Chapter 5, and the teacher effect is teacher plus school. Leaving the platform together and the TE23-only grade links stay local.",
      states: ["up", "flat", "down"]
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
      "Chapter " + (idx + 1) + " of " + CHAPTERS.length + " · Part " + PARTS[chapter.part].n + ": " + PARTS[chapter.part].name +
      (chapter.updated ? " · Last updated " + chapter.updated : "")));   // dates live here, not in the page text (21 Oct 2026)
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

  // One typographic style on every page (21 Oct 2026): a minus sign, not a hyphen, before a number; no leading zero
  // in the correlations that follow a ρ; curly apostrophes. The pages are built by many scripts and write much of
  // their text at load time, so the style is applied here to the visible text, again whenever a chart redraws.
  // Code, scripts and data blocks are never touched; apostrophes are left alone in monospaced text.
  var SKIP = { CODE: 1, PRE: 1, KBD: 1, SAMP: 1, SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1 };
  function kind(node) {   // 0: leave alone, 1: numbers only, 2: numbers and apostrophes
    var k = 2;
    for (var e = node.parentNode; e && e.nodeType === 1; e = e.parentNode) {
      if (SKIP[e.tagName]) return 0;
      if (k === 2 && e.classList && e.classList.contains("mono")) k = 1;
    }
    return k;
  }
  function typeset(s, k) {
    var t = s.replace(/(^|[\s(\[=:,;\/±~≈<>])-(?=\.?\d)/g, "$1−");
    t = t.replace(/ρ(?:[^.]|\.(?=\d))*/g, function (run) { return run.replace(/(^|[^\d.])0\.(\d)/g, "$1.$2"); });
    if (k === 2) t = t.replace(/([A-Za-zÀ-ɏ])'(?=[A-Za-zÀ-ɏ])/g, "$1’").replace(/([sS])'(?=[\s,.;:)]|$)/g, "$1’");
    return t;
  }
  // A number that a page writes into its own span (ρ <span>0.55</span>) belongs to the ρ before it when the text in
  // between, within the same paragraph or cell, has no sentence end.
  var BLOCK = { P: 1, LI: 1, TD: 1, TH: 1, DIV: 1, DD: 1, DT: 1, FIGCAPTION: 1, SUMMARY: 1, H1: 1, H2: 1, H3: 1, H4: 1, text: 1 };
  function afterRho(node) {
    var block = node.parentNode;
    while (block && block !== document.body && !BLOCK[block.tagName]) block = block.parentNode;
    if (!block) return false;
    var w = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, null), n, before = "";
    while ((n = w.nextNode()) && n !== node) before += n.nodeValue;
    var i = before.lastIndexOf("ρ");
    return i >= 0 && !/\.(?!\d)/.test(before.slice(i));
  }
  function fix(node) {
    var k = kind(node);
    if (!k) return;
    var v = node.nodeValue, t = typeset(v, k);
    if (/(^|[^\d.])0\.\d/.test(t) && t.indexOf("ρ") < 0 && afterRho(node)) {
      var head = t.match(/^(?:[^.]|\.(?=\d))*/)[0];   // up to the first sentence end
      t = head.replace(/(^|[^\d.])0\.(\d)/g, "$1.$2") + t.slice(head.length);
    }
    if (t !== v) node.nodeValue = t;
  }
  function fixAll(root) {
    if (root.nodeType === 3) { fix(root); return; }
    if (root.nodeType !== 1 || SKIP[root.tagName]) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(fix);
  }
  function startTypography() {
    fixAll(document.body);
    if (!window.MutationObserver) return;
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        if (r.type === "characterData") fix(r.target);
        else r.addedNodes.forEach(fixAll);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startTypography);
  else startTypography();
})();
