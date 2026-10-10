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

Pages that need a login (order tracking and the two dashboards) were captured while signed in as the matching demo account.

**Live 3-day delivery tracker**

![Order page with the live delivery tracker](./screenshots/order-tracking.png)

**Admin dashboard: the platform's 10% commission at a glance**

![Admin dashboard overview](./screenshots/admin-dashboard.png)

<table>
  <tr>
    <td align="center" valign="top"><a href="./screenshots/home.png"><img src="./screenshots/home.png" alt="Home page" width="200"></a><br><sub>Home</sub></td>
    <td align="center" valign="top"><a href="./screenshots/shop.png"><img src="./screenshots/shop.png" alt="Shop page with filters" width="200"></a><br><sub>Shop</sub></td>
    <td align="center" valign="top"><a href="./screenshots/categories.png"><img src="./screenshots/categories.png" alt="Categories page" width="200"></a><br><sub>Categories</sub></td>
    <td align="center" valign="top"><a href="./screenshots/product.png"><img src="./screenshots/product.png" alt="Product page" width="200"></a><br><sub>Product</sub></td>
  </tr>
  <tr>
    <td align="center" valign="top"><a href="./screenshots/farmers.png"><img src="./screenshots/farmers.png" alt="Farmers directory" width="200"></a><br><sub>Farmers</sub></td>
    <td align="center" valign="top"><a href="./screenshots/farmer-profile.png"><img src="./screenshots/farmer-profile.png" alt="Farmer profile page" width="200"></a><br><sub>Farm profile</sub></td>
    <td align="center" valign="top"><a href="./screenshots/cart.png"><img src="./screenshots/cart.png" alt="Shopping cart" width="200"></a><br><sub>Cart</sub></td>
    <td align="center" valign="top"><a href="./screenshots/checkout.png"><img src="./screenshots/checkout.png" alt="Checkout page" width="200"></a><br><sub>Checkout</sub></td>
  </tr>
  <tr>
    <td align="center" valign="top"><a href="./screenshots/login.png"><img src="./screenshots/login.png" alt="Login page with role picker" width="200"></a><br><sub>Login</sub></td>
    <td align="center" valign="top"><a href="./screenshots/register.png"><img src="./screenshots/register.png" alt="Register page" width="200"></a><br><sub>Register</sub></td>
    <td align="center" valign="top"><a href="./screenshots/farmer-dashboard.png"><img src="./screenshots/farmer-dashboard.png" alt="Farmer dashboard" width="200"></a><br><sub>Farmer dashboard</sub></td>
    <td align="center" valign="top"><a href="./screenshots/admin-sales.png"><img src="./screenshots/admin-sales.png" alt="Admin sales tab" width="200"></a><br><sub>Admin sales</sub></td>
  </tr>
  <tr>
    <td align="center" valign="top"><a href="./screenshots/about.png"><img src="./screenshots/about.png" alt="About page" width="200"></a><br><sub>About</sub></td>
    <td align="center" valign="top"><a href="./screenshots/contact.png"><img src="./screenshots/contact.png" alt="Contact page" width="200"></a><br><sub>Contact</sub></td>
    <td align="center" valign="top"><a href="./screenshots/blog.png"><img src="./screenshots/blog.png" alt="Blog page" width="200"></a><br><sub>Blog</sub></td>
    <td align="center" valign="top"><a href="./screenshots/faq.png"><img src="./screenshots/faq.png" alt="FAQ page" width="200"></a><br><sub>FAQ</sub></td>
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
- The admin overview only shows what the platform actually earns: commission, gross sales, what's been paid out to farmers, a 7-day commission chart, earnings by category and top products
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
- A generated `sitemap.xml` with all products and farms, and a `robots.txt` that keeps carts, checkout and dashboards out of search results
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
cp .env.example .env.local
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build && npm start
```

Fill `.env.local` with your own Firebase and Supabase keys (see below). If you deploy under your own domain, also set `NEXT_PUBLIC_SITE_URL` so canonical URLs, the sitemap and structured data point at the right place.

### Firebase setup

1. Create a project in the [Firebase console](https://console.firebase.google.com) and add a web app. Copy its config into the `NEXT_PUBLIC_FIREBASE_*` variables.
2. Go to **Authentication → Sign-in method** and enable **Email/Password**.
3. Create a **Firestore** database. The collections (`users`, `products`, `orders`, `reviews`, `messages`, `newsletter`) are created the first time something is written to them.

### Supabase setup

1. Create a project and copy the URL and publishable key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. In **Storage**, create a **public** bucket called `farmora`.
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

The images in `screenshots/` aren't taken by hand. Running

```bash
npm run screenshots
```

opens the site in headless Chromium with Playwright, signs in as the demo customer, farmer or admin when a page needs it, fills the cart for the cart and checkout shots, and saves each page at 1440×900 (full page) plus three phone shots at 390×844.

There's also a GitHub Action that runs the same script and commits the new images, so the README stays up to date after changes without me having to do it locally.

## Project structure

```
app/            pages (App Router), metadata, sitemap, robots, OG images
components/     UI pieces: SafeImage, DeliveryTracker, dashboards, loaders
context/        AuthContext (sessions, demo logins), ShopContext (cart, wishlist)
data/           seed farms, products and orders, Pexels photo ids
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
