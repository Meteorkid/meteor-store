"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

type PassStatus = {
  hasPass: boolean;
  currentPlan: string | null;
  expiresAt: string | null;
};

export default function PassStatusCard() {
  const { user } = useAuth();
  const t = useTranslations("PassStatusCard");
  const locale = useLocale();
  const [status, setStatus] = useState<PassStatus | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/pass/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, [user]);

  if (!status?.hasPass) return null;

  const planLabel = status.currentPlan === "monthly" ? t("monthly")
    : status.currentPlan === "annual" ? t("annual")
    : status.currentPlan === "lifetime" ? t("lifetime")
    : "";

  const isLifetime = status.currentPlan === "lifetime";
  const expiryDate = status.expiresAt
    ? new Date(status.expiresAt).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="glass-card mb-8 rounded-3xl p-7 md:p-9 bg-gradient-to-r from-purple-500/5 via-emerald-500/5 to-purple-500/5 border-emerald-500/20">
      <div className="flex flex-wrap items-center gap-4">
        <span aria-hidden className="text-2xl">✨</span>
        <div className="min-w-0 flex-1">
          <p className="t-title-3 text-white">
            Meteor Pass &middot; {planLabel}
          </p>
          <p className="t-footnote mt-1 text-emerald-300/80">
            {isLifetime
              ? t("lifetimeDesc")
              : t("expiresOn", { date: expiryDate ?? "" })}
          </p>
        </div>
        <Link
          href="/pricing"
          className="shrink-0 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-medium text-white/80 transition-colors hover:border-white/25 hover:bg-white/[0.1]"
        >
          {t("manage")}
        </Link>
      </div>
    </div>
  );
}
