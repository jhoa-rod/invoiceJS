# Entrega rediseño visual y archivo con selección múltiple

Archivos creados o modificados en esta petición. Copia cada contenido completo en la misma ruta dentro del proyecto.

## index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@700;800&display=swap"
      rel="stylesheet"
    />
    <title>Invoice management</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

## tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        sm: "0 1px 2px rgba(28,22,37,.06), 0 1px 1px rgba(28,22,37,.04)",
        md: "0 10px 30px rgba(28,22,37,.08), 0 2px 8px rgba(28,22,37,.05)",
        lg: "0 24px 60px rgba(28,22,37,.14)",
        soft: "0 10px 30px rgba(28,22,37,.08), 0 2px 8px rgba(28,22,37,.05)",
      },
      borderRadius: {
        sm: "10px",
        md: "14px",
        lg: "20px",
      },
      colors: {
        ink: "#1c1625",
        muted: "#7a6e88",
        surface: "#f7f5fb",
        card: "#ffffff",
        line: "#e7e0f0",
        brand: "#6b5590",
        "brand-deep": "#4a3866",
        "brand-soft": "#f1ecf9",
        gold: "#c9a15a",
        "gold-soft": "#f8efdc",
        positive: "#1f8a5f",
        danger: "#c4443a",
        app: {
          bg: "var(--surface)",
          surface: "var(--card)",
          soft: "var(--brand-soft)",
          border: "var(--line)",
          "border-subtle": "var(--line)",
          text: "var(--ink)",
          muted: "var(--muted)",
          accent: "var(--brand)",
          accentStrong: "var(--brand-deep)",
          positive: "var(--positive)",
          strong: "var(--ink)",
        },
        todo: "#4b6bfb",
        doing: "#f59e0b",
        done: "#16a34a"
      },
      fontFamily: {
        sans: ["Inter", "Avenir Next", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

```

## src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --ink: #1c1625;
    --muted: #7a6e88;
    --surface: #f7f5fb;
    --card: #ffffff;
    --line: #e7e0f0;
    --brand: #6b5590;
    --brand-deep: #4a3866;
    --brand-soft: #f1ecf9;
    --gold: #c9a15a;
    --gold-soft: #f8efdc;
    --positive: #1f8a5f;
    --danger: #c4443a;
    --color-bg: var(--surface);
    --color-surface: var(--card);
    --color-soft: var(--brand-soft);
    --color-border: var(--line);
    --color-border-subtle: var(--line);
    --color-text: var(--ink);
    --color-muted: var(--muted);
    --color-accent: var(--brand);
    --color-accent-strong: var(--brand-deep);
    --color-positive: var(--positive);
    --color-strong: var(--ink);
  }

  html {
    background: var(--surface);
    color: var(--ink);
    font-family: "Inter", "Avenir Next", "Segoe UI", sans-serif;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background:
      radial-gradient(circle at 12% 8%, rgba(201, 161, 90, 0.08), transparent 26rem),
      linear-gradient(180deg, #fbf9ff 0%, var(--surface) 34rem);
  }

  * {
    box-sizing: border-box;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  button:disabled {
    cursor: not-allowed;
  }

  ::selection {
    background: var(--brand-soft);
    color: var(--brand-deep);
  }
}

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes modalFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media print {
  * {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  body {
    background: #ffffff !important;
  }

  .no-print,
  nav,
  button,
  input,
  select,
  textarea {
    display: none !important;
  }

  main {
    padding: 0 !important;
  }

  .invoice-sheet {
    max-width: none !important;
    border: 1px solid var(--line) !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .invoice-print-band {
    background: var(--brand) !important;
    color: #ffffff !important;
  }

  .bg-app-soft {
    background: var(--brand-soft) !important;
  }

  .bg-app-strong {
    background: var(--ink) !important;
    color: #ffffff !important;
  }
}

```

## src/App.tsx

```tsx
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { BrandLogo } from "./components/BrandLogo";
import { ClientsView } from "./components/invoices/ClientsView";
import { EmailLogin } from "./components/invoices/EmailLogin";
import { InvoiceArchive } from "./components/invoices/InvoiceArchive";
import { InvoiceDashboard } from "./components/invoices/InvoiceDashboard";
import { InvoiceForm, type InvoiceErrors } from "./components/invoices/InvoiceForm";
import { InvoicePreview } from "./components/invoices/InvoicePreview";
import { LanguageSelector } from "./components/invoices/LanguageSelector";
import { ShareModal } from "./components/invoices/ShareModal";
import { ConfirmModal } from "./components/ui/ConfirmModal";
import { formatMessage, getDictionary, InvoiceI18nContext, type Language, type TranslationKey } from "./i18n/invoiceI18n";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import type { InvoiceClient } from "./types/client";
import type { Invoice } from "./types/invoice";
import { exportArchiveCsv, exportInvoiceCsv, type InvoiceExportLabels } from "./utils/invoiceExport";
import { isValidAmount } from "./utils/invoiceMath";
import { buildShareUrl, readSharedInvoiceFromHash } from "./utils/invoiceShare";
import {
  deleteInvoiceClient,
  loadInvoiceClients,
  saveInvoiceClient as saveInvoiceClientToDatabase,
  saveInvoiceClientFromParty,
} from "./utils/clientStorage";
import {
  cloneInvoice,
  createEmptyInvoice,
  deleteInvoice as deleteInvoiceFromDatabase,
  loadInvoices,
  saveInvoice as saveInvoiceToDatabase,
  seedSampleInvoices,
} from "./utils/invoiceStorage";

type AppView = "dashboard" | "form" | "archive" | "preview" | "clients";

const LANGUAGE_STORAGE_KEY = "invoice-manager.language.v1";

const getInitialLanguage = (): Language => {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return storedLanguage === "es" ? "es" : "en";
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

const validateInvoice = (
  invoice: Invoice,
  invoices: Invoice[],
  t: (key: TranslationKey) => string,
): InvoiceErrors => {
  const errors: InvoiceErrors = {};

  if (!invoice.invoiceNumber.trim()) {
    errors.invoiceNumber = t("invoiceNumberRequired");
  } else {
    const duplicate = invoices.some(
      (item) =>
        item.id !== invoice.id &&
        item.invoiceNumber.trim().toLowerCase() === invoice.invoiceNumber.trim().toLowerCase(),
    );
    if (duplicate) errors.invoiceNumber = t("invoiceNumberDuplicate");
  }

  if (!invoice.date) errors.date = t("dateRequired");
  if (!invoice.client.name.trim()) errors.clientName = t("clientRequired");
  if (!Number.isFinite(invoice.irpfRate) || invoice.irpfRate < 0 || invoice.irpfRate > 100) {
    errors.irpfRate = t("irpfInvalid");
  }

  if (invoice.lines.length === 0) {
    errors.lines = t("lineRequired");
  }

  invoice.lines.forEach((line) => {
    if (!isValidAmount(line.amount)) {
      errors[`line.${line.id}.amount`] = t("invalidAmount");
    }
  });

  const hasValidLine = invoice.lines.some((line) => line.description.trim() && isValidAmount(line.amount));
  if (!hasValidLine) {
    errors.lines = t("validLineRequired");
  }

  return errors;
};

const cleanInvoiceForSave = (invoice: Invoice): Invoice => {
  const now = new Date().toISOString();
  return {
    ...invoice,
    invoiceNumber: invoice.invoiceNumber.trim(),
    period: invoice.period.trim(),
    irpfRate: Number(invoice.irpfRate),
    issuer: {
      ...invoice.issuer,
      name: invoice.issuer.name.trim(),
      taxId: invoice.issuer.taxId.trim(),
      address: invoice.issuer.address.trim(),
      cityPostal: invoice.issuer.cityPostal.trim(),
      email: invoice.issuer.email?.trim(),
      iban: invoice.issuer.iban?.trim(),
      region: invoice.issuer.region,
      currencySymbol: invoice.issuer.currencySymbol?.trim(),
    },
    client: {
      ...invoice.client,
      name: invoice.client.name.trim(),
      taxId: invoice.client.taxId.trim(),
      address: invoice.client.address.trim(),
      cityPostal: invoice.client.cityPostal.trim(),
    },
    lines: invoice.lines.map((line) => ({
      ...line,
      description: line.description.trim(),
      dates: line.dates.trim(),
      hours: line.hours?.trim(),
      amount: Number(line.amount),
    })),
    updatedAt: now,
  };
};

const getExportLabels = (t: (key: TranslationKey) => string): InvoiceExportLabels => ({
  invoiceTitle: t("invoice").toUpperCase(),
  invoiceNumber: t("invoiceNumber"),
  date: t("date"),
  client: t("client"),
  taxId: t("taxId"),
  serviceDescription: t("description"),
  daysDates: t("daysDates"),
  hours: t("hours"),
  amount: t("amount"),
  grossTotal: t("grossTotal"),
  irpfPercent: t("irpfPercent"),
  irpfAmount: t("irpfAmount"),
  netTotal: t("netTotal"),
  status: t("status"),
  bankAccount: t("bankAccountLabel"),
  period: t("periodLabel"),
});

function App() {
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());
  const t = useMemo(() => {
    const dictionary = getDictionary(language);
    return (key: TranslationKey) => dictionary[key];
  }, [language]);
  const i18nValue = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  const [hash, setHash] = useState(() => window.location.hash);
  const sharedInvoice = useMemo(() => readSharedInvoiceFromHash(hash), [hash]);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<InvoiceClient[]>([]);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [activeView, setActiveView] = useState<AppView>("dashboard");
  const [draft, setDraft] = useState<Invoice>(() => createEmptyInvoice());
  const [errors, setErrors] = useState<InvoiceErrors>({});
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const [shareModalLink, setShareModalLink] = useState("");
  const [saveConfirmationInvoice, setSaveConfirmationInvoice] = useState<Invoice | null>(null);
  const [deleteRequest, setDeleteRequest] = useState<Invoice[]>([]);
  const showToast = (message: string, tone: "success" | "error" = "success") => setToast({ message, tone });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.title = t("appTitle");
  }, [language, t]);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    let isMounted = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) setAuthError(error.message || t("authGenericError"));
      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
      if (nextSession) {
        setAuthError("");
        setAuthMessage("");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [t]);

  useEffect(() => {
    const userId = session?.user.id;
    if (!userId) {
      setInvoices([]);
      setClients([]);
      setSelectedInvoiceId("");
      setInvoiceLoading(false);
      setDeleteRequest([]);
      return;
    }

    let isMounted = true;
    const loadUserInvoices = async () => {
      setInvoiceLoading(true);
      try {
        let nextInvoices = await loadInvoices(userId);
        if (nextInvoices.length === 0) {
          const seededInvoices = await seedSampleInvoices(userId);
          if (seededInvoices.length > 0) nextInvoices = seededInvoices;
        }
        const nextClients = await loadInvoiceClients(userId);
        if (!isMounted) return;
        setInvoices(nextInvoices);
        setClients(nextClients);
        setSelectedInvoiceId(nextInvoices[0]?.id ?? "");
        setActiveView("dashboard");
        setShareModalLink("");
        setSaveConfirmationInvoice(null);
        setDeleteRequest([]);
        setErrors({});
      } catch (error) {
        if (isMounted) showToast(getErrorMessage(error, t("loadInvoicesError")), "error");
      } finally {
        if (isMounted) setInvoiceLoading(false);
      }
    };

    void loadUserInvoices();

    return () => {
      isMounted = false;
    };
  }, [session?.user.id, t]);

  useEffect(() => {
    if (!selectedInvoiceId && invoices[0]) setSelectedInvoiceId(invoices[0].id);
  }, [invoices, selectedInvoiceId]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? invoices[0] ?? null;
  const userEmail = session?.user.email ?? "";
  const exportLabels = useMemo(() => getExportLabels(t), [t]);
  const navItems: Array<{ view: AppView; label: string }> = [
    { view: "dashboard", label: t("dashboard") },
    { view: "form", label: t("createInvoice") },
    { view: "archive", label: t("archive") },
    { view: "preview", label: t("preview") },
    { view: "clients", label: t("clients") },
  ];

  const handleSignIn = async (email: string, password: string) => {
    if (!supabase) {
      setAuthError(t("configurationHelp"));
      return;
    }

    setAuthSubmitting(true);
    setAuthError("");
    setAuthMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthSubmitting(false);

    if (error) {
      setAuthError(error.message || t("authGenericError"));
      return;
    }

    showToast(t("signedIn"));
  };

  const handleSignUp = async (email: string, password: string) => {
    if (!supabase) {
      setAuthError(t("configurationHelp"));
      return;
    }

    setAuthSubmitting(true);
    setAuthError("");
    setAuthMessage("");
    const { error } = await supabase.auth.signUp({ email, password });
    setAuthSubmitting(false);

    if (error) {
      setAuthError(error.message || t("authGenericError"));
      return;
    }

    setAuthMessage(t("accountCreated"));
  };

  const handleLogout = async () => {
    if (!supabase) return;
    setAuthSubmitting(true);
    const { error } = await supabase.auth.signOut();
    setAuthSubmitting(false);

    if (error) {
      showToast(error.message || t("authGenericError"), "error");
      return;
    }

    setInvoices([]);
    setClients([]);
    setSelectedInvoiceId("");
    setShareModalLink("");
    setSaveConfirmationInvoice(null);
    setDeleteRequest([]);
    showToast(t("signedOut"));
  };

  const startCreate = () => {
    const latestIssuer = invoices[0]?.issuer;
    setDraft(createEmptyInvoice(latestIssuer));
    setErrors({});
    setSaveConfirmationInvoice(null);
    setActiveView("form");
  };

  const startEdit = (invoice: Invoice) => {
    setDraft(cloneInvoice(invoice));
    setErrors({});
    setSelectedInvoiceId(invoice.id);
    setSaveConfirmationInvoice(null);
    setActiveView("form");
  };

  const openPreview = (invoice: Invoice) => {
    setSelectedInvoiceId(invoice.id);
    setSaveConfirmationInvoice(null);
    setActiveView("preview");
  };

  const saveInvoice = async (invoice: Invoice) => {
    const userId = session?.user.id;
    if (!userId) {
      showToast(t("authGenericError"), "error");
      return;
    }

    const validationErrors = validateInvoice(invoice, invoices, t);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      showToast(t("reviewRequired"), "error");
      return;
    }

    try {
      const cleanedInvoice = cleanInvoiceForSave(invoice);
      const savedInvoice = await saveInvoiceToDatabase(cleanedInvoice, userId);
      setInvoices((currentInvoices) => {
        const exists = currentInvoices.some((item) => item.id === savedInvoice.id);
        return exists
          ? currentInvoices.map((item) => (item.id === savedInvoice.id ? savedInvoice : item))
          : [savedInvoice, ...currentInvoices];
      });
      setSelectedInvoiceId(savedInvoice.id);
      setActiveView("preview");
      setShareModalLink("");
      setSaveConfirmationInvoice(savedInvoice);
      showToast(t("invoiceSaved"));
    } catch (error) {
      showToast(getErrorMessage(error, t("saveInvoiceError")), "error");
    }
  };

  const requestDeleteInvoices = (targetInvoices: Invoice[]) => {
    if (targetInvoices.length === 0) return;
    setDeleteRequest(targetInvoices);
  };

  const confirmDeleteInvoices = async () => {
    const targetInvoices = deleteRequest;
    if (targetInvoices.length === 0) return;
    try {
      await Promise.all(targetInvoices.map((invoice) => deleteInvoiceFromDatabase(invoice.id)));
      const deletedIds = new Set(targetInvoices.map((invoice) => invoice.id));
      setInvoices((current) => current.filter((item) => !deletedIds.has(item.id)));
      if (selectedInvoiceId && deletedIds.has(selectedInvoiceId)) setSelectedInvoiceId("");
      showToast(targetInvoices.length === 1 ? t("invoiceDeleted") : t("invoicesDeleted"));
    } catch (error) {
      showToast(getErrorMessage(error, t("deleteInvoiceError")), "error");
    } finally {
      setDeleteRequest([]);
    }
  };

  const shareInvoice = async (invoice: Invoice) => {
    const link = buildShareUrl(invoice);
    setShareModalLink(link);
  };

  const printInvoice = (invoice: Invoice) => {
    setShareModalLink("");
    setSaveConfirmationInvoice(null);
    setSelectedInvoiceId(invoice.id);
    setActiveView("preview");
    window.setTimeout(() => window.print(), 150);
  };

  const upsertClientInState = (savedClient: InvoiceClient) => {
    setClients((currentClients) => {
      const exists = currentClients.some((client) => client.id === savedClient.id);
      const nextClients = exists
        ? currentClients.map((client) => (client.id === savedClient.id ? savedClient : client))
        : [savedClient, ...currentClients];
      return [...nextClients].sort((a, b) => a.name.localeCompare(b.name));
    });
  };

  const saveClient = async (client: InvoiceClient) => {
    const userId = session?.user.id;
    if (!userId) return;

    try {
      const savedClient = await saveInvoiceClientToDatabase(client, userId);
      upsertClientInState(savedClient);
      showToast(t("clientSaved"));
    } catch (error) {
      showToast(getErrorMessage(error, t("clientSaveError")), "error");
    }
  };

  const saveInvoiceClient = async (client: Invoice["client"]) => {
    const userId = session?.user.id;
    if (!userId || !client.name.trim()) return;

    try {
      const savedClient = await saveInvoiceClientFromParty(client, userId, clients);
      upsertClientInState(savedClient);
      showToast(t("clientSaved"));
    } catch (error) {
      showToast(getErrorMessage(error, t("clientSaveError")), "error");
    }
  };

  const removeClient = async (client: InvoiceClient) => {
    try {
      await deleteInvoiceClient(client.id);
      setClients((currentClients) => currentClients.filter((item) => item.id !== client.id));
      showToast(t("clientDeleted"));
    } catch (error) {
      showToast(getErrorMessage(error, t("clientDeleteError")), "error");
    }
  };

  let content;

  if (sharedInvoice) {
    content = (
      <div className="min-h-screen bg-surface text-ink">
        <header className="no-print border-b border-line bg-card/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
            <BrandLogo />
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-line bg-card px-4 py-2 text-xs font-bold text-muted">
                {t("publicView")} · {sharedInvoice.invoiceNumber}
              </span>
              <LanguageSelector compact />
              <button
                type="button"
                onClick={() => exportInvoiceCsv(sharedInvoice, exportLabels)}
                className="min-h-11 rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
              >
                {t("csv")}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-11 rounded-[12px] bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
              >
                {t("pdf")}
              </button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <InvoicePreview invoice={sharedInvoice} readOnly />
        </main>
      </div>
    );
  } else if (authLoading) {
    content = (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-ink">
        <div className="rounded-lg border border-line bg-card px-6 py-5 text-sm font-bold text-muted shadow-sm">
          {t("loading")}
        </div>
      </div>
    );
  } else if (!session) {
    content = (
      <EmailLogin
        isConfigured={isSupabaseConfigured}
        isSubmitting={authSubmitting}
        error={authError}
        message={authMessage}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
      />
    );
  } else {
    content = (
      <div className="min-h-screen bg-surface text-ink">
        <header className="no-print border-b border-line bg-card/90 shadow-sm backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <BrandLogo />
              <div className="flex flex-wrap items-center justify-end gap-3">
                <LanguageSelector compact />
                <span className="rounded-full border border-line bg-card px-4 py-2 text-xs font-bold text-muted shadow-sm">{userEmail}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={authSubmitting}
                  className="min-h-10 rounded-[11px] border border-line bg-card px-4 py-2 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("logout")}
                </button>
              </div>
            </div>
            <div className="mt-8 grid gap-5 border-t border-line pt-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">{t("appEyebrow")}</p>
                <h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink">{t("appTitle")}</h1>
              </div>
              <nav className="flex flex-wrap gap-1 rounded-[14px] border border-line bg-card p-1.5 shadow-sm" aria-label="Sections">
                {navItems.map((item) => {
                  const isActive = activeView === item.view;
                  const handleClick = () => {
                    if (item.view === "form") {
                      startCreate();
                      return;
                    }
                    setActiveView(item.view);
                  };
                  return (
                    <button
                      key={item.view}
                      type="button"
                      onClick={handleClick}
                      className={
                        isActive
                          ? "min-h-10 rounded-[11px] bg-ink px-5 py-2 text-sm font-extrabold text-white shadow-sm"
                          : "min-h-10 rounded-[11px] px-5 py-2 text-sm font-extrabold text-muted transition hover:bg-brand-soft hover:text-ink"
                      }
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </header>

        <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
          {invoiceLoading ? (
            <section className="rounded-lg border border-line bg-card p-8 text-center shadow-sm">
              <p className="text-sm font-bold text-muted">{t("loading")}</p>
            </section>
          ) : null}

          {!invoiceLoading && activeView === "dashboard" ? (
            <InvoiceDashboard
              invoices={invoices}
              userEmail={userEmail}
              onCreate={startCreate}
              onOpenArchive={() => setActiveView("archive")}
              onPreview={openPreview}
            />
          ) : null}

          {!invoiceLoading && activeView === "form" ? (
            <InvoiceForm
              invoice={draft}
              errors={errors}
              mode={invoices.some((invoice) => invoice.id === draft.id) ? "edit" : "create"}
              clients={clients}
              onChange={setDraft}
              onSubmit={saveInvoice}
              onCancel={() => setActiveView(selectedInvoice ? "preview" : "dashboard")}
              onSaveClient={saveInvoiceClient}
            />
          ) : null}

          {!invoiceLoading && activeView === "archive" ? (
            <InvoiceArchive
              invoices={invoices}
              onCreate={startCreate}
              onPreview={openPreview}
              onEdit={startEdit}
              onShare={shareInvoice}
              onDownloadPdf={printInvoice}
              onDownloadSelectedCsv={(selectedInvoices) => exportArchiveCsv(selectedInvoices, exportLabels)}
              onExportArchiveCsv={() => exportArchiveCsv(invoices, exportLabels)}
              onDeleteSelected={requestDeleteInvoices}
            />
          ) : null}

          {!invoiceLoading && activeView === "preview" ? (
            selectedInvoice ? (
              <InvoicePreview
                invoice={selectedInvoice}
                onEdit={startEdit}
                onShare={shareInvoice}
                onDownloadPdf={printInvoice}
                onDownloadCsv={(invoice) => exportInvoiceCsv(invoice, exportLabels)}
              />
            ) : (
              <section className="rounded-lg border border-line bg-card p-8 text-center shadow-sm">
                <p className="text-sm font-bold text-muted">{t("noInvoiceSelected")}</p>
                <button
                  type="button"
                  onClick={startCreate}
                  className="mt-4 min-h-11 rounded-[12px] bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
                >
                  {t("createInvoice")}
                </button>
              </section>
            )
          ) : null}

          {!invoiceLoading && activeView === "clients" && session?.user.id ? (
            <ClientsView clients={clients} userId={session.user.id} onSave={saveClient} onDelete={removeClient} />
          ) : null}
        </main>

        {saveConfirmationInvoice ? (
          <div className="no-print fixed inset-0 z-40 flex items-center justify-center bg-ink/40 px-5 py-6 backdrop-blur-[2px] animate-[modalFade_200ms_ease-out]">
            <section className="w-full max-w-md rounded-[18px] border border-line bg-card p-7 text-center shadow-lg animate-[modalIn_200ms_ease-out]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft text-xl font-extrabold text-gold">✓</div>
              <p className="mt-5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">{t("invoiceSaved")}</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.04em] text-ink">{t("invoiceSavedTitle")}</h2>
              <p className="mt-2 text-sm text-muted">{t("invoiceSavedMessage")}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(saveConfirmationInvoice)}
                  className="min-h-11 rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
                >
                  {t("edit")}
                </button>
                <button
                  type="button"
                  onClick={() => openPreview(saveConfirmationInvoice)}
                  className="min-h-11 rounded-[12px] bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
                >
                  {t("viewInvoice")}
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {shareModalLink ? <ShareModal link={shareModalLink} onClose={() => setShareModalLink("")} /> : null}

        {deleteRequest.length > 0 ? (
          <ConfirmModal
            title={t("deleteSelectedInvoicesTitle")}
            message={
              deleteRequest.length === 1
                ? formatMessage(t("deleteConfirm"), { number: deleteRequest[0].invoiceNumber })
                : formatMessage(t("deleteSelectedInvoicesMessage"), { count: deleteRequest.length })
            }
            confirmLabel={t("confirmDelete")}
            cancelLabel={t("cancel")}
            onConfirm={() => void confirmDeleteInvoices()}
            onCancel={() => setDeleteRequest([])}
          />
        ) : null}

        {toast ? (
          <div className="fixed bottom-5 right-5 z-50 flex w-[calc(100%-2.5rem)] max-w-sm items-center gap-3 rounded-[14px] bg-ink px-5 py-4 text-sm font-extrabold text-white shadow-lg">
            <span
              className={
                toast.tone === "error"
                  ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-danger text-white"
                  : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-ink"
              }
              aria-hidden="true"
            >
              {toast.tone === "error" ? "!" : "✓"}
            </span>
            <span>{toast.message}</span>
          </div>
        ) : null}
      </div>
    );
  }

  return <InvoiceI18nContext.Provider value={i18nValue}>{content}</InvoiceI18nContext.Provider>;
}

export default App;

```

## src/i18n/invoiceI18n.tsx

```tsx
import { createContext, useContext } from "react";

export type Language = "en" | "es";

const en = {
  appEyebrow: "Document management",
  appTitle: "Invoice management",
  session: "Session",
  language: "Language",
  english: "English",
  spanish: "Spanish",
  loading: "Loading...",
  configurationRequired: "Supabase configuration required",
  configurationHelp:
    "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable secure sign in and database storage.",
  signIn: "Sign in",
  signUp: "Create account",
  authSubtitle: "Use your email and password to access your invoices securely.",
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm password",
  enterEmail: "Enter a valid email address.",
  enterPassword: "Enter your password.",
  passwordLength: "Password must be at least 6 characters.",
  passwordsDoNotMatch: "Passwords do not match.",
  switchToSignUp: "Need an account? Create one",
  switchToSignIn: "Already have an account? Sign in",
  accountCreated: "Account created. Check your email if confirmation is required, then sign in.",
  signedIn: "Signed in.",
  signedOut: "Signed out.",
  logout: "Sign out",
  dashboard: "Dashboard",
  createInvoice: "Create invoice",
  newInvoice: "New invoice",
  editInvoice: "Edit invoice",
  archive: "Archive",
  preview: "Preview",
  invoicePreview: "Invoice preview",
  publicView: "Public view",
  invoice: "Invoice",
  csv: "CSV",
  pdf: "PDF",
  overview: "Overview",
  summary: "Summary",
  summaryDescription: "Revenue, tax withholding and latest documents.",
  greetingMorning: "Good morning, {name}",
  greetingAfternoon: "Good afternoon, {name}",
  greetingEvening: "Good evening, {name}",
  invoices: "Invoices",
  clients: "Clients",
  grossTotal: "Gross total",
  irpf: "IRPF",
  tax: "Tax",
  netTotal: "Net total",
  acrossInvoices: "Across {count} invoice(s)",
  allTime: "All time",
  beforeTax: "Before tax",
  taxWithheld: "Tax withheld",
  combinedTax: "IRPF / IVA combined",
  statusBreakdown: "Status breakdown",
  viewArchive: "View archive",
  status: "Status",
  draftStatus: "Draft",
  sentStatus: "Sent",
  paidStatus: "Paid",
  drafts: "Draft",
  sent: "Sent",
  paid: "Paid",
  latestInvoices: "Latest invoices",
  savedInvoices: "Saved invoices",
  results: "{filtered} result(s) of {total} invoice(s).",
  exportArchiveCsv: "Export archive CSV",
  search: "Search",
  searchPlaceholder: "Client, number or date",
  date: "Date",
  from: "From",
  to: "To",
  invoiceNumber: "Invoice no.",
  client: "Client",
  taxId: "Tax ID",
  actions: "Actions",
  view: "View",
  edit: "Edit",
  share: "Share",
  delete: "Delete",
  noInvoicesFound: "No invoices match the search.",
  noInvoiceSelected: "No invoice selected.",
  noInvoicesSelected: "No invoices selected",
  oneInvoiceSelected: "1 invoice selected",
  manyInvoicesSelected: "{count} invoices selected",
  selectionHelp: "View, Edit, Share and PDF work with one selected invoice. CSV and Delete work with one or more.",
  selectAllInvoices: "Select all invoices",
  selectInvoice: "Select invoice {number}",
  deleteSelectedInvoicesTitle: "Delete selected invoices",
  deleteSelectedInvoicesMessage: "This will permanently delete {count} selected invoice(s).",
  confirmDelete: "Delete",
  invoiceFormHelp: "Totals recalculate when amounts change.",
  billingRegion: "Billing region",
  regionSpain: "Spain",
  regionEu: "European Union",
  regionUs: "United States",
  regionLatam: "Latin America",
  regionInternational: "International / generic",
  currencySymbol: "Currency symbol",
  cancel: "Cancel",
  saveInvoice: "Save invoice",
  invoiceData: "Invoice details",
  irpfPercent: "Tax (%)",
  irpfAmount: "Tax amount",
  period: "Period or general description",
  issuerData: "Issuer details",
  fullName: "Full name",
  taxNumber: "NIE / NIF / CIF",
  address: "Address",
  cityPostal: "City / postal code",
  bankAccount: "Bank account / IBAN",
  clientData: "Client details",
  clientName: "Name or company",
  savedClient: "Saved client",
  selectSavedClient: "Select a saved client",
  saveAsClient: "Save as new client",
  clientSaved: "Client saved.",
  clientSaveError: "Could not save client.",
  savedClients: "Saved clients",
  clientsDescription: "Reusable client records for new invoices.",
  noClientsSaved: "No saved clients yet.",
  newClient: "New client",
  editClient: "Edit client",
  saveClient: "Save client",
  clientDeleted: "Client deleted.",
  clientDeleteError: "Could not delete client.",
  deleteClientConfirm: "Delete client {name}?",
  deleteClientTitle: "Delete client",
  deleteClientMessage: "Delete client {name}? This action cannot be undone.",
  serviceLines: "Service lines",
  addLine: "Add line",
  description: "Description",
  daysDates: "Days or dates completed",
  hours: "Hours",
  amount: "Amount",
  action: "Action",
  remove: "Remove",
  invoiceNumberRequired: "Invoice number is required.",
  invoiceNumberDuplicate: "An invoice with this number already exists.",
  dateRequired: "Date is required.",
  clientRequired: "Client is required.",
  irpfInvalid: "Enter a percentage between 0 and 100.",
  lineRequired: "Add at least one service line.",
  validLineRequired: "Add at least one line with a description and valid amount.",
  invalidAmount: "Invalid amount.",
  reviewRequired: "Review the required fields.",
  invoiceSaved: "Invoice saved.",
  invoiceSavedTitle: "Invoice saved",
  invoiceSavedMessage: "What would you like to do next?",
  viewInvoice: "View invoice",
  invoiceDeleted: "Invoice deleted.",
  invoicesDeleted: "Invoices deleted.",
  deleteConfirm: "Delete invoice {number}?",
  shareLink: "Share link",
  shareInvoice: "Share invoice",
  shareInvoiceHelp: "Anyone with this link can view a read-only copy.",
  copy: "Copy",
  copied: "Copied!",
  close: "Close",
  linkCopied: "Link copied to clipboard.",
  linkGenerated: "Link generated.",
  bankAccountLabel: "Bank account",
  serviceProvided: "Service provided",
  periodLabel: "Period",
  loadInvoicesError: "Could not load invoices.",
  saveInvoiceError: "Could not save invoice.",
  deleteInvoiceError: "Could not delete invoice.",
  authGenericError: "Authentication failed. Please check your details.",
};

const es: Record<keyof typeof en, string> = {
  appEyebrow: "Gestión documental",
  appTitle: "Gestión de facturas",
  session: "Sesión",
  language: "Idioma",
  english: "Inglés",
  spanish: "Español",
  loading: "Cargando...",
  configurationRequired: "Configuración de Supabase requerida",
  configurationHelp:
    "Configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para activar el acceso seguro y la base de datos.",
  signIn: "Iniciar sesión",
  signUp: "Crear cuenta",
  authSubtitle: "Usa tu email y contraseña para acceder a tus facturas de forma segura.",
  email: "Email",
  password: "Contraseña",
  confirmPassword: "Confirmar contraseña",
  enterEmail: "Introduce un email válido.",
  enterPassword: "Introduce tu contraseña.",
  passwordLength: "La contraseña debe tener al menos 6 caracteres.",
  passwordsDoNotMatch: "Las contraseñas no coinciden.",
  switchToSignUp: "¿Necesitas una cuenta? Crea una",
  switchToSignIn: "¿Ya tienes cuenta? Inicia sesión",
  accountCreated: "Cuenta creada. Revisa tu email si se requiere confirmación y luego inicia sesión.",
  signedIn: "Sesión iniciada.",
  signedOut: "Sesión cerrada.",
  logout: "Cerrar sesión",
  dashboard: "Dashboard",
  createInvoice: "Crear factura",
  newInvoice: "Nueva factura",
  editInvoice: "Editar factura",
  archive: "Archivo",
  preview: "Vista previa",
  invoicePreview: "Vista previa",
  publicView: "Vista pública",
  invoice: "Factura",
  csv: "CSV",
  pdf: "PDF",
  overview: "Resumen",
  summary: "Resumen",
  summaryDescription: "Facturación, retenciones y últimos documentos.",
  greetingMorning: "Buenos días, {name}",
  greetingAfternoon: "Buenas tardes, {name}",
  greetingEvening: "Buenas noches, {name}",
  invoices: "Facturas",
  clients: "Clientes",
  grossTotal: "Total bruto",
  irpf: "IRPF",
  tax: "Impuesto",
  netTotal: "Total neto",
  acrossInvoices: "En {count} factura(s)",
  allTime: "Todo el tiempo",
  beforeTax: "Antes de impuesto",
  taxWithheld: "Impuesto retenido",
  combinedTax: "IRPF / IVA combinado",
  statusBreakdown: "Desglose por estado",
  viewArchive: "Ver archivo",
  status: "Estado",
  draftStatus: "Borrador",
  sentStatus: "Enviada",
  paidStatus: "Pagada",
  drafts: "Borrador",
  sent: "Enviada",
  paid: "Pagada",
  latestInvoices: "Últimas facturas",
  savedInvoices: "Facturas guardadas",
  results: "{filtered} resultado(s) de {total} factura(s).",
  exportArchiveCsv: "Exportar archivo CSV",
  search: "Buscar",
  searchPlaceholder: "Cliente, número o fecha",
  date: "Fecha",
  from: "Desde",
  to: "Hasta",
  invoiceNumber: "Nº factura",
  client: "Cliente",
  taxId: "CIF/NIF",
  actions: "Acciones",
  view: "Ver",
  edit: "Editar",
  share: "Compartir",
  delete: "Eliminar",
  noInvoicesFound: "No hay facturas que coincidan con la búsqueda.",
  noInvoiceSelected: "No hay ninguna factura seleccionada.",
  noInvoicesSelected: "Ninguna factura seleccionada",
  oneInvoiceSelected: "1 factura seleccionada",
  manyInvoicesSelected: "{count} facturas seleccionadas",
  selectionHelp: "Ver, Editar, Compartir y PDF funcionan con una factura seleccionada. CSV y Eliminar funcionan con una o varias.",
  selectAllInvoices: "Seleccionar todas las facturas",
  selectInvoice: "Seleccionar factura {number}",
  deleteSelectedInvoicesTitle: "Eliminar facturas seleccionadas",
  deleteSelectedInvoicesMessage: "Esto eliminará definitivamente {count} factura(s) seleccionada(s).",
  confirmDelete: "Eliminar",
  invoiceFormHelp: "Los totales se recalculan al modificar los importes.",
  billingRegion: "Región de facturación",
  regionSpain: "España",
  regionEu: "Unión Europea",
  regionUs: "Estados Unidos",
  regionLatam: "Latinoamérica",
  regionInternational: "Internacional / genérico",
  currencySymbol: "Símbolo de moneda",
  cancel: "Cancelar",
  saveInvoice: "Guardar factura",
  invoiceData: "Datos de la factura",
  irpfPercent: "Impuesto (%)",
  irpfAmount: "Importe impuesto",
  period: "Período o descripción general",
  issuerData: "Datos del emisor",
  fullName: "Nombre completo",
  taxNumber: "NIE / NIF / CIF",
  address: "Dirección",
  cityPostal: "Ciudad / código postal",
  bankAccount: "Cuenta bancaria / IBAN",
  clientData: "Datos del cliente",
  clientName: "Nombre o empresa",
  savedClient: "Cliente guardado",
  selectSavedClient: "Selecciona un cliente guardado",
  saveAsClient: "Guardar como cliente nuevo",
  clientSaved: "Cliente guardado.",
  clientSaveError: "No se pudo guardar el cliente.",
  savedClients: "Clientes guardados",
  clientsDescription: "Clientes reutilizables para nuevas facturas.",
  noClientsSaved: "Aún no hay clientes guardados.",
  newClient: "Nuevo cliente",
  editClient: "Editar cliente",
  saveClient: "Guardar cliente",
  clientDeleted: "Cliente eliminado.",
  clientDeleteError: "No se pudo eliminar el cliente.",
  deleteClientConfirm: "¿Eliminar el cliente {name}?",
  deleteClientTitle: "Eliminar cliente",
  deleteClientMessage: "¿Eliminar el cliente {name}? Esta acción no se puede deshacer.",
  serviceLines: "Líneas de servicios",
  addLine: "Añadir línea",
  description: "Descripción",
  daysDates: "Días o fechas realizadas",
  hours: "Horas",
  amount: "Importe",
  action: "Acción",
  remove: "Eliminar",
  invoiceNumberRequired: "El número de factura es obligatorio.",
  invoiceNumberDuplicate: "Ya existe una factura con este número.",
  dateRequired: "La fecha es obligatoria.",
  clientRequired: "El cliente es obligatorio.",
  irpfInvalid: "Introduce un porcentaje entre 0 y 100.",
  lineRequired: "Añade al menos una línea de servicio.",
  validLineRequired: "Añade al menos una línea con descripción e importe válido.",
  invalidAmount: "Importe no válido.",
  reviewRequired: "Revisa los campos obligatorios.",
  invoiceSaved: "Factura guardada.",
  invoiceSavedTitle: "Factura guardada",
  invoiceSavedMessage: "¿Qué quieres hacer ahora?",
  viewInvoice: "Ver factura",
  invoiceDeleted: "Factura eliminada.",
  invoicesDeleted: "Facturas eliminadas.",
  deleteConfirm: "¿Eliminar la factura {number}?",
  shareLink: "Link compartible",
  shareInvoice: "Compartir factura",
  shareInvoiceHelp: "Cualquier persona con este enlace puede ver una copia solo lectura.",
  copy: "Copiar",
  copied: "¡Copiado!",
  close: "Cerrar",
  linkCopied: "Enlace copiado al portapapeles.",
  linkGenerated: "Enlace generado.",
  bankAccountLabel: "Cuenta bancaria",
  serviceProvided: "Servicio realizado",
  periodLabel: "Período",
  loadInvoicesError: "No se pudieron cargar las facturas.",
  saveInvoiceError: "No se pudo guardar la factura.",
  deleteInvoiceError: "No se pudo eliminar la factura.",
  authGenericError: "No se pudo autenticar. Revisa tus datos.",
};

const dictionaries = { en, es };

export type TranslationKey = keyof typeof en;

export const formatMessage = (message: string, values: Record<string, string | number>) =>
  Object.entries(values).reduce((nextMessage, [key, value]) => nextMessage.replace(`{${key}}`, String(value)), message);

interface InvoiceI18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

export const InvoiceI18nContext = createContext<InvoiceI18nContextValue>({
  language: "en",
  setLanguage: () => undefined,
  t: (key) => dictionaries.en[key],
});

export const useInvoiceI18n = () => useContext(InvoiceI18nContext);

export const getDictionary = (language: Language) => dictionaries[language];

```

## src/components/BrandLogo.tsx (archivo nuevo)
Carpeta: src/components

```tsx
interface BrandLogoProps {
  compact?: boolean;
}

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-[linear-gradient(135deg,#6b5590,#4a3866)] shadow-sm">
        <span className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-gold" aria-hidden="true" />
        <span className="relative font-display text-sm font-extrabold tracking-[-0.03em] text-white">IJS</span>
      </div>
      {!compact ? <span className="font-display text-xl font-bold tracking-[-0.03em] text-ink">InvoiceJS</span> : null}
    </div>
  );
}

```

## src/components/ui/Dropdown.tsx (archivo nuevo)
Carpeta: src/components/ui

```tsx
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
}

interface DropdownProps {
  label?: string;
  value: string;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function Dropdown({ label, value, options, placeholder, disabled = false, onChange }: DropdownProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const activeOption = options[activeIndex] ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    const selectedIndex = options.findIndex((option) => option.value === value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen, options, value]);

  const selectOption = (option: DropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % Math.max(options.length, 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current - 1 + Math.max(options.length, 1)) % Math.max(options.length, 1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      if (activeOption) selectOption(activeOption);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      {label ? <span className="mb-1 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{label}</span> : null}
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        className={
          isOpen
            ? "flex min-h-11 w-full items-center justify-between gap-3 rounded-[11px] border-[1.5px] border-brand bg-card px-3.5 py-3 text-left text-sm font-semibold text-ink shadow-sm outline-none ring-4 ring-brand-soft transition disabled:cursor-not-allowed disabled:opacity-55"
            : "flex min-h-11 w-full items-center justify-between gap-3 rounded-[11px] border-[1.5px] border-line bg-card px-3.5 py-3 text-left text-sm font-semibold text-ink shadow-sm outline-none transition hover:-translate-y-px hover:border-brand hover:shadow-md disabled:cursor-not-allowed disabled:opacity-55"
        }
      >
        <span className={selectedOption ? "truncate" : "truncate text-muted"}>{selectedOption?.label ?? placeholder}</span>
        <span className={isOpen ? "text-brand transition duration-150 rotate-180" : "text-muted transition duration-150"} aria-hidden="true">
          ˄
        </span>
      </button>

      {isOpen ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 rounded-[12px] border border-line bg-card p-1.5 shadow-lg animate-[dropdownIn_160ms_ease-out]"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <button
                key={option.value || option.label}
                type="button"
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
                className={
                  isSelected || isActive
                    ? "flex w-full items-center justify-between gap-3 rounded-lg bg-brand-soft px-3 py-2.5 text-left text-sm text-brand-deep"
                    : "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ink transition hover:bg-brand-soft"
                }
              >
                <span>
                  <span className={isSelected ? "block font-bold" : "block font-medium"}>{option.label}</span>
                  {option.description ? <span className="mt-0.5 block text-xs text-muted">{option.description}</span> : null}
                </span>
                {isSelected ? <span className="text-gold" aria-hidden="true">✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

```

## src/components/ui/ConfirmModal.tsx (archivo nuevo)
Carpeta: src/components/ui

```tsx
interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-5 py-6 backdrop-blur-[2px] animate-[modalFade_200ms_ease-out]">
      <section className="w-full max-w-[420px] rounded-[18px] border border-line bg-card p-7 shadow-lg animate-[modalIn_200ms_ease-out]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label={cancelLabel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-card text-xl font-semibold text-muted transition hover:-translate-y-px hover:border-brand hover:text-ink hover:shadow-md"
          >
            ×
          </button>
        </div>

        <div className="mt-7 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-10 rounded-[10px] border border-line bg-card px-4 py-2 text-sm font-bold text-ink transition hover:-translate-y-px hover:border-brand hover:shadow-md"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              variant === "danger"
                ? "min-h-10 rounded-[10px] bg-danger px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md"
                : "min-h-10 rounded-[10px] bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
            }
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

```

## src/components/invoices/LanguageSelector.tsx

```tsx
import type { Language } from "../../i18n/invoiceI18n";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { Dropdown } from "../ui/Dropdown";

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useInvoiceI18n();

  return (
    <div className={compact ? "min-w-36" : "grid gap-1"}>
      <Dropdown
        label={compact ? undefined : t("language")}
        value={language}
        options={[
          { value: "en", label: t("english") },
          { value: "es", label: t("spanish") },
        ]}
        onChange={(value) => setLanguage(value as Language)}
      />
    </div>
  );
}

```

## src/components/invoices/EmailLogin.tsx

```tsx
import { useState, type FormEvent } from "react";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { BrandLogo } from "../BrandLogo";
import { LanguageSelector } from "./LanguageSelector";

interface EmailLoginProps {
  isConfigured: boolean;
  isSubmitting: boolean;
  error: string;
  message: string;
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string) => void;
}

type AuthMode = "signIn" | "signUp";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const inputClass =
  "min-h-12 w-full rounded-[12px] border border-line bg-card px-4 py-3 text-base text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand-soft disabled:cursor-not-allowed disabled:bg-brand-soft/55 disabled:text-muted";

const labelClass = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted";

export function EmailLogin({ isConfigured, isSubmitting, error, message, onSignIn, onSignUp }: EmailLoginProps) {
  const { t } = useInvoiceI18n();
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState("");

  const isSignUp = mode === "signUp";

  const clearLocalError = () => setFieldError("");

  const validate = () => {
    if (!isValidEmail(email)) return t("enterEmail");
    if (!password.trim()) return t("enterPassword");
    if (isSignUp && password.length < 6) return t("passwordLength");
    if (isSignUp && password !== confirmPassword) return t("passwordsDoNotMatch");
    return "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setFieldError(validationError);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (isSignUp) {
      onSignUp(normalizedEmail, password);
      return;
    }
    onSignIn(normalizedEmail, password);
  };

  const switchMode = () => {
    setMode(isSignUp ? "signIn" : "signUp");
    setFieldError("");
    setConfirmPassword("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-8 text-ink">
      <main className="w-full max-w-[640px] rounded-lg border border-line bg-card p-7 shadow-md sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <BrandLogo />
          <LanguageSelector compact />
        </div>

        <div className="mt-9">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">{t("appEyebrow")}</p>
          <h1 className="mt-2 max-w-md font-display text-5xl font-extrabold leading-[0.96] tracking-[-0.04em] text-ink sm:text-6xl">
            {t("appTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{t("authSubtitle")}</p>
        </div>

        {!isConfigured ? (
          <div className="mt-7 rounded-[14px] border border-line bg-brand-soft p-5">
            <p className="font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{t("configurationRequired")}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{t("configurationHelp")}</p>
          </div>
        ) : null}

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2">
            <span className={labelClass}>{t("email")}</span>
            <input
              className={inputClass}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                clearLocalError();
              }}
              disabled={!isConfigured || isSubmitting}
            />
          </label>

          <label className="grid gap-2">
            <span className={labelClass}>{t("password")}</span>
            <input
              className={inputClass}
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearLocalError();
              }}
              disabled={!isConfigured || isSubmitting}
            />
          </label>

          {isSignUp ? (
            <label className="grid gap-2">
              <span className={labelClass}>{t("confirmPassword")}</span>
              <input
                className={inputClass}
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  clearLocalError();
                }}
                disabled={!isConfigured || isSubmitting}
              />
            </label>
          ) : null}

          {fieldError || error ? (
            <p className="rounded-[12px] border border-danger/25 bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
              {fieldError || error}
            </p>
          ) : null}

          {message ? (
            <p className="rounded-[12px] border border-positive/20 bg-positive/10 px-4 py-3 text-sm font-bold text-positive">{message}</p>
          ) : null}

          <button
            type="submit"
            disabled={!isConfigured || isSubmitting}
            className="min-h-12 rounded-[12px] bg-brand px-5 py-3 text-base font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isSubmitting ? t("loading") : isSignUp ? t("signUp") : t("signIn")}
          </button>
        </form>

        <button
          type="button"
          onClick={switchMode}
          className="mt-6 min-h-12 w-full rounded-[12px] border border-line bg-card px-5 py-3 text-base font-extrabold text-ink transition hover:-translate-y-px hover:border-brand hover:shadow-md"
        >
          {isSignUp ? t("switchToSignIn") : t("switchToSignUp")}
        </button>
      </main>
    </div>
  );
}

```

## src/components/invoices/InvoiceDashboard.tsx

```tsx
import type { Invoice } from "../../types/invoice";
import { formatMessage, useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency } from "../../utils/invoiceMath";
import { getInvoiceCurrencySymbol } from "../../utils/invoiceRegion";

interface InvoiceDashboardProps {
  invoices: Invoice[];
  userEmail?: string;
  onCreate: () => void;
  onOpenArchive: () => void;
  onPreview: (invoice: Invoice) => void;
}

const statusStyles: Record<Invoice["status"], string> = {
  borrador: "bg-brand-soft text-brand-deep",
  enviada: "bg-[#ebe4f6] text-brand",
  pagada: "bg-gold-soft text-[#806128]",
};

const statusBarStyles: Record<Invoice["status"], string> = {
  borrador: "bg-line",
  enviada: "bg-brand",
  pagada: "bg-gold",
};

const getInitials = (name: string) => {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials || "IJ";
};

const getDisplayName = (email?: string) => {
  if (!email) return "InvoiceJS";
  const localPart = email.split("@")[0] ?? "";
  const firstName = localPart.split(/[._-]/)[0] ?? localPart;
  return firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : "InvoiceJS";
};

export function InvoiceDashboard({ invoices, userEmail, onCreate, onOpenArchive, onPreview }: InvoiceDashboardProps) {
  const { t } = useInvoiceI18n();
  const totals = invoices.reduce(
    (acc, invoice) => {
      const invoiceTotals = calculateTotals(invoice);
      return {
        bruto: acc.bruto + invoiceTotals.totalBruto,
        irpf: acc.irpf + invoiceTotals.irpf,
        neto: acc.neto + invoiceTotals.totalNeto,
      };
    },
    { bruto: 0, irpf: 0, neto: 0 },
  );

  const statusCount = invoices.reduce<Record<Invoice["status"], number>>(
    (acc, invoice) => {
      acc[invoice.status] += 1;
      return acc;
    },
    { borrador: 0, enviada: 0, pagada: 0 },
  );

  const latestInvoices = [...invoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  const summaryCurrencySymbol = invoices[0] ? getInvoiceCurrencySymbol(invoices[0]) : "€";
  const displayName = getDisplayName(userEmail);
  const hour = new Date().getHours();
  const greetingKey = hour < 12 ? "greetingMorning" : hour < 20 ? "greetingAfternoon" : "greetingEvening";
  const statusLabels: Array<{ status: Invoice["status"]; label: string }> = [
    { status: "borrador", label: t("drafts") },
    { status: "enviada", label: t("sent") },
    { status: "pagada", label: t("paid") },
  ];

  const totalStatus = Math.max(invoices.length, 1);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">{t("overview")}</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-5xl">
            {formatMessage(t(greetingKey), { name: displayName })}
          </h2>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex min-h-12 items-center justify-center rounded-[12px] bg-ink px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md"
        >
          + {t("newInvoice")}
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg bg-[linear-gradient(135deg,#1c1625,#352542)] p-6 text-white shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/60">{t("netTotal")}</p>
              <p className="mt-3 font-mono text-3xl font-bold tracking-[-0.04em]">{formatCurrency(totals.neto, summaryCurrencySymbol)}</p>
              <p className="mt-2 text-sm text-white/58">{formatMessage(t("acrossInvoices"), { count: invoices.length })}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-gold/20 font-mono text-lg font-bold text-gold">
              {summaryCurrencySymbol || "$"}
            </span>
          </div>
        </article>

        <article className="rounded-lg border border-line bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">{t("invoices")}</p>
              <p className="mt-3 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink">{invoices.length}</p>
              <p className="mt-2 text-sm text-muted">{t("allTime")}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-gold-soft font-mono text-lg font-bold text-gold">
              {invoices.length}
            </span>
          </div>
        </article>

        <article className="rounded-lg border border-line bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">{t("grossTotal")}</p>
              <p className="mt-3 font-mono text-3xl font-bold tracking-[-0.04em] text-ink">{formatCurrency(totals.bruto, summaryCurrencySymbol)}</p>
              <p className="mt-2 text-sm text-muted">{t("beforeTax")}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-gold-soft font-display text-lg font-extrabold text-gold">
              Σ
            </span>
          </div>
        </article>

        <article className="rounded-lg border border-line bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-muted">{t("taxWithheld")}</p>
              <p className="mt-3 font-mono text-3xl font-bold tracking-[-0.04em] text-ink">{formatCurrency(totals.irpf, summaryCurrencySymbol)}</p>
              <p className="mt-2 text-sm text-muted">{t("combinedTax")}</p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-gold-soft font-display text-lg font-extrabold text-gold">
              %
            </span>
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-line bg-card p-6 shadow-sm">
        <h3 className="font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{t("statusBreakdown")}</h3>
        <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-brand-soft">
          {statusLabels.map(({ status }) => {
            const width = `${(statusCount[status] / totalStatus) * 100}%`;
            return <span key={status} className={statusBarStyles[status]} style={{ width }} aria-hidden="true" />;
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted">
          {statusLabels.map(({ status, label }) => (
            <span key={status} className="inline-flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${statusBarStyles[status]}`} aria-hidden="true" />
              {label} · {statusCount[status]}
            </span>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5">
          <h3 className="font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{t("latestInvoices")}</h3>
          <button
            type="button"
            onClick={onOpenArchive}
            className="text-sm font-extrabold text-brand transition hover:text-brand-deep"
          >
            {t("viewArchive")} →
          </button>
        </div>

        <div className="divide-y divide-line">
          {latestInvoices.map((invoice) => {
            const invoiceTotals = calculateTotals(invoice);
            const invoiceCurrencySymbol = getInvoiceCurrencySymbol(invoice);
            const statusLabel =
              invoice.status === "borrador" ? t("draftStatus") : invoice.status === "enviada" ? t("sentStatus") : t("paidStatus");
            return (
              <button
                key={invoice.id}
                type="button"
                onClick={() => onPreview(invoice)}
                className="grid w-full gap-4 px-6 py-5 text-left transition hover:bg-brand-soft/55 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-brand-soft font-display text-sm font-extrabold text-brand-deep">
                  {getInitials(invoice.client.name)}
                </span>
                <span>
                  <span className="block font-mono text-base font-bold text-ink">{invoice.invoiceNumber}</span>
                  <span className="mt-1 block text-sm font-medium text-muted">{invoice.client.name}</span>
                </span>
                <span className="sm:text-right">
                  <span className="block font-mono text-base font-bold text-ink">{formatCurrency(invoiceTotals.totalNeto, invoiceCurrencySymbol)}</span>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[invoice.status]}`}>
                    {statusLabel}
                  </span>
                </span>
              </button>
            );
          })}
          {latestInvoices.length === 0 ? <p className="px-6 py-8 text-center text-sm font-bold text-muted">{t("noInvoicesFound")}</p> : null}
        </div>
      </section>
    </div>
  );
}

```

## src/components/invoices/InvoiceArchive.tsx

```tsx
import { useEffect, useMemo, useState } from "react";
import type { Invoice } from "../../types/invoice";
import { formatMessage, useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency, formatInvoiceDate } from "../../utils/invoiceMath";
import { getInvoiceCurrencySymbol, getInvoiceDateFormat } from "../../utils/invoiceRegion";

interface InvoiceArchiveProps {
  invoices: Invoice[];
  onCreate: () => void;
  onPreview: (invoice: Invoice) => void;
  onEdit: (invoice: Invoice) => void;
  onShare: (invoice: Invoice) => void;
  onDownloadPdf: (invoice: Invoice) => void;
  onDownloadSelectedCsv: (invoices: Invoice[]) => void;
  onExportArchiveCsv: () => void;
  onDeleteSelected: (invoices: Invoice[]) => void;
}

const inputClass =
  "min-h-12 w-full rounded-[12px] border border-line bg-card px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand-soft";

const labelClass = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted";

const actionButtonClass =
  "min-h-11 rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-line disabled:hover:shadow-sm";

const statusStyles: Record<Invoice["status"], string> = {
  borrador: "bg-brand-soft text-brand-deep",
  enviada: "bg-[#ebe4f6] text-brand",
  pagada: "bg-gold-soft text-[#806128]",
};

export function InvoiceArchive({
  invoices,
  onCreate,
  onPreview,
  onEdit,
  onShare,
  onDownloadPdf,
  onDownloadSelectedCsv,
  onExportArchiveCsv,
  onDeleteSelected,
}: InvoiceArchiveProps) {
  const { t } = useInvoiceI18n();
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredInvoices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return invoices
      .filter((invoice) => {
        const searchText = [
          invoice.invoiceNumber,
          invoice.client.name,
          invoice.client.taxId,
          formatInvoiceDate(invoice.date, getInvoiceDateFormat(invoice)),
          invoice.date,
        ]
          .join(" ")
          .toLowerCase();
        const matchesQuery = normalizedQuery ? searchText.includes(normalizedQuery) : true;
        const matchesDate = date ? invoice.date === date : true;
        const matchesFrom = fromDate ? invoice.date >= fromDate : true;
        const matchesTo = toDate ? invoice.date <= toDate : true;
        return matchesQuery && matchesDate && matchesFrom && matchesTo;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [date, fromDate, invoices, query, toDate]);

  useEffect(() => {
    const availableIds = new Set(invoices.map((invoice) => invoice.id));
    setSelectedIds((current) => current.filter((id) => availableIds.has(id)));
  }, [invoices]);

  const selectedInvoices = useMemo(
    () => selectedIds.map((id) => invoices.find((invoice) => invoice.id === id)).filter((invoice): invoice is Invoice => Boolean(invoice)),
    [invoices, selectedIds],
  );
  const selectedInvoice = selectedInvoices.length === 1 ? selectedInvoices[0] : null;
  const filteredIds = filteredInvoices.map((invoice) => invoice.id);
  const allVisibleSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.includes(id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((current) => current.filter((id) => !filteredIds.includes(id)));
      return;
    }
    setSelectedIds((current) => Array.from(new Set([...current, ...filteredIds])));
  };

  const toggleInvoice = (invoiceId: string) => {
    setSelectedIds((current) => (current.includes(invoiceId) ? current.filter((id) => id !== invoiceId) : [...current, invoiceId]));
  };

  const statusLabel = (status: Invoice["status"]) => {
    if (status === "borrador") return t("draftStatus");
    if (status === "enviada") return t("sentStatus");
    return t("paidStatus");
  };

  const selectionLabel =
    selectedInvoices.length === 0
      ? t("noInvoicesSelected")
      : selectedInvoices.length === 1
        ? t("oneInvoiceSelected")
        : formatMessage(t("manyInvoicesSelected"), { count: selectedInvoices.length });

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-ink">{t("savedInvoices")}</h2>
          <p className="mt-2 text-lg text-muted">{formatMessage(t("results"), { filtered: filteredInvoices.length, total: invoices.length })}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onExportArchiveCsv}
            className="min-h-12 rounded-[12px] border border-line bg-card px-5 py-3 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
          >
            {t("exportArchiveCsv")}
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="min-h-12 rounded-[12px] bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
          >
            {t("createInvoice")}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="grid gap-2">
            <span className={labelClass}>{t("search")}</span>
            <input className={inputClass} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchPlaceholder")} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("date")}</span>
            <input className={inputClass} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("from")}</span>
            <input className={inputClass} type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("to")}</span>
            <input className={inputClass} type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-brand-soft p-5 shadow-sm">
        <p className="mr-auto font-display text-xl font-extrabold tracking-[-0.03em] text-brand-deep">{selectionLabel}</p>
        <button type="button" className={actionButtonClass} disabled={!selectedInvoice} onClick={() => selectedInvoice && onPreview(selectedInvoice)}>
          {t("view")}
        </button>
        <button type="button" className={actionButtonClass} disabled={!selectedInvoice} onClick={() => selectedInvoice && onEdit(selectedInvoice)}>
          {t("edit")}
        </button>
        <button type="button" className={actionButtonClass} disabled={!selectedInvoice} onClick={() => selectedInvoice && onShare(selectedInvoice)}>
          {t("share")}
        </button>
        <button type="button" className={actionButtonClass} disabled={!selectedInvoice} onClick={() => selectedInvoice && onDownloadPdf(selectedInvoice)}>
          {t("pdf")}
        </button>
        <button
          type="button"
          className={actionButtonClass}
          disabled={selectedInvoices.length === 0}
          onClick={() => onDownloadSelectedCsv(selectedInvoices)}
        >
          {t("csv")}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-[12px] border border-danger/25 bg-card px-5 py-2.5 text-sm font-extrabold text-danger shadow-sm transition hover:-translate-y-px hover:border-danger hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-danger/25 disabled:hover:shadow-sm"
          disabled={selectedInvoices.length === 0}
          onClick={() => onDeleteSelected(selectedInvoices)}
        >
          {t("delete")}
        </button>
      </div>
      <p className="-mt-3 text-sm text-muted">{t("selectionHelp")}</p>

      <div className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1120px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface text-left text-muted">
                <th className="w-16 border-b border-line px-6 py-4">
                  <label className="flex items-center">
                    <span className="sr-only">{t("selectAllInvoices")}</span>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      className="h-[18px] w-[18px] rounded border-line accent-brand"
                    />
                  </label>
                </th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("invoiceNumber")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("client")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("date")}</th>
                <th className="border-b border-line px-4 py-4 text-right text-[11px] font-extrabold uppercase tracking-[0.14em]">
                  {t("grossTotal")}
                </th>
                <th className="border-b border-line px-4 py-4 text-right text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("tax")}</th>
                <th className="border-b border-line px-4 py-4 text-right text-[11px] font-extrabold uppercase tracking-[0.14em]">
                  {t("netTotal")}
                </th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const totals = calculateTotals(invoice);
                const currencySymbol = getInvoiceCurrencySymbol(invoice);
                const dateFormat = getInvoiceDateFormat(invoice);
                const isSelected = selectedIds.includes(invoice.id);
                return (
                  <tr key={invoice.id} className={isSelected ? "bg-brand-soft align-top" : "align-top transition hover:bg-surface"}>
                    <td className="border-b border-line px-6 py-5">
                      <label className="flex items-center">
                        <span className="sr-only">{formatMessage(t("selectInvoice"), { number: invoice.invoiceNumber })}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleInvoice(invoice.id)}
                          className="h-[18px] w-[18px] rounded border-line accent-brand"
                        />
                      </label>
                    </td>
                    <td className="border-b border-line px-4 py-5 font-mono text-lg font-bold text-ink">{invoice.invoiceNumber}</td>
                    <td className="border-b border-line px-4 py-5">
                      <span className="block font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{invoice.client.name}</span>
                      <span className="mt-1 block text-sm text-muted">{invoice.client.taxId}</span>
                    </td>
                    <td className="border-b border-line px-4 py-5 text-base text-ink">{formatInvoiceDate(invoice.date, dateFormat)}</td>
                    <td className="border-b border-line px-4 py-5 text-right font-mono text-base font-bold text-ink">
                      {formatCurrency(totals.totalBruto, currencySymbol)}
                    </td>
                    <td className="border-b border-line px-4 py-5 text-right font-mono text-base text-ink">
                      {formatCurrency(totals.irpf, currencySymbol)}
                    </td>
                    <td className="border-b border-line px-4 py-5 text-right font-mono text-lg font-bold text-brand-deep">
                      {formatCurrency(totals.totalNeto, currencySymbol)}
                    </td>
                    <td className="border-b border-line px-4 py-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${statusStyles[invoice.status]}`}>
                        {statusLabel(invoice.status)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredInvoices.length === 0 ? <div className="p-10 text-center text-sm font-bold text-muted">{t("noInvoicesFound")}</div> : null}
      </div>
    </section>
  );
}

```

## src/components/invoices/InvoiceForm.tsx

```tsx
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import type { InvoiceClient } from "../../types/client";
import type { Invoice, InvoiceParty, InvoiceStatus, ServiceLine } from "../../types/invoice";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency, parseNumberInput } from "../../utils/invoiceMath";
import {
  getInvoiceCurrencySymbol,
  getInvoiceRegionConfig,
  getInvoiceTaxIdLabel,
  getInvoiceTaxLabel,
  invoiceRegionConfigs,
  invoiceRegionOptions,
} from "../../utils/invoiceRegion";
import { createEmptyLine } from "../../utils/invoiceStorage";
import { Dropdown } from "../ui/Dropdown";

export type InvoiceErrors = Record<string, string>;

interface InvoiceFormProps {
  invoice: Invoice;
  errors: InvoiceErrors;
  mode: "create" | "edit";
  clients?: InvoiceClient[];
  onChange: (invoice: Invoice) => void;
  onSubmit: (invoice: Invoice) => void;
  onCancel: () => void;
  onSaveClient?: (client: InvoiceParty) => void | Promise<void>;
}

const inputClass =
  "min-h-11 w-full rounded-[12px] border border-line bg-card px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand-soft disabled:cursor-not-allowed disabled:bg-brand-soft/55 disabled:text-muted";

const labelClass = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted";

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <span className={labelClass}>{label}</span>
      {children}
      {error ? <span className="text-xs font-bold text-danger">{error}</span> : null}
    </div>
  );
}

export function InvoiceForm({
  invoice,
  errors,
  mode,
  clients = [],
  onChange,
  onSubmit,
  onCancel,
  onSaveClient,
}: InvoiceFormProps) {
  const { t } = useInvoiceI18n();
  const totals = calculateTotals(invoice);
  const regionConfig = getInvoiceRegionConfig(invoice.issuer);
  const taxLabel = getInvoiceTaxLabel(invoice);
  const taxIdLabel = getInvoiceTaxIdLabel(invoice);
  const currencySymbol = getInvoiceCurrencySymbol(invoice);

  const updateInvoice = (patch: Partial<Invoice>) => onChange({ ...invoice, ...patch });

  const updateIssuer = (field: keyof InvoiceParty, value: string) => {
    onChange({ ...invoice, issuer: { ...invoice.issuer, [field]: value } });
  };

  const updateRegion = (region: InvoiceParty["region"]) => {
    if (!region) return;
    const nextConfig = invoiceRegionConfigs[region];
    onChange({
      ...invoice,
      issuer: {
        ...invoice.issuer,
        region,
        currencySymbol: nextConfig.currencyEditable ? invoice.issuer.currencySymbol ?? "" : nextConfig.defaultCurrencySymbol,
      },
    });
  };

  const updateClient = (field: keyof InvoiceParty, value: string) => {
    onChange({ ...invoice, client: { ...invoice.client, [field]: value } });
  };

  const applySavedClient = (clientId: string) => {
    const savedClient = clients.find((client) => client.id === clientId);
    if (!savedClient) return;
    onChange({
      ...invoice,
      client: {
        ...invoice.client,
        name: savedClient.name,
        taxId: savedClient.taxId,
        address: savedClient.address,
        cityPostal: savedClient.cityPostal,
        email: savedClient.email,
      },
    });
  };

  const updateLine = (lineId: string, patch: Partial<ServiceLine>) => {
    onChange({
      ...invoice,
      lines: invoice.lines.map((line) => (line.id === lineId ? { ...line, ...patch } : line)),
    });
  };

  const addLine = () => {
    onChange({ ...invoice, lines: [...invoice.lines, createEmptyLine()] });
  };

  const removeLine = (lineId: string) => {
    onChange({ ...invoice, lines: invoice.lines.filter((line) => line.id !== lineId) });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(invoice);
  };

  const handleIrpfChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateInvoice({ irpfRate: parseNumberInput(event.target.value) });
  };

  const statusOptions = [
    { value: "borrador", label: t("draftStatus") },
    { value: "enviada", label: t("sentStatus") },
    { value: "pagada", label: t("paidStatus") },
  ];

  const regionOptions = invoiceRegionOptions.map((option) => ({
    value: option.id,
    label: t(option.labelKey),
    description: option.taxLabel,
  }));

  const clientOptions = [
    { value: "", label: t("selectSavedClient") },
    ...clients.map((client) => ({
      value: client.id,
      label: client.name,
      description: client.taxId,
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <section className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-gold">{t("invoiceData")}</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.04em] text-ink">
              {mode === "create" ? t("createInvoice") : t("editInvoice")}
            </h2>
            <p className="mt-2 text-lg text-muted">{t("invoiceFormHelp")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-12 rounded-[12px] border border-line bg-card px-5 py-3 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="min-h-12 rounded-[12px] bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
            >
              {t("saveInvoice")}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-card p-5 shadow-sm">
        <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{t("invoiceData")}</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label={t("invoiceNumber")} error={errors.invoiceNumber}>
            <input
              className={inputClass}
              value={invoice.invoiceNumber}
              onChange={(event) => updateInvoice({ invoiceNumber: event.target.value })}
              aria-invalid={Boolean(errors.invoiceNumber)}
            />
          </Field>
          <Field label={t("date")} error={errors.date}>
            <input
              className={inputClass}
              type="date"
              value={invoice.date}
              onChange={(event) => updateInvoice({ date: event.target.value })}
              aria-invalid={Boolean(errors.date)}
            />
          </Field>
          <Field label={`${taxLabel} (%)`} error={errors.irpfRate}>
            <input
              className={inputClass}
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={Number.isFinite(invoice.irpfRate) ? invoice.irpfRate : ""}
              onChange={handleIrpfChange}
              aria-invalid={Boolean(errors.irpfRate)}
            />
          </Field>
          <Field label={t("status")}>
            <Dropdown value={invoice.status} options={statusOptions} onChange={(value) => updateInvoice({ status: value as InvoiceStatus })} />
          </Field>
          <Field label={t("billingRegion")}>
            <Dropdown value={regionConfig.id} options={regionOptions} onChange={(value) => updateRegion(value as InvoiceParty["region"])} />
          </Field>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Field label={t("currencySymbol")}>
            <input
              className={inputClass}
              value={invoice.issuer.currencySymbol ?? currencySymbol}
              onChange={(event) => updateIssuer("currencySymbol", event.target.value)}
              disabled={!regionConfig.currencyEditable}
              placeholder={regionConfig.currencyEditable ? "$" : regionConfig.defaultCurrencySymbol}
            />
          </Field>
        </div>
        <div className="mt-5">
          <Field label={t("period")}>
            <textarea
              className={`${inputClass} min-h-28 resize-y`}
              value={invoice.period}
              onChange={(event) => updateInvoice({ period: event.target.value })}
            />
          </Field>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-card p-5 shadow-sm">
          <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{t("issuerData")}</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label={t("fullName")}>
              <input className={inputClass} value={invoice.issuer.name} onChange={(event) => updateIssuer("name", event.target.value)} />
            </Field>
            <Field label={taxIdLabel}>
              <input className={inputClass} value={invoice.issuer.taxId} onChange={(event) => updateIssuer("taxId", event.target.value)} />
            </Field>
            <Field label={t("address")}>
              <input className={inputClass} value={invoice.issuer.address} onChange={(event) => updateIssuer("address", event.target.value)} />
            </Field>
            <Field label={t("cityPostal")}>
              <input
                className={inputClass}
                value={invoice.issuer.cityPostal}
                onChange={(event) => updateIssuer("cityPostal", event.target.value)}
              />
            </Field>
            <Field label={t("email")}>
              <input className={inputClass} type="email" value={invoice.issuer.email ?? ""} onChange={(event) => updateIssuer("email", event.target.value)} />
            </Field>
            <Field label={t("bankAccount")}>
              <input className={inputClass} value={invoice.issuer.iban ?? ""} onChange={(event) => updateIssuer("iban", event.target.value)} />
            </Field>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{t("clientData")}</h3>
            {onSaveClient ? (
              <button
                type="button"
                onClick={() => void onSaveClient(invoice.client)}
                disabled={!invoice.client.name.trim()}
                className="min-h-10 rounded-[11px] border border-line bg-card px-4 py-2 text-xs font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {t("saveAsClient")}
              </button>
            ) : null}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {clients.length > 0 ? (
              <div className="sm:col-span-2">
                <Field label={t("savedClient")}>
                  <Dropdown value="" options={clientOptions} placeholder={t("selectSavedClient")} onChange={applySavedClient} />
                </Field>
              </div>
            ) : null}
            <Field label={t("clientName")} error={errors.clientName}>
              <input
                className={inputClass}
                value={invoice.client.name}
                onChange={(event) => updateClient("name", event.target.value)}
                aria-invalid={Boolean(errors.clientName)}
              />
            </Field>
            <Field label={taxIdLabel}>
              <input className={inputClass} value={invoice.client.taxId} onChange={(event) => updateClient("taxId", event.target.value)} />
            </Field>
            <Field label={t("address")}>
              <input className={inputClass} value={invoice.client.address} onChange={(event) => updateClient("address", event.target.value)} />
            </Field>
            <Field label={t("cityPostal")}>
              <input
                className={inputClass}
                value={invoice.client.cityPostal}
                onChange={(event) => updateClient("cityPostal", event.target.value)}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{t("serviceLines")}</h3>
            {errors.lines ? <p className="mt-1 text-xs font-bold text-danger">{errors.lines}</p> : null}
          </div>
          <button
            type="button"
            onClick={addLine}
            className="min-h-11 rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
          >
            {t("addLine")}
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[860px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface text-left text-muted">
                <th className="border border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("description")}</th>
                <th className="border border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("daysDates")}</th>
                <th className="border border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("hours")}</th>
                <th className="border border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("amount")}</th>
                <th className="w-32 border border-line px-3 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((line) => (
                <tr key={line.id}>
                  <td className="border border-line p-2 align-top">
                    <input className={inputClass} value={line.description} onChange={(event) => updateLine(line.id, { description: event.target.value })} />
                  </td>
                  <td className="border border-line p-2 align-top">
                    <input className={inputClass} value={line.dates} onChange={(event) => updateLine(line.id, { dates: event.target.value })} />
                  </td>
                  <td className="border border-line p-2 align-top">
                    <input className={inputClass} value={line.hours ?? ""} onChange={(event) => updateLine(line.id, { hours: event.target.value })} />
                  </td>
                  <td className="border border-line p-2 align-top">
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      step="0.01"
                      value={Number.isFinite(line.amount) ? line.amount : ""}
                      onChange={(event) => updateLine(line.id, { amount: parseNumberInput(event.target.value) })}
                      aria-invalid={Boolean(errors[`line.${line.id}.amount`])}
                    />
                    {errors[`line.${line.id}.amount`] ? (
                      <span className="mt-1 block text-xs font-bold text-danger">{errors[`line.${line.id}.amount`]}</span>
                    ) : null}
                  </td>
                  <td className="border border-line p-2 align-top">
                    <button
                      type="button"
                      onClick={() => removeLine(line.id)}
                      disabled={invoice.lines.length === 1}
                      className="min-h-11 w-full rounded-[12px] border border-danger/25 bg-card px-3 py-2 text-sm font-extrabold text-danger transition hover:-translate-y-px hover:border-danger hover:shadow-sm disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {t("remove")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-3 rounded-lg border border-line bg-card p-5 shadow-sm sm:grid-cols-3">
        <div>
          <p className={labelClass}>{t("grossTotal")}</p>
          <p className="mt-2 font-mono text-3xl font-bold tracking-[-0.04em] text-ink">{formatCurrency(totals.totalBruto, currencySymbol)}</p>
        </div>
        <div>
          <p className={labelClass}>
            {taxLabel} {Number.isFinite(invoice.irpfRate) ? invoice.irpfRate : 0}%
          </p>
          <p className="mt-2 font-mono text-3xl font-bold tracking-[-0.04em] text-ink">{formatCurrency(totals.irpf, currencySymbol)}</p>
        </div>
        <div className="rounded-[14px] bg-ink p-4 text-white">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white/60">{t("netTotal")}</p>
          <p className="mt-2 font-mono text-3xl font-bold tracking-[-0.04em]">{formatCurrency(totals.totalNeto, currencySymbol)}</p>
        </div>
      </section>
    </form>
  );
}

```

## src/components/invoices/InvoicePreview.tsx

```tsx
import type { Invoice } from "../../types/invoice";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { calculateTotals, formatCurrency, formatInvoiceDate } from "../../utils/invoiceMath";
import { getInvoiceCurrencySymbol, getInvoiceDateFormat, getInvoiceTaxIdLabel, getInvoiceTaxLabel } from "../../utils/invoiceRegion";

interface InvoicePreviewProps {
  invoice: Invoice;
  readOnly?: boolean;
  onEdit?: (invoice: Invoice) => void;
  onShare?: (invoice: Invoice) => void;
  onDownloadPdf?: (invoice: Invoice) => void;
  onDownloadCsv?: (invoice: Invoice) => void;
}

const ActionButton = ({
  children,
  onClick,
  variant = "secondary",
}: {
  children: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) => (
  <button
    type="button"
    onClick={onClick}
    className={
      variant === "primary"
        ? "inline-flex min-h-11 items-center justify-center rounded-[12px] bg-brand px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
        : "inline-flex min-h-11 items-center justify-center rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
    }
  >
    {children}
  </button>
);

export function InvoicePreview({
  invoice,
  readOnly = false,
  onEdit,
  onShare,
  onDownloadPdf,
  onDownloadCsv,
}: InvoicePreviewProps) {
  const { t } = useInvoiceI18n();
  const totals = calculateTotals(invoice);
  const currencySymbol = getInvoiceCurrencySymbol(invoice);
  const dateFormat = getInvoiceDateFormat(invoice);
  const taxLabel = getInvoiceTaxLabel(invoice);
  const taxIdLabel = getInvoiceTaxIdLabel(invoice);
  const statusLabel =
    invoice.status === "borrador" ? t("draftStatus") : invoice.status === "enviada" ? t("sentStatus") : t("paidStatus");

  return (
    <section className="grid gap-4">
      {!readOnly ? (
        <div className="no-print flex flex-wrap items-center justify-end gap-3">
          {onEdit ? <ActionButton onClick={() => onEdit(invoice)}>{t("edit")}</ActionButton> : null}
          {onShare ? <ActionButton onClick={() => onShare(invoice)}>{t("share")}</ActionButton> : null}
          {onDownloadCsv ? <ActionButton onClick={() => onDownloadCsv(invoice)}>{t("csv")}</ActionButton> : null}
          {onDownloadPdf ? (
            <ActionButton onClick={() => onDownloadPdf(invoice)} variant="primary">
              {t("pdf")}
            </ActionButton>
          ) : null}
        </div>
      ) : null}

      <article className="invoice-sheet mx-auto w-full max-w-5xl overflow-hidden rounded-lg border border-line bg-card shadow-md">
        <div className="invoice-print-band bg-brand px-6 py-5 text-white sm:px-8">
          <p className="font-display text-2xl font-extrabold uppercase tracking-[-0.02em]">INVOICE</p>
        </div>

        <div className="p-6 sm:p-8">
          <header className="grid gap-6 border-b border-ink pb-7 sm:grid-cols-[1fr_auto]">
            <div>
              <h1 className="font-display text-5xl font-extrabold uppercase leading-none tracking-[-0.05em] text-ink">{t("invoice")}</h1>
              <div className="mt-6 text-sm leading-6 text-ink">
                <p className="font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{invoice.issuer.name}</p>
                <p>
                  <span className="font-bold text-muted">{taxIdLabel}: </span>
                  {invoice.issuer.taxId}
                </p>
                <p>{invoice.issuer.address}</p>
                <p>{invoice.issuer.cityPostal}</p>
                {invoice.issuer.email ? <p>{invoice.issuer.email}</p> : null}
              </div>
            </div>

            <dl className="grid content-start gap-4 rounded-[14px] bg-surface p-5 text-sm sm:min-w-60">
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{t("invoiceNumber")}</dt>
                <dd className="mt-1 font-mono text-lg font-bold text-ink">{invoice.invoiceNumber}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{t("date")}</dt>
                <dd className="mt-1 font-mono text-lg font-bold text-ink">{formatInvoiceDate(invoice.date, dateFormat)}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{t("status")}</dt>
                <dd className="mt-1 font-bold text-brand-deep">{statusLabel}</dd>
              </div>
            </dl>
          </header>

          <section className="grid gap-5 py-7 text-sm leading-6 text-ink md:grid-cols-[1fr_1fr]">
            <div className="rounded-[14px] bg-brand-soft p-5">
              <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-deep">{t("client")}</p>
              <p className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{invoice.client.name}</p>
              <p>
                <span className="font-bold text-muted">{taxIdLabel}: </span>
                {invoice.client.taxId}
              </p>
              <p>{invoice.client.address}</p>
              <p>{invoice.client.cityPostal}</p>
            </div>

            <div className="grid content-start gap-4 rounded-[14px] border border-line bg-card p-5">
              <div>
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{t("bankAccountLabel")}</p>
                <p className="font-mono font-bold text-ink">{invoice.issuer.iban}</p>
              </div>
              <div>
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">{t("periodLabel")}</p>
                <p>{invoice.period}</p>
              </div>
            </div>
          </section>

          <div className="overflow-hidden rounded-[14px] border border-line">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-brand-soft text-left text-brand-deep">
                    <th className="border-b border-line px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("serviceProvided")}</th>
                    <th className="border-b border-line px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("daysDates")}</th>
                    <th className="border-b border-line px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("hours")}</th>
                    <th className="border-b border-line px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("amount")}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="border-b border-line px-4 py-3 font-bold text-ink">{line.description}</td>
                      <td className="border-b border-line px-4 py-3 text-ink">{line.dates}</td>
                      <td className="border-b border-line px-4 py-3 text-right text-ink">{line.hours}</td>
                      <td className="border-b border-line px-4 py-3 text-right font-mono font-bold text-ink">
                        {formatCurrency(line.amount, currencySymbol)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <section className="ml-auto mt-7 w-full max-w-sm overflow-hidden rounded-[14px] border border-line text-sm shadow-sm">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-bold text-muted">{t("grossTotal")}</span>
              <strong className="font-mono text-ink">{formatCurrency(totals.totalBruto, currencySymbol)}</strong>
            </div>
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-bold text-muted">
                {taxLabel} {invoice.irpfRate}%
              </span>
              <strong className="font-mono text-ink">{formatCurrency(totals.irpf, currencySymbol)}</strong>
            </div>
            <div className="bg-app-strong flex items-center justify-between px-5 py-4 text-white">
              <span className="font-display text-lg font-extrabold tracking-[-0.03em]">{t("netTotal")}</span>
              <strong className="font-mono text-lg font-bold">{formatCurrency(totals.totalNeto, currencySymbol)}</strong>
            </div>
          </section>
        </div>
      </article>
    </section>
  );
}

```

## src/components/invoices/ClientsView.tsx

```tsx
import { useEffect, useState, type FormEvent } from "react";
import type { InvoiceClient } from "../../types/client";
import { formatMessage, useInvoiceI18n } from "../../i18n/invoiceI18n";
import { generateId } from "../../utils/invoiceStorage";
import { ConfirmModal } from "../ui/ConfirmModal";

interface ClientsViewProps {
  clients: InvoiceClient[];
  userId: string;
  onSave: (client: InvoiceClient) => void | Promise<void>;
  onDelete: (client: InvoiceClient) => void | Promise<void>;
}

const inputClass =
  "min-h-11 w-full rounded-[12px] border border-line bg-card px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted/65 focus:border-brand focus:ring-4 focus:ring-brand-soft";

const labelClass = "text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted";

const emptyClient = (userId: string): InvoiceClient => {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    userId,
    name: "",
    taxId: "",
    address: "",
    cityPostal: "",
    email: "",
    createdAt: now,
    updatedAt: now,
  };
};

export function ClientsView({ clients, userId, onSave, onDelete }: ClientsViewProps) {
  const { t } = useInvoiceI18n();
  const [draft, setDraft] = useState<InvoiceClient>(() => emptyClient(userId));
  const [isEditing, setIsEditing] = useState(false);
  const [clientPendingDelete, setClientPendingDelete] = useState<InvoiceClient | null>(null);

  useEffect(() => {
    setDraft(emptyClient(userId));
    setIsEditing(false);
  }, [userId]);

  const updateDraft = (field: keyof InvoiceClient, value: string) => {
    setDraft((current) => ({ ...current, [field]: value, updatedAt: new Date().toISOString() }));
  };

  const startNew = () => {
    setDraft(emptyClient(userId));
    setIsEditing(false);
  };

  const startEdit = (client: InvoiceClient) => {
    setDraft({ ...client });
    setIsEditing(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.name.trim()) return;
    await onSave({ ...draft, name: draft.name.trim() });
    startNew();
  };

  const confirmDelete = async () => {
    if (!clientPendingDelete) return;
    await onDelete(clientPendingDelete);
    if (draft.id === clientPendingDelete.id) startNew();
    setClientPendingDelete(null);
  };

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-ink">{t("savedClients")}</h2>
          <p className="mt-2 text-lg text-muted">{t("clientsDescription")}</p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="min-h-12 rounded-[12px] bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
        >
          {t("newClient")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-card p-5 shadow-sm">
        <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-ink">{isEditing ? t("editClient") : t("newClient")}</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <label className="grid gap-2">
            <span className={labelClass}>{t("clientName")}</span>
            <input className={inputClass} value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("taxId")}</span>
            <input className={inputClass} value={draft.taxId} onChange={(event) => updateDraft("taxId", event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("address")}</span>
            <input className={inputClass} value={draft.address} onChange={(event) => updateDraft("address", event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("cityPostal")}</span>
            <input className={inputClass} value={draft.cityPostal} onChange={(event) => updateDraft("cityPostal", event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className={labelClass}>{t("email")}</span>
            <input className={inputClass} type="email" value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} />
          </label>
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={startNew}
            className="min-h-11 rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            className="min-h-11 rounded-[12px] bg-brand px-6 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
          >
            {t("saveClient")}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface text-left text-muted">
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("clientName")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("taxId")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("address")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("cityPostal")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("email")}</th>
                <th className="border-b border-line px-4 py-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="align-top transition hover:bg-surface">
                  <td className="border-b border-line px-4 py-5 font-display text-lg font-extrabold tracking-[-0.03em] text-ink">{client.name}</td>
                  <td className="border-b border-line px-4 py-5 text-muted">{client.taxId}</td>
                  <td className="border-b border-line px-4 py-5 text-muted">{client.address}</td>
                  <td className="border-b border-line px-4 py-5 text-muted">{client.cityPostal}</td>
                  <td className="border-b border-line px-4 py-5 text-muted">{client.email}</td>
                  <td className="border-b border-line px-4 py-5">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(client)}
                        className="min-h-10 rounded-[11px] border border-line bg-card px-4 py-2 text-xs font-extrabold text-ink shadow-sm transition hover:-translate-y-px hover:border-brand hover:shadow-md"
                      >
                        {t("edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setClientPendingDelete(client)}
                        className="min-h-10 rounded-[11px] border border-danger/25 bg-card px-4 py-2 text-xs font-extrabold text-danger shadow-sm transition hover:-translate-y-px hover:border-danger hover:shadow-md"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {clients.length === 0 ? <div className="p-10 text-center text-sm font-bold text-muted">{t("noClientsSaved")}</div> : null}
      </div>

      {clientPendingDelete ? (
        <ConfirmModal
          title={t("deleteClientTitle")}
          message={formatMessage(t("deleteClientMessage"), { name: clientPendingDelete.name })}
          confirmLabel={t("confirmDelete")}
          cancelLabel={t("cancel")}
          onConfirm={() => void confirmDelete()}
          onCancel={() => setClientPendingDelete(null)}
        />
      ) : null}
    </section>
  );
}

```

## src/components/invoices/ShareModal.tsx

```tsx
import { useEffect, useState } from "react";
import { useInvoiceI18n } from "../../i18n/invoiceI18n";
import { copyText } from "../../utils/invoiceShare";

interface ShareModalProps {
  link: string;
  onClose: () => void;
}

export function ShareModal({ link, onClose }: ShareModalProps) {
  const { t } = useInvoiceI18n();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    await copyText(link);
    setCopied(true);
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-5 py-6 backdrop-blur-[2px] animate-[modalFade_200ms_ease-out]">
      <section className="w-full max-w-[560px] rounded-[18px] border border-line bg-card p-7 shadow-lg animate-[modalIn_200ms_ease-out]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink">{t("shareInvoice")}</h2>
            <p className="mt-1 text-sm leading-6 text-muted">{t("shareInvoiceHelp")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("close")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-line bg-card text-2xl font-medium leading-none text-muted transition hover:-translate-y-px hover:border-brand hover:text-ink hover:shadow-md"
          >
            x
          </button>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="sr-only" htmlFor="share-link">
            {t("shareLink")}
          </label>
          <input
            id="share-link"
            className="min-h-12 w-full rounded-[12px] border border-line bg-surface px-4 py-3 font-mono text-sm text-muted outline-none focus:border-brand focus:ring-4 focus:ring-brand-soft"
            value={link}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
          />
          <button
            type="button"
            onClick={handleCopy}
            className={
              copied
                ? "min-h-12 rounded-[12px] bg-positive px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md"
                : "min-h-12 rounded-[12px] bg-brand px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:bg-brand-deep hover:shadow-md"
            }
          >
            {copied ? t("copied") : t("copy")}
          </button>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-[12px] border border-line bg-card px-5 py-2.5 text-sm font-extrabold text-ink transition hover:-translate-y-px hover:border-brand hover:shadow-md"
          >
            {t("close")}
          </button>
        </div>
      </section>
    </div>
  );
}

```
