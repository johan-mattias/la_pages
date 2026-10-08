/* Shared site menu. Every page loads it as the first thing in <body>:
     <script src="site-nav.js"></script>
   To add, rename or reorder a page, edit PAGES below; nothing else needs to change.
   The bar is not sticky, so the pages' own sticky section rails and control rows keep working. */
(function () {
  var PAGES = [
    ["log-atlas.html", "Overview"],
    ["te22a-schedule-and-activity.html", "TE22A schedule"],
    ["te22-te23-activity-trajectories.html", "Activity trajectories"],
    ["error-escape-curves.html", "Error escape curves"],
    ["self-efficacy-granularity-study.html", "Self-efficacy: weeks or units"],
    ["report.html", "Block, text & self-efficacy"],
    ["how-often-and-how-long-classes-meet.html", "How often & how long to meet"]
  ];

  var LIGHT = "--lanav-bg:#ffffff;--lanav-fg:#1d2127;--lanav-muted:#5b636e;--lanav-rule:#dadfe5;--lanav-hover:#eef1f4;--lanav-accent:#0f6f7a;";
  var DARK = "--lanav-bg:#15181c;--lanav-fg:#e8ebef;--lanav-muted:#9da6b1;--lanav-rule:#2a3038;--lanav-hover:#232931;--lanav-accent:#4fb3bf;";
  var CSS =
    ".lanav{" + LIGHT + "display:block;margin:0;background:var(--lanav-bg);border-bottom:1px solid var(--lanav-rule);" +
      "font:500 14px/1.3 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--lanav-fg);letter-spacing:0;text-align:left}" +
    "@media (prefers-color-scheme:dark){:root:not([data-theme='light']) .lanav{" + DARK + "}}" +
    ":root[data-theme='dark'] .lanav{" + DARK + "}" +
    ".lanav .lanav-in{position:relative;display:flex;align-items:center;gap:2px;overflow-x:auto;scrollbar-width:none;" +
      "padding:6px max(16px,env(safe-area-inset-right,0px)) 6px max(16px,env(safe-area-inset-left,0px));margin:0}" +
    ".lanav .lanav-in::-webkit-scrollbar{display:none}" +
    "@media (min-width:720px){.lanav .lanav-in{flex-wrap:wrap;overflow-x:visible}}" +
    ".lanav a{flex:none;display:block;margin:0;padding:6px 10px;border-radius:6px;white-space:nowrap;" +
      "font:inherit;color:var(--lanav-muted);text-decoration:none;background:transparent}" +
    ".lanav a:hover{color:var(--lanav-fg);background:var(--lanav-hover)}" +
    ".lanav a[aria-current='page']{color:var(--lanav-fg);background:var(--lanav-hover);font-weight:650}" +
    ".lanav a:focus-visible{outline:2px solid var(--lanav-accent);outline-offset:-2px}" +
    "@media print{.lanav{display:none}}";

  function stem(name) {
    try { name = decodeURIComponent(name); } catch (e) {}
    return (name || "index.html").replace(/\.html$/i, "");
  }
  var here = stem(location.pathname.split("/").pop());

  var style = document.createElement("style");
  style.textContent = CSS;

  var nav = document.createElement("nav");
  nav.className = "lanav";
  nav.setAttribute("aria-label", "Pages");
  var inner = document.createElement("div");
  inner.className = "lanav-in";
  var current = null;
  PAGES.forEach(function (p) {
    var a = document.createElement("a");
    a.href = encodeURIComponent(p[0]);
    a.textContent = p[1];
    if (stem(p[0]) === here) { a.setAttribute("aria-current", "page"); current = a; }
    inner.appendChild(a);
  });
  nav.appendChild(inner);

  var anchor = document.currentScript;
  if (anchor && anchor.parentNode) {
    anchor.parentNode.insertBefore(style, anchor.nextSibling);
    anchor.parentNode.insertBefore(nav, style.nextSibling);
  } else {
    document.head.appendChild(style);
    document.body.insertBefore(nav, document.body.firstChild);
  }

  // On narrow screens the row scrolls sideways; bring the current page's link into view.
  // Repeated on load because the page's own CSS is parsed after this script runs.
  function reveal() {
    if (current && current.offsetLeft + current.offsetWidth > inner.clientWidth) {
      inner.scrollLeft = current.offsetLeft - 16;
    }
  }
  reveal();
  window.addEventListener("load", reveal);
})();
