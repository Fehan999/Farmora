# Farmora 🌱

**From Local Farms to Your Door**

Farmora is a farm-to-table marketplace I built with Next.js. Farmers list what they've harvested, customers buy it straight from them, and every order arrives within three days with a live tracker that follows it from the farm to the front door. Behind that there's an admin side where the platform keeps a 10% commission on each sale. It started as a portfolio project, but I wanted it to behave like a real shop: real sign-ups, a real database, photo uploads for farmers, and pages that still load when the backend is having a bad day.

**Live demo:** [farmora-smoky.vercel.app](https://farmora-smoky.vercel.app)

## Try it

No sign-up and no passwords needed. Open the [login page](https://farmora-smoky.vercel.app/login) and:

1. Pick **Customer** or **Farmer**.
2. Click **View demo account** to jump straight in, or **Create your own account** if you'd rather start fresh.
3. Curious about the business side? Click **View admin demo** under the two role cards.

The demo farmer is Robert Hayes from Green Valley Farm, so his dashboard already has products, orders and earnings in it. As the demo customer, put a few things in the cart and check out. The order page shows the delivery tracker right away.

A few other things worth knowing:

- You can track a sample order without signing in at [/track](https://farmora-smoky.vercel.app/track). Try `ORD-10241`. The sample orders are created relative to the current time, so they're always spread across different delivery stages.
- Coupon codes `FRESH10`, `FARMORA20` and `WELCOME5` work at checkout.
- Card payment is a demo. Use `4242 4242 4242 4242`, nothing gets charged.

## Screenshots

Pages that need a login (orders, order tracking, account and the dashboards) were captured while signed in as the matching demo account. The cart, checkout and wishlist shots were taken as the demo customer with a few products already added.

**Live 3-day delivery tracker**

![Order page with the live delivery tracker](./screenshots/order-tracking.png)

**Admin dashboard: the platform's 10% commission at a glance**

![Admin dashboard overview](./screenshots/admin-dashboard.png)

<table>
  <tr>
    <td align="center" valign="top"><a href="./screenshots/home.png"><img src="./screenshots/home.png" alt="Home page" width="160"></a><br><sub>Home</sub></td>
    <td align="center" valign="top"><a href="./screenshots/shop.png"><img src="./screenshots/shop.png" alt="Shop page with filters" width="160"></a><br><sub>Shop</sub></td>
    <td align="center" valign="top"><a href="./screenshots/categories.png"><img src="./screenshots/categories.png" alt="Categories page" width="160"></a><br><sub>Categories</sub></td>
    <td align="center" valign="top"><a href="./screenshots/product.png"><img src="./screenshots/product.png" alt="Product page" width="160"></a><br><sub>Product</sub></td>
    <td align="center" valign="top"><a href="./screenshots/farmers.png"><img src="./screenshots/farmers.png" alt="Farmers directory" width="160"></a><br><sub>Farmers</sub></td>
  </tr>
  <tr>
    <td align="center" valign="top"><a href="./screenshots/farmer-profile.png"><img src="./screenshots/farmer-profile.png" alt="Farmer profile page" width="160"></a><br><sub>Farm profile</sub></td>
    <td align="center" valign="top"><a href="./screenshots/cart.png"><img src="./screenshots/cart.png" alt="Shopping cart" width="160"></a><br><sub>Cart</sub></td>
    <td align="center" valign="top"><a href="./screenshots/checkout.png"><img src="./screenshots/checkout.png" alt="Checkout page" width="160"></a><br><sub>Checkout</sub></td>
    <td align="center" valign="top"><a href="./screenshots/orders.png"><img src="./screenshots/orders.png" alt="Order history" width="160"></a><br><sub>My orders</sub></td>
    <td align="center" valign="top"><a href="./screenshots/track.png"><img src="./screenshots/track.png" alt="Public order tracking page" width="160"></a><br><sub>Track an order</sub></td>
  </tr>
  <tr>
    <td align="center" valign="top"><a href="./screenshots/wishlist.png"><img src="./screenshots/wishlist.png" alt="Wishlist" width="160"></a><br><sub>Wishlist</sub></td>
    <td align="center" valign="top"><a href="./screenshots/account.png"><img src="./screenshots/account.png" alt="Account settings" width="160"></a><br><sub>Account</sub></td>
    <td align="center" valign="top"><a href="./screenshots/login.png"><img src="./screenshots/login.png" alt="Login page with role picker" width="160"></a><br><sub>Login</sub></td>
    <td align="center" valign="top"><a href="./screenshots/register.png"><img src="./screenshots/register.png" alt="Register page" width="160"></a><br><sub>Register</sub></td>
    <td align="center" valign="top"><a href="./screenshots/sell.png"><img src="./screenshots/sell.png" alt="Sell on Farmora page" width="160"></a><br><sub>Sell on Farmora</sub></td>
  </tr>
  <tr>
    <td align="center" valign="top"><a href="./screenshots/farmer-dashboard.png"><img src="./screenshots/farmer-dashboard.png" alt="Farmer dashboard" width="160"></a><br><sub>Farmer dashboard</sub></td>
    <td align="center" valign="top"><a href="./screenshots/farmer-products.png"><img src="./screenshots/farmer-products.png" alt="Farmer dashboard products tab" width="160"></a><br><sub>Farmer products</sub></td>
    <td align="center" valign="top"><a href="./screenshots/admin-sales.png"><img src="./screenshots/admin-sales.png" alt="Admin sales tab" width="160"></a><br><sub>Admin sales</sub></td>
    <td align="center" valign="top"><a href="./screenshots/admin-users.png"><img src="./screenshots/admin-users.png" alt="Admin users tab" width="160"></a><br><sub>Admin users</sub></td>
    <td align="center" valign="top"><a href="./screenshots/about.png"><img src="./screenshots/about.png" alt="About page" width="160"></a><br><sub>About</sub></td>
  </tr>
  <tr>
    <td align="center" valign="top"><a href="./screenshots/contact.png"><img src="./screenshots/contact.png" alt="Contact page" width="160"></a><br><sub>Contact</sub></td>
    <td align="center" valign="top"><a href="./screenshots/blog.png"><img src="./screenshots/blog.png" alt="Blog page" width="160"></a><br><sub>Blog</sub></td>
    <td align="center" valign="top"><a href="./screenshots/faq.png"><img src="./screenshots/faq.png" alt="FAQ page" width="160"></a><br><sub>FAQ</sub></td>
    <td align="center" valign="top"><a href="./screenshots/terms.png"><img src="./screenshots/terms.png" alt="Terms of service page" width="160"></a><br><sub>Terms</sub></td>
    <td align="center" valign="top"><a href="./screenshots/not-found.png"><img src="./screenshots/not-found.png" alt="404 page" width="160"></a><br><sub>404 page</sub></td>
  </tr>
</table>

Click a thumbnail to see the full page.

**On a phone**

<table>
  <tr>
    <td align="center"><img src="./screenshots/mobile-home.png" alt="Home page on mobile" width="220"><br><sub>Home</sub></td>
    <td align="center"><img src="./screenshots/mobile-shop.png" alt="Shop page on mobile" width="220"><br><sub>Shop</sub></td>
    <td align="center"><img src="./screenshots/mobile-product.png" alt="Product page on mobile" width="220"><br><sub>Product</sub></td>
  </tr>
</table>

## Features

### Shopping

- Home page with categories, featured products, harvest deals, partner farms and customer reviews
- Shop with search, filters (category, farm, max price, organic, in stock), six ways to sort and 12 products per page
- Product pages with a photo gallery and hover zoom, reviews you can add to, related products and a "recently viewed" row
- Cart with a free-delivery progress bar (free over $50), a wishlist, coupon codes and 5% tax
- Checkout with card (demo) or cash on delivery

### 3-day delivery tracking

- Every order goes through five stages: placed, packed at the farm (6h), shipped (24h), out for delivery (60h) and delivered (72h)
- The order page shows a progress bar with a little truck on it, the estimated arrival time and a countdown that updates while you watch
- Orders can be cancelled until they ship, and there's a printable invoice
- Anyone can track an order by number on the public tracking page

### Farmers

- A directory of farms and a profile page for each one, with their story, certifications and products
- A farmer dashboard with gross sales, the 10% platform fee, net earnings, a 7-day earnings chart and a low-stock warning
- Publish, edit and delete products, with photos uploaded to Supabase Storage
- An orders tab with delivery progress for every order, plus farm profile settings

### Admin and the 10% commission

- Farmora keeps 10% of the product total on every order and the farmer keeps the other 90%
- That 10% commission is the platform's revenue, and it's the headline number on the admin overview. Sales volume and farmer payouts are shown next to it for context, not counted as revenue
- The overview also has a 7-day commission chart, commission by category, the latest sales and the top products
- A sales tab with the order value, commission and farmer payout for every order, filters, and a CSV export
- Product moderation (approve, hide, reject, feature, edit, delete), user management (suspend or reactivate), a farmers overview and the contact form inbox

### Performance

- Pages render instantly from local data while Firestore loads in the background
- Firebase is loaded on demand instead of being bundled into every page
- Responsive images from the Pexels CDN, sized to the screen with `srcset`
- A short splash screen on the first visit, a progress bar at the top of the page on every navigation, and loading states that respect "reduce motion"

### SEO

- Every public page has its own title, description, canonical URL, Open Graph and Twitter tags
- Structured data (JSON-LD) for the website, the organisation, me as the author, and every product with price, stock, delivery time and rating
- Blog posts get their own pages with article metadata (author, publish date, cover image) and `BlogPosting` structured data
- A generated `sitemap.xml` with all products, farms and blog posts, and a `robots.txt` that keeps carts, checkout and dashboards out of search results
- Open Graph and Twitter preview images generated with `next/og`, a web app manifest and a `humans.txt`

## Tech stack

- **Next.js 14** (App Router) and **React 18**, written in plain JSX
- **Tailwind CSS** for styling
- **Firebase**: Authentication, Firestore and Analytics
- **Supabase Storage** for product photo uploads
- **Pexels** for food and farm photos, **randomuser.me** for portraits
- **Playwright** for the screenshots
- Hosted on **Vercel**

## How it works

**Local-first data.** Everything in `lib/db.js` answers immediately. Each getter merges three sources by id: the seed data in `data/seed.js`, the last Firestore snapshot cached in `localStorage`, and any changes made in this browser. Firestore is fetched in the background with a 4 second timeout and refreshed at most once a minute per collection. When new data arrives it fires a `farmora:data` event, and the `useData` hook re-renders whatever is on screen. Writes are saved locally first and sent to Firestore after. If Firestore is unreachable it's skipped for the rest of the session, and if a single collection is locked down by security rules, only that collection stays local.

**Lazy Firebase.** `lib/firebase.js` pulls in the Firebase SDK with dynamic `import()`, and the auth listener only starts once the browser is idle. That cut the shared JavaScript on every page from about 215 KB to about 106 KB. The Supabase client is only downloaded when a farmer actually uploads a photo.

**Images.** `data/photos.js` holds Pexels photo ids. `lib/images.js` turns them into CDN URLs and builds a `srcset` at 320, 480, 640, 960 and 1280 pixels wide, so a phone never downloads a desktop-sized photo. `SafeImage` lazy-loads everything except hero images and quietly swaps in a placeholder if a photo fails.

**Commission math.** The rate lives in one place, `COMMISSION_RATE = 0.1` in `lib/format.js`. The helpers in `lib/stats.js` take 10% of each order's product total (price × quantity) as commission and give the rest to the farmer. Delivery fees and tax aren't part of it, and cancelled orders count for nothing. So an order with $42.00 of produce earns Farmora $4.20 and the farmer $37.80.

**Delivery tracking.** There's no background job moving orders along. `lib/delivery.js` works out the stage from how many hours have passed since the order was placed, so the tracker is always right, even offline.

## Getting started

You'll need Node.js 18.17 or newer.

```bash
git clone https://github.com/Fehan999/Farmora.git
cd Farmora
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build && npm start
```

You don't need any environment variables to try it. When a variable is missing or empty, `lib/firebase.js` and `lib/supabase.js` fall back to the config of my demo Firebase project and Supabase bucket that's bundled with the code, and `lib/seo.js` falls back to the live URL.

To use your own backend, copy the example file and replace the placeholders with your own Firebase and Supabase keys (see below):

```bash
cp .env.example .env.local
```

Delete any line you don't fill in. A placeholder like `your-firebase-api-key` counts as a real value, so it would replace the fallback instead of using it. If you deploy under your own domain, also change `NEXT_PUBLIC_SITE_URL` so canonical URLs, the sitemap and structured data point at the right place.

### Firebase setup

1. Create a project in the [Firebase console](https://console.firebase.google.com) and add a web app. Copy its config into the `NEXT_PUBLIC_FIREBASE_*` variables.
2. Go to **Authentication → Sign-in method** and enable **Email/Password**.
3. Create a **Firestore** database. The collections (`users`, `products`, `orders`, `reviews`, `messages`, `newsletter`) are created the first time something is written to them.

### Supabase setup

1. Create a project and copy the URL and publishable key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. In **Storage**, create a **public** bucket called `farmora`. If you pick another name, put it in `NEXT_PUBLIC_SUPABASE_BUCKET`.
3. Add a policy that lets the browser upload to it:

```sql
create policy "Allow uploads to farmora"
on storage.objects for insert
to anon
with check (bucket_id = 'farmora');
```

That's fine for a demo. For a real shop I'd only allow uploads from signed-in farmers.

> **No Firebase or Supabase? It still works.** If Firestore can't be reached, Farmora runs on the seed data and your browser's local storage, so you can still shop, check out, publish products and use both dashboards. The demo accounts don't depend on Firebase at all. Only creating a real account needs Firebase Auth, and only photo uploads need Supabase (you can paste an image URL instead).

## Screenshots script

The images in `screenshots/` aren't taken by hand. Playwright isn't in `package.json`, so install it and its Chromium build first (the `--no-save` keeps it out of the lockfile):

```bash
npm i --no-save playwright@1.56.1 && npx playwright install chromium
```

Then, with the site running on [http://localhost:3000](http://localhost:3000) in another terminal (`npm run dev`, or `npm run build && npm start`), run:

```bash
npm run screenshots
```

It opens the site in headless Chromium, signs in as the demo customer, farmer or admin when a page needs it, fills the cart and wishlist for those shots, and saves each page at 1440×900 (full page) plus three phone shots at 390×844. It also checks that every photo in `data/photos.js` still loads, and writes the results to `screenshots/image-report.json` along with contact sheets of all the photos. Set `BASE_URL` to point it at another address, like the live site.

There's also a GitHub Action that builds the site and runs the same script whenever I push code changes. It uploads the images as a build artifact and pushes them to a separate `screenshots` branch, so I can check fresh shots and copy the ones I want into `screenshots/` without running anything locally.

## Project structure

```
app/            pages (App Router), metadata, sitemap, robots, OG images
components/     UI pieces: SafeImage, DeliveryTracker, dashboards, loaders
context/        AuthContext (sessions, demo logins), ShopContext (cart, wishlist)
data/           seed farms, products and orders, blog posts, Pexels photo ids
lib/            db.js (local-first data), firebase, supabase, seo, stats, delivery
public/         humans.txt
screenshots/    generated by npm run screenshots
docs/           project write-up
```

## Roadmap

- Real payments with Stripe. Checkout is a demo right now.
- Switch the background sync to Firestore's real-time listeners and tighten the security rules, including uploads only for signed-in farmers.
- Delivery areas and time slots per farm, instead of one 72-hour timeline for everyone.
- Proper end-to-end tests for checkout and the dashboards. The screenshot script already does half the clicking.

## Author

Designed and developed by **Ehan Siddique**.

GitHub: [@Fehan999](https://github.com/Fehan999)

If you try it and something breaks, or you have an idea, feel free to open an issue.

## License

MIT. See [LICENSE](./LICENSE).
