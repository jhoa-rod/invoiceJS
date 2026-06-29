import type { User } from "@supabase/supabase-js";
import { useLanguage } from "../hooks/useLanguage";

interface UserMenuProps {
  user: User;
  onSignOut: () => Promise<void>;
}

export function UserMenu({ user, onSignOut }: UserMenuProps) {
  const { t } = useLanguage();
  const name = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "User";
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/85 p-3 shadow-sm">
      {avatar ? (
        <img src={avatar} alt={name} className="h-11 w-11 rounded-2xl object-cover" />
      ) : (
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-200 text-sm font-bold text-slate-700">
          {name.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">{name}</p>
        <p className="truncate text-xs text-muted">{user.email}</p>
      </div>
      <button
        type="button"
        onClick={onSignOut}
        className="rounded-xl border border-line px-3 py-2 text-xs font-bold text-ink transition hover:-translate-y-0.5"
      >
        {t("signOut")}
      </button>
    </div>
  );
}
