import { z } from "zod";
import { COUNTRIES } from "@/lib/countries";
import { isCurrencyCode } from "@/lib/currencies";

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a real date");
const countryNames = new Set(COUNTRIES.map((item) => item.country));

function parseUtcDay(value: string) {
  const [year, month, date] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, date);
}

export const detailsSchema = z
  .object({
    email: z.string().trim().email("Enter a valid email").max(160),
    fullName: z.string().trim().min(2, "Enter the full name").max(120),
    dob: day,
    licenceCountry: z.string().trim(),
    destinationCountry: z.string().trim(),
    licenceNumber: z.string().trim().min(3, "Enter the licence number").max(40),
    licenceClass: z.string().trim().min(1, "Enter the licence class").max(20),
    issueDate: day,
    expiryDate: day,
  })
  .superRefine((data, ctx) => {
    const today = Date.now();
    const dob = parseUtcDay(data.dob);
    const issue = parseUtcDay(data.issueDate);
    const expiry = parseUtcDay(data.expiryDate);
    if (!countryNames.has(data.licenceCountry)) {
      ctx.addIssue({ code: "custom", path: ["licenceCountry"], message: "Choose a listed country" });
    }
    if (!countryNames.has(data.destinationCountry)) {
      ctx.addIssue({ code: "custom", path: ["destinationCountry"], message: "Choose a listed country" });
    }
    if (dob >= today) {
      ctx.addIssue({ code: "custom", path: ["dob"], message: "Date of birth must be in the past" });
    }
    if (issue > today) {
      ctx.addIssue({ code: "custom", path: ["issueDate"], message: "Issue date cannot be in the future" });
    }
    if (expiry <= issue) {
      ctx.addIssue({ code: "custom", path: ["expiryDate"], message: "Expiry must be after the issue date" });
    }
    if (expiry < today) {
      ctx.addIssue({ code: "custom", path: ["expiryDate"], message: "The licence expiry date must still be in the future" });
    }
  });

export const planSchema = z
  .object({
    deliveryType: z.enum(["digital", "print_digital"]),
    validityYears: z.coerce.number().refine((value) => value === 1 || value === 2 || value === 3, "Choose 1, 2, or 3 years"),
    currency: z.string().trim().toLowerCase(),
    shipName: z.string().trim().max(120).optional().or(z.literal("")),
    shipLine1: z.string().trim().max(160).optional().or(z.literal("")),
    shipLine2: z.string().trim().max(160).optional().or(z.literal("")),
    shipCity: z.string().trim().max(80).optional().or(z.literal("")),
    shipRegion: z.string().trim().max(80).optional().or(z.literal("")),
    shipPostal: z.string().trim().max(20).optional().or(z.literal("")),
    shipCountry: z.string().trim().max(80).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (!isCurrencyCode(data.currency)) {
      ctx.addIssue({ code: "custom", path: ["currency"], message: "Choose a listed currency" });
    }
    if (data.deliveryType === "print_digital") {
      const required = ["shipName", "shipLine1", "shipCity", "shipPostal", "shipCountry"] as const;
      for (const field of required) {
        if (!data[field]) {
          ctx.addIssue({ code: "custom", path: [field], message: "Required for a printed card" });
        }
      }
    }
  });

export const uploadRequestSchema = z.object({
  orderId: z.string().min(1),
  accessToken: z.string().min(16),
  type: z.enum(["licence_front", "licence_back", "portrait"]),
  contentType: z.enum(["image/jpeg", "image/png", "application/pdf"]),
  size: z.number().int().positive().max(8 * 1024 * 1024),
});

export const checkoutSchema = z.object({
  orderId: z.string().min(1),
  accessToken: z.string().min(16),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(200).optional().or(z.literal("")),
});

export const lookupSchema = z.object({
  orderId: z.string().trim().min(1),
  email: z.string().trim().email(),
});

export const loginSchema = z.object({
  password: z.string().min(1).max(200),
});

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES = ["image/jpeg", "image/png", "application/pdf"] as const;
