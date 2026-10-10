# 🌱 Farmora — From Local Farms to Your Door

A full-stack farm-to-table e-commerce marketplace where **farmers** publish their products, **buyers** shop and track deliveries live, and **admins** manage the whole platform.

**Designed & Developed by Ehan Siddique**

## Tech stack

- **Next.js 14** (App Router) + **React 18** — JSX only
- **Tailwind CSS**
- **Firebase** — Authentication, Firestore, Analytics
- **Supabase Storage** — product image uploads (bucket: `farmora`)

## Demo accounts

Click a demo button on the **Sign in** page — no signup needed:

| Role   | Email                 | Password    |
| ------ | --------------------- | ----------- |
| Admin  | admin@farmora.demo    | farmora123  |
| Farmer | farmer@farmora.demo   | farmora123  |
| Buyer  | buyer@farmora.demo    | farmora123  |

Coupon codes: `FRESH10`, `FARMORA20`, `WELCOME5`. Sample order numbers to track: `ORD-10240` – `ORD-10257`.

## Features

- Home page with hero, categories, featured products, deals, farmers and testimonials
- Shop with search, category / farm / price / organic / stock filters, sorting and pagination
- Product pages with gallery, reviews, related products and farmer info
- Farmer profiles and directory
- Cart, wishlist, coupons, tax and free-delivery threshold
- Checkout with card or cash on delivery
- **3-day live delivery tracker** (Placed → Packed → Shipped → Out for delivery → Delivered)
- Order history, order cancellation, printable invoice, public order tracking page
- **Farmer dashboard**: revenue chart, publish/edit/delete products with Supabase image upload, orders, farm profile
- **Admin dashboard**: revenue and category analytics, order management + CSV export, product moderation (approve / hide / feature / delete), user management (suspend / activate), farmers overview, contact messages
- Auth: register as buyer or farmer, login, password reset, profile settings
- About, Contact, FAQ, Blog, Sell on Farmora, Shipping, Terms, Privacy, 404
- Seed data: 8 farms, 12 buyers, 40 products and 18 orders

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

### Firebase setup

1. In the Firebase console enable **Authentication → Email/Password**.
2. Create a **Firestore** database. Collections used: `users`, `products`, `orders`, `reviews`, `messages`, `newsletter`.

### Supabase setup

Create a **public** storage bucket named `farmora` and add a policy that allows `insert` for the `anon` role so farmers can upload images.

> If Firebase or Supabase is not configured yet, the app still works: data falls back to the browser's local storage and demo logins use a local session.
