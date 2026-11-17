# Stripe test-mode checklist

Use Stripe test keys and the card `4242 4242 4242 4242`, any future expiry, and any CVC.

## Before you start

- [ ] PostgreSQL is running and `npx prisma migrate dev` has been applied
- [ ] `.env` has test Stripe keys and `STRIPE_WEBHOOK_SECRET` from `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- [ ] Resend keys are set if you want to see the email
- [ ] `npm run dev` is open at http://localhost:3000

## Marketing

- [ ] Home, pricing, FAQ, countries, contact, and the legal pages load on a narrow phone width and on a desktop width
- [ ] The notice about a translation, not a government document, sits directly above every purchase or start button
- [ ] Changing the currency changes the prices on the pricing section
- [ ] Country checker shows `TODO_VERIFY` and an issuer link
- [ ] Contact form shows a configuration error until Resend is set, then sends

## Application

- [ ] Choosing “No” on the valid-licence question stops the form
- [ ] A complete licence with a future expiry saves and survives a reload
- [ ] A GIF or a file over 8MB is rejected
- [ ] JPG or PNG front, back, and portrait are accepted
- [ ] Print + digital asks for an address; digital does not
- [ ] The confirm button stays disabled until the notice checkbox is checked
- [ ] The amount stored on the order matches `lib/pricing.ts` and the selected currency

## Payment and file

- [ ] Checkout opens on Stripe, not a price typed in the browser
- [ ] Cancelling returns without marking the order ready
- [ ] Paying with the test card marks the order ready after the webhook
- [ ] The PDF contains the 12 language sections and the disclaimer in the footer
- [ ] The email contains an order link
- [ ] Replaying the same webhook does not send a second email
- [ ] A webhook with a bad signature returns 400
- [ ] Order lookup fails with the wrong email and works with the right one
- [ ] The download link works, then expires

## Operator

- [ ] A wrong password is rejected
- [ ] The local password opens `/admin` and lists the order
- [ ] Uploads open from the order screen
- [ ] Regenerate increases the document version
- [ ] Resend sends one email
- [ ] Refund in test mode sets the status to refunded when the file has not been downloaded and the order is inside 14 days
- [ ] Mark shipped appears only for print orders
- [ ] CSV export opens with the columns listed in the admin export route

## Limits and errors

- [ ] Repeating checkout or upload quickly returns 429
- [ ] A missing URL shows the not-found page
- [ ] The form can be completed with a keyboard, and every field has a label
