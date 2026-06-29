import { useLanguage } from "../hooks/useLanguage";
import type { Client } from "../types/client";

interface ClientsPanelProps {
  clients: Client[];
}

export function ClientsPanel({ clients }: ClientsPanelProps) {
  const { t } = useLanguage();

  return (
    <section className="rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-soft">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <span className="w-fit rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand">
            {t("clientsSection")}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-ink">{t("clientsSection")}</h2>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-3 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{t("totalClients")}</p>
          <p className="mt-1 text-2xl font-bold text-ink">{clients.length}</p>
        </div>
      </div>

      {clients.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => (
            <article key={client.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-lg font-bold text-ink">{client.name}</h3>
              <div className="mt-3 grid gap-2 text-sm text-muted">
                {client.company ? <p>{client.company}</p> : null}
                {client.email ? <p>{client.email}</p> : null}
                {client.phone ? <p>{client.phone}</p> : null}
                {client.notes ? <p className="text-slate-600">{client.notes}</p> : null}
              </div>
              {client.chatLink ? (
                <a
                  href={client.chatLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-2xl border border-line px-3 py-2 text-sm font-semibold text-ink"
                >
                  {t("openChat")}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-line bg-white/60 px-5 py-10 text-center text-sm text-muted">
          {t("noClients")}
        </div>
      )}
    </section>
  );
}
