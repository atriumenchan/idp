"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useCurrency } from "@/components/marketing/CurrencyProvider";
import { COUNTRIES } from "@/lib/countries";
import { formatMoney } from "@/lib/currencies";
import { deliveryLabel } from "@/lib/pricing";
import { detailsSchema, planSchema } from "@/lib/validators";

const STORAGE_KEY = "halden-order";
const inputClass = "mt-1 w-full px-3 py-3 text-sm";
const STEP_LABELS: Record<Step, string> = {
  eligibility: "Eligibility",
  details: "Details",
  uploads: "Documents",
  plan: "Package",
  review: "Review",
};

type DetailsInput = z.input<typeof detailsSchema>;
type PlanInput = z.input<typeof planSchema>;

type OrderView = {
  id: string;
  email: string;
  status: string;
  validityYears: number;
  deliveryType: "digital" | "print_digital";
  amountCents: number;
  currency: string;
  destinationCountry: string | null;
  uploads: { type: string }[];
  applicant: {
    fullName: string;
    dob: string;
    licenceCountry: string;
    licenceNumber: string;
    licenceClass: string;
    issueDate: string;
    expiryDate: string;
  } | null;
  shipName: string | null;
  shipLine1: string | null;
  shipCity: string | null;
  shipCountry: string | null;
};

type Step = "eligibility" | "details" | "uploads" | "plan" | "review";

const STEPS: Step[] = ["eligibility", "details", "uploads", "plan", "review"];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-800">{message}</p>;
}

function ApplyWizardInner() {
  const params = useSearchParams();
  const { currency } = useCurrency();
  const [step, setStep] = useState<Step>("eligibility");
  const [eligible, setEligible] = useState<"yes" | "no" | "">("");
  const [order, setOrder] = useState<OrderView | null>(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState<Record<string, string>>({});

  const detailsForm = useForm<DetailsInput>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      email: "",
      fullName: "",
      dob: "",
      licenceCountry: params.get("licenceCountry") || COUNTRIES[0].country,
      destinationCountry: params.get("destination") || COUNTRIES[0].country,
      licenceNumber: "",
      licenceClass: "",
      issueDate: "",
      expiryDate: "",
    },
  });

  const planForm = useForm<PlanInput>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      deliveryType: params.get("delivery") === "print_digital" ? "print_digital" : "digital",
      validityYears: Number(params.get("years") || 1),
      currency,
      shipName: "",
      shipLine1: "",
      shipLine2: "",
      shipCity: "",
      shipRegion: "",
      shipPostal: "",
      shipCountry: "",
    },
  });

  useEffect(() => {
    planForm.setValue("currency", currency);
  }, [currency, planForm]);

  useEffect(() => {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as { id: string; accessToken: string };
    void loadOrder(saved.id, saved.accessToken);
    // load once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadOrder(id: string, accessToken: string) {
    const res = await fetch(`/api/orders/${id}?token=${encodeURIComponent(accessToken)}`);
    if (!res.ok) return;
    const data = (await res.json()) as { order: OrderView };
    setOrder(data.order);
    setToken(accessToken);
    const done: Record<string, string> = {};
    for (const upload of data.order.uploads) done[upload.type] = "saved";
    setUploads(done);
  }

  function remember(id: string, accessToken: string) {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ id, accessToken }));
    setToken(accessToken);
  }

  async function saveDetails(values: DetailsInput) {
    setBusy(true);
    setError("");
    try {
      if (!token || !order) {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const data = (await res.json()) as { order?: OrderView; accessToken?: string; error?: string };
        if (!res.ok || !data.order || !data.accessToken) throw new Error(data.error || "Could not save");
        setOrder(data.order);
        remember(data.order.id, data.accessToken);
      } else {
        const res = await fetch(`/api/orders/${order.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token, details: values }),
        });
        const data = (await res.json()) as { order?: OrderView; error?: string };
        if (!res.ok || !data.order) throw new Error(data.error || "Could not save");
        setOrder(data.order);
      }
      setStep("uploads");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  async function uploadFile(type: "licence_front" | "licence_back" | "portrait", file: File) {
    if (!order || !token) return;
    setError("");
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type) || file.size > 8 * 1024 * 1024) {
      setError("Use a JPG, PNG, or PDF under 8MB.");
      return;
    }
    setBusy(true);
    try {
      const created = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          accessToken: token,
          type,
          contentType: file.type,
          size: file.size,
        }),
      });
      const target = (await created.json()) as { uploadUrl?: string; storageKey?: string; method?: string; error?: string };
      if (!created.ok || !target.uploadUrl || !target.storageKey) throw new Error(target.error || "Upload could not start");
      const put = await fetch(target.uploadUrl, {
        method: target.method || "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) throw new Error("The file was not stored");
      const saved = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token, upload: { type, storageKey: target.storageKey } }),
      });
      const data = (await saved.json()) as { order?: OrderView; error?: string };
      if (!saved.ok || !data.order) throw new Error(data.error || "The file was not attached");
      setOrder(data.order);
      setUploads((current) => ({ ...current, [type]: "saved" }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function savePlan(values: PlanInput) {
    if (!order || !token) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token, plan: values }),
      });
      const data = (await res.json()) as { order?: OrderView; error?: string };
      if (!res.ok || !data.order) throw new Error(data.error || "Could not save the plan");
      setOrder(data.order);
      setStep("review");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the plan");
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    if (!order || !token) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, accessToken: token }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout could not be started");
      window.location.href = data.url;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout failed");
      setBusy(false);
    }
  }

  const delivery = planForm.watch("deliveryType");
  const hasUploads = ["licence_front", "licence_back", "portrait"].every((type) => uploads[type]);

  const stepIndex = STEPS.indexOf(step);

  return (
    <div>
      <ol className="mb-6 grid grid-cols-5 gap-2" aria-label="Steps">
        {STEPS.map((item, index) => (
          <li key={item} className="min-w-0">
            <span className={`block h-1 rounded-full ${index <= stepIndex ? "bg-pine" : "bg-line"}`} />
            <span className={`mt-2 block truncate text-xs ${item === step ? "font-semibold text-ink" : "text-mute"}`}>
              {index + 1}. {STEP_LABELS[item]}
            </span>
          </li>
        ))}
      </ol>
      {error ? (
        <p role="alert" className="notice-error mb-4 rounded-xl px-3 py-2 text-sm">
          {error}
        </p>
      ) : null}

      {step === "eligibility" ? (
        <fieldset>
          <legend className="font-serif text-2xl">Do you have a valid driving licence?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className={`cursor-pointer rounded-2xl border px-4 py-4 ${eligible === "yes" ? "border-pine bg-ivory" : "border-line"}`}>
              <input className="sr-only" type="radio" name="eligible" checked={eligible === "yes"} onChange={() => setEligible("yes")} />
              <span className="block font-semibold">Yes</span>
              <span className="mt-1 block text-sm text-mute">The licence has not expired.</span>
            </label>
            <label className={`cursor-pointer rounded-2xl border px-4 py-4 ${eligible === "no" ? "border-danger bg-[#f8e8e4]" : "border-line"}`}>
              <input className="sr-only" type="radio" name="eligible" checked={eligible === "no"} onChange={() => setEligible("no")} />
              <span className="block font-semibold">No</span>
              <span className="mt-1 block text-sm text-mute">It is expired, or I do not have one.</span>
            </label>
          </div>
          {eligible === "no" ? (
            <p className="notice-warn mt-4 rounded-xl px-3 py-2 text-sm">We can only translate a licence that is still valid. This application stops here.</p>
          ) : null}
          <button type="button" disabled={eligible !== "yes"} className="btn mt-5" onClick={() => setStep("details")}>
            Continue
          </button>
        </fieldset>
      ) : null}

      {step === "details" ? (
        <form className="grid gap-3 sm:grid-cols-2" onSubmit={detailsForm.handleSubmit(saveDetails)} noValidate>
          {(
            [
              ["fullName", "Full name", "text"],
              ["email", "Email", "email"],
              ["dob", "Date of birth", "date"],
              ["licenceNumber", "Licence number", "text"],
              ["licenceClass", "Licence class", "text"],
              ["issueDate", "Issue date", "date"],
              ["expiryDate", "Expiry date", "date"],
            ] as const
          ).map(([name, label, type]) => (
            <div key={name} className={name === "fullName" || name === "email" ? "sm:col-span-2" : ""}>
              <label htmlFor={name} className="text-sm font-medium">
                {label}
              </label>
              <input id={name} type={type} className={inputClass} {...detailsForm.register(name)} />
              <FieldError message={detailsForm.formState.errors[name]?.message} />
            </div>
          ))}
          <div>
            <label htmlFor="licenceCountry" className="text-sm font-medium">Licence country</label>
            <select id="licenceCountry" className={inputClass} {...detailsForm.register("licenceCountry")}>
              {COUNTRIES.map((item) => (
                <option key={item.country}>{item.country}</option>
              ))}
            </select>
            <FieldError message={detailsForm.formState.errors.licenceCountry?.message} />
          </div>
          <div>
            <label htmlFor="destinationCountry" className="text-sm font-medium">Destination</label>
            <select id="destinationCountry" className={inputClass} {...detailsForm.register("destinationCountry")}>
              {COUNTRIES.map((item) => (
                <option key={item.country}>{item.country}</option>
              ))}
            </select>
            <FieldError message={detailsForm.formState.errors.destinationCountry?.message} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={busy} className="btn">
              {busy ? "Saving…" : "Save and continue"}
            </button>
          </div>
        </form>
      ) : null}

      {step === "uploads" ? (
        <div className="space-y-4">
          {(
            [
              ["licence_front", "Front of the licence"],
              ["licence_back", "Back of the licence"],
              ["portrait", "Portrait photo"],
            ] as const
          ).map(([type, label]) => (
            <div key={type} className="rounded-2xl border border-line px-4 py-4">
              <label htmlFor={type} className="text-sm font-semibold">
                {label}
              </label>
              <input
                id={type}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                className="mt-2 block w-full text-sm"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadFile(type, file);
                }}
              />
              <p className={`mt-2 text-sm ${uploads[type] ? "text-ok" : "text-mute"}`}>
                {uploads[type] ? "Saved" : "JPG, PNG, or PDF, up to 8MB"}
              </p>
            </div>
          ))}
          <button type="button" disabled={!hasUploads || busy} className="btn" onClick={() => setStep("plan")}>
            Continue
          </button>
        </div>
      ) : null}

      {step === "plan" ? (
        <form className="space-y-3" onSubmit={planForm.handleSubmit(savePlan)}>
          <fieldset>
            <legend className="text-sm font-medium">Delivery</legend>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="radio" value="digital" {...planForm.register("deliveryType")} /> Digital copy
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" value="print_digital" {...planForm.register("deliveryType")} /> Print + digital
            </label>
          </fieldset>
          <div>
            <label htmlFor="validityYears" className="text-sm font-medium">How long we keep the file</label>
            <select id="validityYears" className={inputClass} {...planForm.register("validityYears")}>
              <option value={1}>1 year</option>
              <option value={2}>2 years</option>
              <option value={3}>3 years</option>
            </select>
            <FieldError message={planForm.formState.errors.validityYears?.message} />
          </div>
          <p className="text-sm text-mute">Currency: {currency.toUpperCase()}. Change it in the header before you continue. The server sets the amount.</p>
          {delivery === "print_digital" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["shipName", "Name"],
                  ["shipLine1", "Address line 1"],
                  ["shipLine2", "Address line 2"],
                  ["shipCity", "City"],
                  ["shipRegion", "Region"],
                  ["shipPostal", "Postal code"],
                  ["shipCountry", "Country"],
                ] as const
              ).map(([name, label]) => (
                <div key={name}>
                  <label htmlFor={name} className="text-sm font-medium">{label}</label>
                  <input id={name} className={inputClass} {...planForm.register(name)} />
                  <FieldError message={planForm.formState.errors[name]?.message} />
                </div>
              ))}
            </div>
          ) : null}
          <button type="submit" disabled={busy} className="btn">
            {busy ? "Saving…" : "Review order"}
          </button>
        </form>
      ) : null}

      {step === "review" && order ? (
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            {order.applicant?.fullName} · {order.email}
          </p>
          <p>
            {order.applicant?.licenceCountry} licence {order.applicant?.licenceNumber}, class {order.applicant?.licenceClass}. Destination{" "}
            {order.destinationCountry}.
          </p>
          <p>
            {deliveryLabel(order.deliveryType)} · {order.validityYears} {order.validityYears === 1 ? "year" : "years"} ·{" "}
            {formatMoney(order.amountCents, order.currency)}
          </p>
          {order.deliveryType === "print_digital" ? (
            <p>
              Ship to {order.shipName}, {order.shipLine1}, {order.shipCity}, {order.shipCountry}
            </p>
          ) : null}
          <button type="button" disabled={busy} onClick={() => void confirm()} className="btn">
            {busy ? "Opening payment…" : "Confirm and pay"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ApplyWizard() {
  return (
    <Suspense fallback={<p className="text-sm">Loading the form…</p>}>
      <ApplyWizardInner />
    </Suspense>
  );
}
