# Competitor analysis (Halden rebuild)

Research date: 2026-03-18. Sites browsed live: theinternationaldrivingagency.com, theinternationaldrivingassociation.com, globallicenseauthority.com.

## Shared patterns worth adopting (ethically)

| Pattern | Agency | Association | Global License | Halden approach |
|--------|--------|-------------|----------------|-----------------|
| Hero + country checker above fold | Destination combobox + CTA | Issuing + destination + disabled apply until set | Issuing + destination + Start Application | Premium dual combobox with search, flags, result panel, query params to `/apply` |
| Validity tabs (1/2/3 year) | Tabs with expiry years | Same | Year buttons with expiry | Keep `lib/pricing.ts`; pill tabs with subtle motion |
| Digital vs print+digital cards | Side-by-side pricing | Print + Digital / Digital Only | Print+FREE Digital / Digital Only | Product showcase + comparison; honest copy (private translation) |
| 3-step how it works | Carousel + icons | Numbered steps with imagery | 3 easy steps | Illustrated steps with section rhythm |
| Popular destinations grid | 190 destinations claim | Flag links to countries | Destinations nav | Grid from `lib/countries` (no acceptance claims) |
| Eligibility gate | Country requirement H1 | Check eligibility H2 | Yes/No licence question | Optional yes/no before apply (valid licence only) |
| FAQ accordions | Long homepage FAQ | — | — | `FaqList` on home + `/faq` |
| Footer legal cluster | AAA disclaimer, policies | Long legal list | LLC address + disclaimer | Halden policies only; short private-service line |
| Order lookup in nav | — | My Order | Check My Order | Keep `/order/lookup` |
| Currency / language | Currency switcher | Language + English | EN/FR/AR | Keep currency; no fake languages |
| Final CTA band | Country checker repeat | Ready to Get Started | 5-minute digital CTA | Dark band, no false timers as guarantees |

## Conversion mechanisms (competitors)

**Strong:** Immediate checker on homepage; pricing on same scroll; repeated CTAs; validity pre-selection carried to checkout; trust bands (support, replacements, digital speed).

**Weak / avoid for Halden:** Invented Trustpilot scores, “1M+ customers”, rental company logos, “195 countries”, “drive legally”, “avoid fines”, IDP product naming, fake urgency (50% OFF), mis-stating government affiliation.

## Pricing reference (competitors vs Halden)

Competitors show ~$39–79 USD by year and package. **Halden keeps configured USD cents in `lib/pricing.ts`** ($49/$55/$59 digital; $69/$75/$79 print+digital).

## Halden differentiation

- Honest positioning: multilingual **translation** of an existing licence, not an official International Driving Permit.
- Destination notes marked `TODO_VERIFY`; never claim acceptance.
- Substantive UX without fabricated social proof: operations facts (encrypted checkout via Stripe, free resend, refund rules).
- Premium light/dark visual rhythm, searchable countries, polished apply wizard (existing APIs unchanged).

## Feature parity checklist

- [x] Homepage checker → apply query params (existing)
- [x] Order tracking by email + id (existing)
- [x] Stripe checkout + webhooks (existing)
- [x] Admin fulfilment (existing)
- [ ] Testimonials: UI shell only until real reviews exist
- [ ] Expanded country list: incremental; flags + search on current set first