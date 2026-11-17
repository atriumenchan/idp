# Halden Licence Translation

Temporary name. Change `PRODUCT_NAME` in `lib/copy.ts` when the final name is chosen.

Private service that prepares a multilingual translation of a valid driving licence. It is not a government document and it does not give anyone the right to drive.

## Setup

1. Install Node.js 20 or newer.
2. Create a PostgreSQL database.
3. Copy `.env.example` to `.env` and fill in the values.
4. Install and migrate:

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

5. Open http://localhost:3000

The local `.env` created for development uses database `postgresql://postgres:postgres@localhost:5432/halden` and operator password `halden-dev-admin`. Change both before any shared deployment.

## Services

- **Stripe**: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Forward webhooks with `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
- **Resend**: `RESEND_API_KEY`, `EMAIL_FROM`, and `CONTACT_TO`.
- **Cloudflare R2**: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_ENDPOINT`. Allow `PUT` and `GET` from the site origin on the bucket CORS policy. If R2 is unset, files are stored under `.data/uploads` and served with short-lived links.
- **Operator**: `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. Sign in at `/admin`.

Prices are USD amounts in `lib/pricing.ts`. Other currencies use the fixed rates in `lib/currencies.ts`. Checkout always uses the server amount.

Country records in `lib/countries.ts` are placeholders marked `TODO_VERIFY`.

## Scripts

- `npm run dev` — development server
- `npm run build` — generate the Prisma client and build
- `npm start` — production server

End-to-end checks are in `docs/test-checklist.md`.
