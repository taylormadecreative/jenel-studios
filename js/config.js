// Jenel Studios — same booking backend as Taylormade Creative (shared Supabase)
window.TM = {
  SUPABASE_URL: "https://pgqdmnmessbbzyszjfvr.supabase.co",
  SUPABASE_KEY: "sb_publishable_fyYqa9QkEeA5LD_0hYLTTA_F8Gxw1oz",
  FUNCTIONS_BASE: "https://pgqdmnmessbbzyszjfvr.supabase.co/functions/v1",
  PORTAL_BASE: "https://book.taylormadecreative.net",
};

window.TM.rpc = async function rpc(fn, args) {
  const res = await fetch(`${window.TM.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: window.TM.SUPABASE_KEY,
      Authorization: `Bearer ${window.TM.SUPABASE_KEY}`,
    },
    body: JSON.stringify(args || {}),
  });
  if (!res.ok) {
    let msg = "request_failed";
    try { msg = (await res.json()).message || msg; } catch (_) { /* keep default */ }
    throw new Error(msg);
  }
  return res.json();
};

// tiny shared behaviors: reveals + year
document.addEventListener("DOMContentLoaded", () => {
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
});
