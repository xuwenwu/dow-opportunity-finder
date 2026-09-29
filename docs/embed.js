/*
  DoW Opportunity Finder embed snippet.

  Paste this where the list should appear on any web page:

    <div data-dow-finder data-campus="San Diego State University" data-level="grad" data-lang="en"></div>
    <script src="https://xuwenwu.github.io/dow-opportunity-finder/embed.js" async></script>

  Optional attributes:
    data-campus   an HSRU campus name; the Near my campus tab shows opportunities near it
    data-level    undergrad | grad | postdoc
    data-branch   Navy | Army | Air Force | DoW wide | HSRU
    data-type     Scholarship | Fellowship | Internship | Postdoc | Workshop ...
    data-tab      students | local | faculty | calendar | prepare  (local = Near my campus)
    data-funded   0 to also show unfunded items (default shows funded only)
    data-lang     en | es
    data-height   starting height in pixels (default 900); the frame then grows to fit
*/
(function () {
  var script = document.currentScript;
  var base = (script && script.src ? script.src : "https://xuwenwu.github.io/dow-opportunity-finder/embed.js").replace(/embed\.js.*$/, "");
  var hosts = document.querySelectorAll("[data-dow-finder]:not([data-dow-ready])");
  var frames = [];
  Array.prototype.forEach.call(hosts, function (host) {
    host.setAttribute("data-dow-ready", "1");
    var q = new URLSearchParams({ embed: "1" });
    ["campus", "level", "branch", "type", "tab", "lang", "funded"].forEach(function (k) {
      var v = host.getAttribute("data-" + k);
      if (v) q.set(k, v);
    });
    var f = document.createElement("iframe");
    f.src = base + "index.html?" + q.toString();
    f.title = "DoW Opportunity Finder";
    f.loading = "lazy";
    f.style.cssText = "width:100%;border:0;display:block;min-height:400px;height:" + (parseInt(host.getAttribute("data-height"), 10) || 900) + "px";
    host.appendChild(f);
    frames.push(f);
  });
  window.addEventListener("message", function (e) {
    if (!e.data || typeof e.data.dowFinderHeight !== "number") return;
    frames.forEach(function (f) {
      if (f.contentWindow === e.source) f.style.height = Math.max(400, Math.ceil(e.data.dowFinderHeight) + 8) + "px";
    });
  });
})();
