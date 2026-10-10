# Farmora: From Local Farms to Your Door

A farm-to-table marketplace where farmers sell directly to customers, with live 3-day delivery tracking and a 10% platform commission.

**Short description:** Farmora is a full-stack marketplace I designed and built that connects local farms with the people who eat their food. Customers shop by farm and track every order live until it reaches the door, farmers manage their own stand, and an admin dashboard follows the platform's 10% commission on every sale.

- **Role:** Solo designer and developer
- **Tech stack:** Next.js 14 (App Router), React 18, Tailwind CSS, Firebase (Auth, Firestore, Analytics), Supabase Storage, Vercel
- **Live site:** [farmora-smoky.vercel.app](https://farmora-smoky.vercel.app)
- **Source code:** [github.com/Fehan999/Farmora](https://github.com/Fehan999/Farmora)

## Overview

Farmora is an online farmers' market. Eight partner farms sell vegetables, fruit, dairy, bread, honey, meat, grains and herbs, every product shows which farm it came from, and orders arrive within 72 hours. The site has three sides: customers who shop, farmers who run their stand, and an admin who looks after the marketplace.

## The problem

Buying straight from a farm usually means a weekend trip to a market or chasing a farmer on social media. Small farms don't have time to build an online shop, and big grocery apps hide where the food came from. I wanted one place where customers can see who grew their food, farmers can list products in a couple of minutes, and the business model is clear to everyone: the platform takes 10% of each sale and the farmer keeps 90%.

## What I built

- A shop with search, filters, product galleries, reviews, a cart, a wishlist, coupons and checkout
- A live delivery tracker for every order, moving through five stages from "placed" to "delivered" over three days
- A farmer dashboard to publish products with photos, follow orders and see net earnings after the platform fee
- An admin dashboard focused on what the platform earns, with a sales table, CSV export, product moderation and user management
- A login page where visitors pick Customer or Farmer, then open a demo account in one click or create their own, plus a separate admin demo
- A journal with six posts on seasonal eating, recipes and the farmers themselves, each on its own page with article metadata

## Screenshots

These come from the `screenshots/` folder in the repo and are captured by the Playwright script in `scripts/screenshots.mjs`. The links point at the latest version on the default branch, so I can reuse them on my website and they'll stay current. Desktop shots are full-page captures at 1440 px wide, and the phone shot is 390×844 at 2x.

| Screenshot | What it shows | Image link |
|---|---|---|
| Home | Hero, categories, featured products, harvest deals, partner farms and reviews | [home.png](https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/home.png) |
| Product | Heirloom Tomatoes from Green Valley Farm, with the gallery, reviews and related products | [product.png](https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/product.png) |
| Order tracking | A sample order with the live 3-day delivery tracker, seen as the demo customer | [order-tracking.png](https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/order-tracking.png) |
| Admin dashboard | The overview, led by the platform's 10% commission | [admin-dashboard.png](https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/admin-dashboard.png) |
| Farmer dashboard | Robert Hayes' gross sales, platform fee, net earnings and recent orders | [farmer-dashboard.png](https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/farmer-dashboard.png) |
| Login | The Customer or Farmer choice, demo buttons and the admin demo | [login.png](https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/login.png) |
| Home on a phone | The home page on a 390 px wide screen | [mobile-home.png](https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/mobile-home.png) |

![Farmora home page](https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/home.png)

![Order page with the live 3-day delivery tracker](https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/order-tracking.png)

![Admin dashboard overview](https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/admin-dashboard.png)

<p>
  <img src="https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/product.png" alt="Product page" width="49%">
  <img src="https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/farmer-dashboard.png" alt="Farmer dashboard" width="49%">
</p>

<p>
  <img src="https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/login.png" alt="Login page with the role picker" width="66%">
  <img src="https://github.com/Fehan999/Farmora/raw/HEAD/screenshots/mobile-home.png" alt="Home page on a phone" width="30%">
</p>

## Design decisions

I went for a warm, earthy look: deep greens, a soft wheat colour and a serif display font for headings, so it feels closer to a market stall than a tech product. Real photos of food and farms do most of the work, and every farm has a face, a cover photo of the farm, a location and a short story, because knowing who grew your food is the whole point.

The admin dashboard deliberately leaves things out. An early version added up full order totals, delivery fees and tax included, but the platform doesn't keep any of that, so the headline number was misleading. Now the headline number is the 10% commission, which is what the platform actually earns. Sales volume and farmer payouts are still there for context, but they're labelled so nobody mistakes them for revenue. The login page asks one question, "how would you like to continue?", because most visitors just want to look around.

## Technical highlights

- **Local-first data.** Every page renders straight away from seed data and the browser cache. Firestore loads in the background with a timeout, and a small event tells components to refresh when newer data arrives. Writes are saved locally first and synced after.
- **Lazy-loaded Firebase.** The Firebase SDK is loaded with dynamic imports, and the auth listener waits until the browser is idle before it starts. That cut the shared JavaScript on every page from about 215 KB to about 106 KB.
- **Responsive images.** Photos come from the Pexels CDN with a `srcset` from 320 to 1280 pixels wide, so phones get small files, and broken images fall back to a placeholder.
- **10% commission model.** The rate lives in one constant. Commission is worked out on the product total only, never on delivery or tax, and the same helpers feed the admin and farmer dashboards so the numbers always agree.
- **Role-based dashboards.** Customers, farmers and admins each get their own protected area, and demo sessions work the same way as real accounts.
- **Live 3-day tracker.** An order's stage is calculated from the time it was placed, so there's no background job and the tracker is correct even offline.
- **SEO.** Per-page metadata and canonical URLs, JSON-LD for the site, the author, every product and every blog post, a generated sitemap and robots file, and Open Graph images generated with `next/og`.

## Challenges and how I solved them

**Pages stalling while Firestore was unavailable.** At first every page waited on Firestore, so when it was slow or blocked, the shop sat on a spinner. I rewrote the data layer to be local-first: pages answer from local data immediately, Firestore is a background sync, and if it fails once the site stops waiting on it for the rest of the session.

**Image weight.** Full-size food photos made the home page heavy on mobile. Moving to CDN URLs with `srcset` and lazy loading meant each device downloads a photo sized for its screen.

**Giving visitors instant access.** Asking someone to sign up just to look at a dashboard loses most of them. One-click demo accounts for each role open a ready-made session with no password and no waiting on a server, so the farmer and admin sides are one click away.

## What I learned

Perceived speed matters more than raw speed. Showing something useful straight away and quietly updating it later felt much better than a faster request behind a spinner. I also learned to measure bundle size before guessing, which is how I found that Firebase was half of every page's JavaScript. And keeping business rules like the commission rate in one place saved me from a lot of numbers that didn't quite match.

## What I'd do next

- Add real payments with Stripe and payouts to farmers
- Switch to Firestore real-time listeners and tighten the security rules
- Delivery areas and time slots per farm
- End-to-end tests for checkout and both dashboards
