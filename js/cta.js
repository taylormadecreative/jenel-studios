/* Jenel Studios: booking / quote button clicks
   One listener for every page. A click on any link that leads to the booking
   page, to this page's own booking section, or to an email / phone app is
   reported with the button type, the part of the page it sat in and the
   service it points at. Analytics never blocks the click.
   (Same logic as the block in taylormadecreative.net's js/site.js.) */
(() => {
  const BOOK_HOST = /^(www\.)?(taylormadecreative\.net|jenelstudios\.com)$/;
  const placementOf = (a) => {
    if (a.dataset.cta) return a.dataset.cta;
    if (a.closest(".nav")) return "nav";
    if (a.closest("footer")) return "footer";
    const box = a.closest("section, header");
    if (!box) return "page";
    if (/hero/.test(box.className)) return "hero";
    return box.id || box.classList[0] || "page";
  };
  document.addEventListener("click", (e) => {
    const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
    if (!a) return;
    let u;
    try { u = new URL(a.getAttribute("href"), location.href); } catch (_) { return; }
    let cta = null;
    if (u.protocol === "mailto:") cta = u.pathname ? "email" : null; // an empty address is a share link
    else if (u.protocol === "tel:") cta = "call";
    else if (u.protocol === "sms:") cta = "text";
    else if ((u.origin === location.origin || BOOK_HOST.test(u.hostname)) && /\/(book|start)\/(index\.html)?$/.test(u.pathname)) {
      cta = /\/start\//.test(u.pathname) ? "start" : u.hash === "#project" ? "quote" : "book";
    } else if (u.origin === location.origin && u.pathname === location.pathname && u.hash === "#book") cta = "book";
    if (!cta) return;
    const params = { cta, placement: placementOf(a) };
    const service = u.searchParams.get("service"), type = u.searchParams.get("type");
    if (service) params.service = service;
    if (type) params.project_type = type;
    try { window.gtag?.("event", "cta_click", params); } catch (_) {}
  }, true);
})();
