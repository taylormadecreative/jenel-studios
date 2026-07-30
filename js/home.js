/* Jenel Studios — homepage: show the next real opening from the live calendar.
   Progressive enhancement only. The markup already carries a working static
   fallback ("See this week's open times"), so any failure here is a no-op. */
(function () {
  "use strict";

  var TZ = "America/Chicago"; // the studio books in Central Time
  var pills = document.querySelectorAll(".avail");
  if (!pills.length || !window.TM || typeof TM.rpc !== "function") return;

  // YYYY-MM-DD for a Date, as seen in Central Time
  function ymdCT(d) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit"
    }).format(d);
  }

  function timeCT(d) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, hour: "numeric", minute: "2-digit"
    }).format(d);
  }

  function dayCT(d) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TZ, weekday: "short", month: "short", day: "numeric"
    }).format(d);
  }

  function addDays(d, n) {
    return new Date(d.getTime() + n * 86400000);
  }

  var now = new Date();
  var todayKey = ymdCT(now);
  var tomorrowKey = ymdCT(addDays(now, 1));

  function label(slot) {
    var key = ymdCT(slot);
    var when = key === todayKey ? "today" : key === tomorrowKey ? "tomorrow" : dayCT(slot);
    return "Next opening — " + when + " at " + timeCT(slot);
  }

  TM.rpc("bk_open_slots", {
    p_service: "studio-hourly",
    p_from: todayKey,
    p_to: ymdCT(addDays(now, 30))
  })
    .then(function (res) {
      var slots = (res && res.slots) || [];
      if (!slots.length) return;

      // slots come back ascending, but don't rely on it — and never show a past time
      var next = null;
      for (var i = 0; i < slots.length; i++) {
        var d = new Date(slots[i]);
        if (isNaN(d) || d <= now) continue;
        if (!next || d < next) next = d;
      }
      if (!next) return;

      var text = label(next);
      Array.prototype.forEach.call(pills, function (pill) {
        var t = pill.querySelector(".avail-t");
        if (t) t.textContent = text;
        pill.classList.add("is-live");
      });

      var note = document.getElementById("bookbarNote");
      if (note) {
        var key = ymdCT(next);
        note.textContent = key === todayKey ? "Open today · " + timeCT(next)
          : key === tomorrowKey ? "Open tomorrow · " + timeCT(next)
          : "Next open " + dayCT(next);
      }
    })
    .catch(function () { /* keep the static fallback */ });
})();
