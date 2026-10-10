import { chromium } from "playwright";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = (process.env.BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
const OUT_DIR = path.resolve(ROOT, process.env.OUT_DIR || "screenshots");
const CHROMIUM_PATH = process.env.CHROMIUM_PATH || "";
const IN_ACTIONS = !!process.env.GITHUB_ACTIONS;

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };
const MOBILE_UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36";
const SHEET_SIZE = 36;
const CART_PICKS = [["p1", 2], ["p12", 1], ["p17", 1]];

const DEMO_USERS = {
  admin: { uid: "demo-admin", id: "demo-admin", email: "admin@farmora.demo", name: "Demo Admin", role: "admin", farmerId: "demo-admin", demo: true },
  farmer: { uid: "demo-farmer", id: "demo-farmer", email: "farmer@farmora.demo", name: "Robert Hayes", role: "farmer", farmerId: "f1", demo: true },
  buyer: { uid: "demo-buyer", id: "demo-buyer", email: "buyer@farmora.demo", name: "Emily Carter", role: "buyer", farmerId: "demo-buyer", demo: true },
};

const SHOTS = [
  { name: "home", path: "/" },
  { name: "shop", path: "/shop" },
  { name: "categories", path: "/categories" },
  { name: "product", path: "/product/p1" },
  { name: "farmers", path: "/farmers" },
  { name: "farmer-profile", path: "/farmers/f2" },
  { name: "cart", path: "/cart", user: "buyer", cart: true },
  { name: "checkout", path: "/checkout", user: "buyer", cart: true },
  { name: "order-tracking", path: "/orders/ORD-10241", user: "buyer" },
  { name: "login", path: "/login" },
  { name: "register", path: "/register" },
  { name: "farmer-dashboard", path: "/farmer/dashboard", user: "farmer" },
  { name: "admin-dashboard", path: "/admin", user: "admin" },
  { name: "admin-sales", path: "/admin", user: "admin", tab: "Sales" },
  { name: "about", path: "/about" },
  { name: "contact", path: "/contact" },
  { name: "blog", path: "/blog" },
  { name: "faq", path: "/faq" },
  { name: "sell", path: "/sell" },
  { name: "track", path: "/track" },
  { name: "orders", path: "/orders", user: "buyer" },
  { name: "account", path: "/account", user: "buyer" },
  { name: "wishlist", path: "/wishlist", user: "buyer", wishlist: true },
  { name: "farmer-products", path: "/farmer/dashboard", user: "farmer", tab: "My products" },
  { name: "admin-users", path: "/admin", user: "admin", tab: "Users" },
  { name: "terms", path: "/terms" },
  { name: "not-found", path: "/this-page-does-not-exist" },
  { name: "mobile-home", path: "/", mobile: true },
  { name: "mobile-shop", path: "/shop", mobile: true },
  { name: "mobile-product", path: "/product/p1", mobile: true },
];

const SLOT_NAMES = {
  heroMain: "Home hero (main)",
  heroSecondary: "Home hero (secondary)",
  auth: "Login and register panel",
  about: "About page",
  sell: "Sell on Farmora page",
};

const SHEET_CSS = `*{box-sizing:border-box}
body{margin:0;padding:24px;background:#f5f7f2;color:#1b2e1d;font:13px/1.35 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
header{margin-bottom:16px}
h1{margin:0;font-size:20px}
header p{margin:4px 0 0;color:#5a6b5c}
main{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}
figure{margin:0;overflow:hidden;border:1px solid #dbe3d6;border-radius:10px;background:#fff}
img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover;background:#e3eadf}
figcaption{padding:6px 8px;word-break:break-word}
figure.bad{border:2px solid #dc2626}
figure.bad figcaption{color:#b91c1c}
em{font-style:normal;font-weight:700;color:#b91c1c}
.empty{margin-top:16px;padding:10px 12px;border-radius:10px;background:#fff7e6;color:#8a5a00}`;

const pexels = (id, w = 800) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const rel = (file) => path.relative(ROOT, file) || ".";
const firstLine = (err) => String(err?.message ?? err).split("\n")[0];
const warn = (msg) => console.warn(IN_ACTIONS ? `::warning::${msg}` : `  ! ${msg}`);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const unquote = (s) => JSON.parse(`"${s}"`);

const STR = String.raw`"((?:[^"\\]|\\.)*)"`;
const PRODUCT_RE = new RegExp(String.raw`\bP\(\s*${STR}\s*,\s*${STR}\s*,\s*${STR}\s*,\s*${STR}\s*,\s*([\d.]+)\s*,\s*${STR}\s*,\s*(\d+)`, "g");

function parseProducts(text) {
  return [...text.matchAll(PRODUCT_RE)].map((m) => {
    const end = text.indexOf("\n", m.index);
    const line = text.slice(m.index, end === -1 ? undefined : end);
    const discount = /\bdiscount:\s*([\d.]+)/.exec(line);
    return {
      id: unquote(m[1]), name: unquote(m[2]), category: unquote(m[3]), farmerId: unquote(m[4]),
      price: Number(m[5]), unit: unquote(m[6]), stock: Number(m[7]), discount: discount ? Number(discount[1]) : 0,
    };
  });
}

function parsePhotos(text) {
  const start = text.search(/PHOTOS\s*=\s*\{/);
  const body = start === -1 ? text : text.slice(start);
  const photos = {};
  for (const m of body.matchAll(/(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][\w$]*))\s*:\s*\[([^\]]*)\]/g)) {
    const key = m[1] ?? m[2] ?? m[3];
    photos[key] = m[4].split(",").map((s) => s.trim().replace(/^["'`]|["'`]$/g, "")).filter((s) => /^\d+$/.test(s));
  }
  return photos;
}

function slotNames(seedText, products) {
  const names = Object.fromEntries(products.map((p) => [p.id, p.name]));
  for (const m of seedText.matchAll(/\bslug:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)) names[`cat:${m[1]}`] = `${m[2]} category`;
  for (const m of seedText.matchAll(/\bid:\s*"(f\d+)"[^\n]*?\bname:\s*"([^"]+)"/g)) names[m[1]] = `${m[2]} cover`;
  return names;
}

function slotName(names, key) {
  const blog = /^blog(\d+)$/.exec(key);
  return names[key] || SLOT_NAMES[key] || (blog ? `Blog post ${blog[1]}` : key);
}

function buildCart(products, photos) {
  const byId = new Map(products.map((p) => [p.id, p]));
  const picks = CART_PICKS.filter(([id]) => byId.has(id)).map(([id, qty]) => [byId.get(id), qty]);
  const withPhoto = products.filter((p) => photos[p.id]?.length);
  for (const p of withPhoto.length ? withPhoto : products) {
    if (picks.length >= 3) break;
    if (!picks.some(([x]) => x.id === p.id)) picks.push([p, 1]);
  }
  return picks.slice(0, 3).map(([p, qty]) => ({
    productId: p.id,
    name: p.name,
    price: +(p.price * (1 - p.discount / 100)).toFixed(2),
    image: photos[p.id]?.length ? pexels(photos[p.id][0]) : "",
    unit: p.unit,
    farmerId: p.farmerId,
    stock: p.stock,
    qty,
  }));
}

async function preflight(browser) {
  const context = await browser.newContext();
  try {
    const res = await context.request.get(BASE_URL, { timeout: 30000 });
    return res.status() < 500 ? null : `HTTP ${res.status()}`;
  } catch (err) {
    return firstLine(err);
  } finally {
    await context.close();
  }
}

async function settle(page) {
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const root = document.scrollingElement || document.documentElement;
    const step = Math.max(240, Math.floor(window.innerHeight * 0.75));
    for (let y = 0, i = 0; i < 150; i++) {
      const max = root.scrollHeight - window.innerHeight;
      if (y >= max) break;
      y = Math.min(y + step, max);
      window.scrollTo({ top: y, behavior: "instant" });
      await wait(120);
    }
    await wait(400);
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = "eager"; });
  });
  const loaded = await page
    .waitForFunction(() => Array.from(document.images).every((img) => img.complete), null, { timeout: 20000 })
    .then(() => true, () => false);
  await page.evaluate(() => (document.fonts ? document.fonts.ready.then(() => true) : true)).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(900);
  return loaded;
}

async function openTab(page, label) {
  const byRole = page.getByRole("button", { name: new RegExp(`^\\W*${label}\\s*$`) });
  const target = (await byRole.count()) ? byRole.first() : page.locator("button", { hasText: label }).first();
  await target.click({ timeout: 10000 });
  await page.waitForTimeout(500);
}

async function capture(browser, shot, cart) {
  const mobile = !!shot.mobile;
  const context = await browser.newContext({
    viewport: mobile ? MOBILE : DESKTOP,
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
    ...(mobile ? { userAgent: MOBILE_UA } : {}),
    locale: "en-US",
    colorScheme: "light",
  });
  await context.addInitScript(({ session, items, wishlist }) => {
    try { sessionStorage.setItem("farmora_splash_seen", "1"); } catch {}
    try {
      if (session) localStorage.setItem("farmora_session", JSON.stringify(session));
      else localStorage.removeItem("farmora_session");
      if (items) localStorage.setItem("farmora_cart", JSON.stringify(items));
      else localStorage.removeItem("farmora_cart");
      if (wishlist) localStorage.setItem("farmora_wishlist", JSON.stringify(wishlist));
    } catch {}
  }, { session: shot.user ? DEMO_USERS[shot.user] : null, items: shot.cart ? cart : null, wishlist: shot.wishlist ? ["p9", "p21", "p25", "p37"] : null });

  const page = await context.newPage();
  const errors = [];
  const notes = [];
  page.on("pageerror", (err) => errors.push(firstLine(err)));
  try {
    const res = await page.goto(`${BASE_URL}${shot.path}`, { waitUntil: "load", timeout: 60000 });
    if (res && res.status() >= 400) notes.push(`HTTP ${res.status()}`);
    let loaded = await settle(page);
    if (shot.tab) {
      await openTab(page, shot.tab);
      loaded = await settle(page);
    }
    if (!loaded) notes.push("some images were still loading");
    const headings = await page.locator("h1").allInnerTexts().catch(() => []);
    const blocked = headings.find((h) => /access restricted|not found/i.test(h));
    if (blocked) notes.push(`page heading says "${blocked.trim()}"`);
    await page.screenshot({ path: path.join(OUT_DIR, `${shot.name}.png`), fullPage: !mobile, animations: "disabled" });
    if (errors.length) notes.push(`${errors.length} page error(s), first: ${errors[0]}`);
    return notes;
  } finally {
    await context.close();
  }
}

async function capturePages(browser, cart) {
  console.log(`\nPages -> ${rel(OUT_DIR)}/ (base ${BASE_URL})`);
  const down = await preflight(browser);
  if (down) {
    warn(`Site not reachable at ${BASE_URL} (${down}), skipping page screenshots`);
    return SHOTS.map((s) => ({ name: s.name, ok: false, error: "site not reachable", notes: [] }));
  }
  const results = [];
  for (const [i, shot] of SHOTS.entries()) {
    const label = `[${String(i + 1).padStart(2)}/${SHOTS.length}] ${shot.name}.png`;
    const started = Date.now();
    try {
      const notes = await capture(browser, shot, cart);
      const secs = ((Date.now() - started) / 1000).toFixed(1);
      console.log(`${label}  ${shot.path}${shot.user ? ` as ${shot.user}` : ""}${shot.tab ? ` (${shot.tab} tab)` : ""}  ${secs}s`);
      notes.forEach((n) => warn(`${shot.name}.png: ${n}`));
      results.push({ name: shot.name, ok: true, notes });
    } catch (err) {
      console.error(`${label}  FAILED  ${firstLine(err)}`);
      results.push({ name: shot.name, ok: false, error: firstLine(err), notes: [] });
    }
  }
  return results;
}

async function checkUrls(request, entries) {
  let next = 0;
  const worker = async () => {
    while (next < entries.length) {
      const entry = entries[next++];
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const res = await request.get(entry.url, { timeout: 30000 });
          entry.status = res.status();
          entry.contentType = res.headers()["content-type"] || "";
          entry.error = null;
          await res.dispose().catch(() => {});
        } catch (err) {
          entry.status = 0;
          entry.contentType = "";
          entry.error = firstLine(err);
        }
        const final = entry.status === 200 || (entry.status >= 400 && entry.status < 500 && entry.status !== 429);
        if (final || attempt === 3) break;
        await sleep(1000 * attempt);
      }
      entry.ok = entry.status === 200 && (!entry.contentType || entry.contentType.startsWith("image/"));
    }
  };
  await Promise.all(Array.from({ length: Math.min(8, entries.length) }, worker));
}

function sheetHtml(tiles, sheet, sheets, offset, total, empty) {
  const cards = tiles.map((t) => {
    const flag = t.ok === false ? ` <em>${t.status ? `HTTP ${t.status}` : "request failed"}</em>` : "";
    return `<figure class="${t.ok === false ? "bad" : ""}"><img src="${esc(pexels(t.id, 400))}" alt=""><figcaption><b>${esc(t.key)}</b> [${t.index}] ${esc(t.id)} ${esc(t.name)}${flag}</figcaption></figure>`;
  }).join("");
  const foot = sheet === sheets && empty.length ? `<p class="empty">Empty slots (${empty.length}): ${empty.map(esc).join(", ")}</p>` : "";
  const range = `${offset + 1}-${offset + tiles.length}`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>Farmora contact sheet ${sheet}</title><style>${SHEET_CSS}</style></head><body><header><h1>Farmora photo contact sheet ${sheet} of ${sheets}</h1><p>Tiles ${range} of ${total} from data/photos.js, generated ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC</p></header><main>${cards}</main>${foot}</body></html>`;
}

async function contactSheets(context, entries, empty) {
  for (const f of await readdir(OUT_DIR)) {
    if (/^contact-sheet-\d+\.png$/.test(f)) await unlink(path.join(OUT_DIR, f)).catch(() => {});
  }
  if (!entries.length) return 0;
  const sheets = Math.ceil(entries.length / SHEET_SIZE);
  const size = Math.ceil(entries.length / sheets);
  const page = await context.newPage();
  let saved = 0;
  for (let s = 0; s < sheets; s++) {
    const tiles = entries.slice(s * size, (s + 1) * size);
    const file = path.join(OUT_DIR, `contact-sheet-${s + 1}.png`);
    try {
      await page.setContent(sheetHtml(tiles, s + 1, sheets, s * size, entries.length, empty), { waitUntil: "load", timeout: 120000 })
        .catch(() => warn(`contact sheet ${s + 1}: some images did not finish loading`));
      await page.waitForFunction(() => Array.from(document.images).every((img) => img.complete), null, { timeout: 30000 }).catch(() => {});
      const broken = await page.evaluate(() => {
        let n = 0;
        document.querySelectorAll("img").forEach((img) => {
          if (img.complete && img.naturalWidth) return;
          n++;
          img.closest("figure")?.classList.add("bad");
        });
        return n;
      });
      await page.waitForTimeout(300);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`  ${rel(file)}  ${tiles.length} tiles${broken ? `, ${broken} broken` : ""}`);
      saved++;
    } catch (err) {
      console.error(`  ${rel(file)}  FAILED  ${firstLine(err)}`);
    }
  }
  await page.close();
  return saved;
}

async function imageQa(browser, photos, names) {
  const entries = Object.entries(photos).flatMap(([key, ids]) =>
    ids.map((id, index) => ({ key, index, id, name: slotName(names, key), url: pexels(id) }))
  );
  const empty = Object.keys(photos).filter((k) => !photos[k].length);
  console.log(`\nImages: checking ${entries.length} photo URLs from data/photos.js`);
  const context = await browser.newContext({ viewport: DESKTOP });
  try {
    await checkUrls(context.request, entries);
    const bad = entries.filter((e) => !e.ok);
    bad.forEach((e) => warn(`photo ${e.key} [${e.index}] ${e.id}: ${e.status ? `HTTP ${e.status} ${e.contentType}`.trim() : e.error}`));
    const uses = new Map();
    entries.forEach((e) => uses.set(e.id, [...(uses.get(e.id) || []), `${e.key}[${e.index}]`]));
    const duplicates = [...uses].filter(([, list]) => list.length > 1).map(([id, list]) => ({ id, uses: list }));
    const report = {
      generatedAt: new Date().toISOString(),
      source: "data/photos.js",
      totals: {
        slots: Object.keys(photos).length,
        emptySlots: empty.length,
        photos: entries.length,
        ok: entries.length - bad.length,
        notOk: bad.length,
        reusedIds: duplicates.length,
      },
      notOk: bad.map(({ key, index, id, url, status, contentType, error }) => ({ key, index, id, url, status, contentType, error })),
      emptySlots: empty,
      reusedIds: duplicates,
      photos: entries.map(({ key, index, id, name, url, status, contentType, ok, error }) => ({ key, index, id, name, url, status, contentType, ok, ...(error ? { error } : {}) })),
    };
    const reportFile = path.join(OUT_DIR, "image-report.json");
    await writeFile(reportFile, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`  ${rel(reportFile)}  ${report.totals.ok} OK, ${bad.length} not OK, ${empty.length} empty slots`);
    const sheets = await contactSheets(context, entries, empty);
    return { total: entries.length, bad: bad.length, empty: empty.length, reused: duplicates.length, sheets };
  } finally {
    await context.close();
  }
}

function printSummary(pages, qa) {
  const ok = pages.filter((p) => p.ok);
  console.log("\nSummary");
  console.log(`  Pages:  ${ok.length}/${pages.length} saved to ${rel(OUT_DIR)}/`);
  pages.filter((p) => !p.ok).forEach((p) => console.log(`    failed  ${p.name}.png  ${p.error}`));
  pages.filter((p) => p.ok && p.notes.length).forEach((p) => console.log(`    check   ${p.name}.png  ${p.notes.join("; ")}`));
  if (qa) console.log(`  Photos: ${qa.total} checked, ${qa.bad} not OK, ${qa.empty} empty slots, ${qa.reused} reused ids, ${qa.sheets} contact sheet(s)`);
  else console.log("  Photos: image QA did not run");
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const [seedText, photosText] = await Promise.all([
    readFile(path.join(ROOT, "data", "seed.js"), "utf8"),
    readFile(path.join(ROOT, "data", "photos.js"), "utf8"),
  ]);
  const products = parseProducts(seedText);
  const photos = parsePhotos(photosText);
  const names = slotNames(seedText, products);
  const cart = buildCart(products, photos);
  console.log(`Parsed ${products.length} products and ${Object.keys(photos).length} photo slots; cart: ${cart.map((c) => `${c.name} x${c.qty}`).join(", ")}`);

  const browser = await chromium.launch(CHROMIUM_PATH ? { executablePath: CHROMIUM_PATH } : {});
  try {
    const pages = await capturePages(browser, cart);
    const qa = await imageQa(browser, photos, names).catch((err) => {
      warn(`image QA failed: ${firstLine(err)}`);
      return null;
    });
    printSummary(pages, qa);
    process.exitCode = pages.some((p) => p.ok) ? 0 : 1;
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
