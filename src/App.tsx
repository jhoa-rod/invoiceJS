import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { EmailLogin } from "./components/invoices/EmailLogin";
import { InvoiceArchive } from "./components/invoices/InvoiceArchive";
import { InvoiceDashboard } from "./components/invoices/InvoiceDashboard";
import { InvoiceForm, type InvoiceErrors } from "./components/invoices/InvoiceForm";
import { InvoicePreview } from "./components/invoices/InvoicePreview";
import { LanguageSelector } from "./components/invoices/LanguageSelector";
import { getDictionary, InvoiceI18nContext, type Language, type TranslationKey } from "./i18n/invoiceI18n";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import type { Invoice } from "./types/invoice";
import { downloadInvoicePdf, exportArchiveCsv, exportInvoiceCsv, type InvoiceExportLabels } from "./utils/invoiceExport";
import { isValidAmount } from "./utils/invoiceMath";
import { buildShareUrl, copyText, readSharedInvoiceFromHash } from "./utils/invoiceShare";
import {
  cloneInvoice,
  createEmptyInvoice,
  deleteInvoice as deleteInvoiceFromDatabase,
  loadInvoices,
  saveInvoice as saveInvoiceToDatabase,
  seedSampleInvoices,
} from "./utils/invoiceStorage";

type AppView = "dashboard" | "form" | "archive" | "preview";

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
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [activeView, setActiveView] = useState<AppView>("dashboard");
  const [draft, setDraft] = useState<Invoice>(() => createEmptyInvoice());
  const [errors, setErrors] = useState<InvoiceErrors>({});
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [toast, setToast] = useState("");
  const [lastShareLink, setLastShareLink] = useState("");
  const showToast = (message: string) => setToast(message);

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
      setSelectedInvoiceId("");
      setInvoiceLoading(false);
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
        if (!isMounted) return;
        setInvoices(nextInvoices);
        setSelectedInvoiceId(nextInvoices[0]?.id ?? "");
        setActiveView("dashboard");
        setLastShareLink("");
        setErrors({});
      } catch (error) {
        if (isMounted) showToast(getErrorMessage(error, t("loadInvoicesError")));
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
    const timeout = window.setTimeout(() => setToast(""), 2800);
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
      showToast(error.message || t("authGenericError"));
      return;
    }

    setInvoices([]);
    setSelectedInvoiceId("");
    setLastShareLink("");
    showToast(t("signedOut"));
  };

  const startCreate = () => {
    const latestIssuer = invoices[0]?.issuer;
    setDraft(createEmptyInvoice(latestIssuer));
    setErrors({});
    setActiveView("form");
  };

  const startEdit = (invoice: Invoice) => {
    setDraft(cloneInvoice(invoice));
    setErrors({});
    setSelectedInvoiceId(invoice.id);
    setActiveView("form");
  };

  const openPreview = (invoice: Invoice) => {
    setSelectedInvoiceId(invoice.id);
    setActiveView("preview");
  };

  const saveInvoice = async (invoice: Invoice) => {
    const userId = session?.user.id;
    if (!userId) {
      showToast(t("authGenericError"));
      return;
    }

    const validationErrors = validateInvoice(invoice, invoices, t);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      showToast(t("reviewRequired"));
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
      setLastShareLink("");
      showToast(t("invoiceSaved"));
    } catch (error) {
      showToast(getErrorMessage(error, t("saveInvoiceError")));
    }
  };

  const deleteInvoice = async (invoice: Invoice) => {
    if (!window.confirm(t("deleteConfirm").replace("{number}", invoice.invoiceNumber))) return;

    try {
      await deleteInvoiceFromDatabase(invoice.id);
      setInvoices((current) => current.filter((item) => item.id !== invoice.id));
      if (selectedInvoiceId === invoice.id) setSelectedInvoiceId("");
      showToast(t("invoiceDeleted"));
    } catch (error) {
      showToast(getErrorMessage(error, t("deleteInvoiceError")));
    }
  };

  const shareInvoice = async (invoice: Invoice) => {
    const link = buildShareUrl(invoice);
    try {
      await copyText(link);
      setLastShareLink(link);
      showToast(t("linkCopied"));
    } catch {
      setLastShareLink(link);
      showToast(t("linkGenerated"));
    }
  };

  let content;

  if (sharedInvoice) {
    content = (
      <div className="min-h-screen bg-app-bg text-app-text">
        <header className="no-print border-b border-app-border bg-app-surface">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase text-app-muted">{t("publicView")}</p>
              <h1 className="text-xl font-black text-app-text">
                {t("invoice")} {sharedInvoice.invoiceNumber}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <LanguageSelector compact />
              <button
                type="button"
                onClick={() => exportInvoiceCsv(sharedInvoice, exportLabels)}
                className="min-h-10 rounded-md border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text hover:border-app-accent hover:bg-app-bg"
              >
                {t("csv")}
              </button>
              <button
                type="button"
                onClick={() => downloadInvoicePdf(sharedInvoice, exportLabels)}
                className="min-h-10 rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white hover:bg-app-accentStrong"
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
      <div className="flex min-h-screen items-center justify-center bg-app-bg px-4 text-app-text">
        <div className="rounded-lg border border-app-border bg-white px-6 py-5 text-sm font-semibold text-app-muted shadow-sm">
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
      <div className="min-h-screen bg-app-bg text-app-text">
        <header className="border-b border-app-border bg-app-surface/95 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-app-border-subtle pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={authSubmitting}
                  className="min-h-10 rounded-md border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text transition hover:border-app-accent hover:bg-app-bg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("logout")}
                </button>
                <LanguageSelector compact />
              </div>
              <p className="text-sm font-semibold text-app-muted">
                {t("session")}: {userEmail}
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase text-app-muted">{t("appEyebrow")}</p>
                <h1 className="text-3xl font-black text-app-text">{t("appTitle")}</h1>
              </div>
              <nav className="flex flex-wrap gap-2" aria-label="Sections">
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
                          ? "min-h-10 rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-app-accentStrong"
                          : "min-h-10 rounded-md border border-app-border bg-white px-4 py-2 text-sm font-semibold text-app-text hover:border-app-accent hover:bg-app-bg"
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

        <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
          {lastShareLink ? (
            <section className="rounded-lg border border-app-border bg-app-soft p-4">
              <label className="grid gap-2 text-sm font-semibold text-app-text">
                {t("shareLink")}
                <input
                  className="min-h-10 w-full rounded-md border border-app-border bg-white px-3 py-2 text-sm text-app-text"
                  value={lastShareLink}
                  readOnly
                  onFocus={(event) => event.currentTarget.select()}
                />
              </label>
            </section>
          ) : null}

          {invoiceLoading ? (
            <section className="rounded-lg border border-app-border-subtle bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-semibold text-app-muted">{t("loading")}</p>
            </section>
          ) : null}

          {!invoiceLoading && activeView === "dashboard" ? (
            <InvoiceDashboard
              invoices={invoices}
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
              onChange={setDraft}
              onSubmit={saveInvoice}
              onCancel={() => setActiveView(selectedInvoice ? "preview" : "dashboard")}
            />
          ) : null}

          {!invoiceLoading && activeView === "archive" ? (
            <InvoiceArchive
              invoices={invoices}
              onCreate={startCreate}
              onPreview={openPreview}
              onEdit={startEdit}
              onDelete={deleteInvoice}
              onShare={shareInvoice}
              onDownloadPdf={(invoice) => downloadInvoicePdf(invoice, exportLabels)}
              onDownloadCsv={(invoice) => exportInvoiceCsv(invoice, exportLabels)}
              onExportArchiveCsv={() => exportArchiveCsv(invoices, exportLabels)}
            />
          ) : null}

          {!invoiceLoading && activeView === "preview" ? (
            selectedInvoice ? (
              <InvoicePreview
                invoice={selectedInvoice}
                onEdit={startEdit}
                onShare={shareInvoice}
                onDownloadPdf={(invoice) => downloadInvoicePdf(invoice, exportLabels)}
                onDownloadCsv={(invoice) => exportInvoiceCsv(invoice, exportLabels)}
              />
            ) : (
              <section className="rounded-lg border border-app-border-subtle bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-semibold text-app-muted">{t("noInvoiceSelected")}</p>
                <button
                  type="button"
                  onClick={startCreate}
                  className="mt-4 min-h-10 rounded-md bg-app-accent px-4 py-2 text-sm font-semibold text-white hover:bg-app-accentStrong"
                >
                  {t("createInvoice")}
                </button>
              </section>
            )
          ) : null}
        </main>

        {toast ? (
          <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-md bg-app-strong px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    );
  }

  return <InvoiceI18nContext.Provider value={i18nValue}>{content}</InvoiceI18nContext.Provider>;
}

export default App;
