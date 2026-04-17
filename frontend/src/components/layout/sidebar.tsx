import { NavLink } from "react-router-dom";
import {
  Briefcase,
  FolderKanban,
  LayoutDashboard,
  BookOpen,
  CreditCard,
  NotebookPen,
  Link as LinkIcon,
  User,
  Settings,
  Sparkles,
} from "lucide-react";

import { cn } from "../../lib/cn";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/job-applications", label: "Job Applications", icon: Briefcase },
  { to: "/learning-resources", label: "Learning Resources", icon: BookOpen },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/notes", label: "Notes", icon: NotebookPen },
  { to: "/saved-links", label: "Saved Links", icon: LinkIcon },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] px-5 py-6 lg:flex lg:flex-col">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-muted)] p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand)]/12 text-[var(--brand)]">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand)]">
              DevVault
            </p>
            <h2 className="text-lg font-bold text-[var(--text)]">
              Career workspace
            </h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
          Track jobs, build projects, and keep your learning momentum visible.
        </p>
      </div>

      <div className="mt-8">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
          Navigation
        </p>

        <nav className="mt-3 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "border-[var(--brand)]/20 bg-[var(--brand)]/10 text-[var(--brand)] shadow-sm"
                      : "border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200",
                        isActive
                          ? "border-[var(--brand)]/20 bg-[var(--brand)]/12 text-[var(--brand)]"
                          : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] group-hover:bg-[var(--surface-muted)] group-hover:text-[var(--text)]",
                      )}
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </span>

                    <span className="flex-1">{link.label}</span>

                    <span
                      className={cn(
                        "text-xs transition-all duration-200",
                        isActive
                          ? "text-[var(--brand)]"
                          : "opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100",
                      )}
                    >
                      →
                    </span>

                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[var(--brand)]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto pt-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 shadow-sm">
          <p className="text-sm font-semibold text-[var(--text)]">
            Stay consistent
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
            Small progress every day compounds faster than motivation.
          </p>
        </div>
      </div>
    </aside>
  );
}
