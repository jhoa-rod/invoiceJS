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
