"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, clearSession, type SessionData } from "@/app/lib/api";
import LiveClock from "@/app/components/LiveClock";
import { getOrders, markOrderCompleted, type Order } from "@/app/lib/orders";

const quickLinks = [
  { label: "Beranda",    href: "/",           icon: "🌐" },
  { label: "Projects",  href: "/projects",   icon: "📁" },
  { label: "Pencapaian",href: "/experience", icon: "🏆" },
  { label: "Tools",     href: "/tools",      icon: "🛠" },
  { label: "About",     href: "/about",      icon: "👤" },
  { label: "Contact",   href: "/contact",    icon: "✉️" },
];

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [markId, setMarkId] = useState("");
  const [markMsg, setMarkMsg] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace("/login"); return; }
    setSession(s);
  }, [router]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const handleMarkComplete = () => {
    const id = markId.trim();
    if (!id) return;
    markOrderCompleted(id);
    setOrders(getOrders());
    setMarkMsg(`Order ${id} berhasil ditandai selesai. QRIS sudah aktif untuk user.`);
    setMarkId("");
    setTimeout(() => setMarkMsg(""), 5000);
  };

  if (!session) return null;

  const loginDate = new Date(session.loginAt).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "long",
    timeStyle: "short",
  });

  const stats = [
    { label: "Total Client",  value: "23+", icon: "👥", color: "from-blue-500 to-cyan-400" },
    { label: "Penghargaan",   value: "6",   icon: "🏆", color: "from-amber-500 to-orange-400" },
    { label: "Projects",      value: "0",   icon: "📁", color: "from-violet-500 to-purple-400" },
    { label: "Pesan Masuk",   value: "—",   icon: "📬", color: "from-emerald-500 to-teal-400" },
  ];

  return (
    <div className="min-h-screen px-5 pt-20 pb-24 md:px-12 md:pt-12">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-2xl ring-2 ring-zinc-200 dark:ring-zinc-700 shadow-md">
            <Image src="/logo-devspectra.jpeg" alt="Devspectra" width={56} height={56} className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">Dashboard Admin</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Halo, <span className="font-semibold text-zinc-700 dark:text-zinc-300">{session.name || session.email}</span> 👋
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LiveClock className="text-sm text-zinc-500 dark:text-zinc-400" />
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 transition-all hover:bg-red-100 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar
          </button>
        </div>
      </div>

      {/* Info login */}
      <div className="mb-8 rounded-xl border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 px-4 py-3">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          🔐 Login terakhir: <span className="font-medium">{loginDate} WIB</span>
          {session.role && (
            <span className="ml-3 rounded-full bg-blue-100 dark:bg-blue-900/40 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
              {session.role}
            </span>
          )}
          {session.division && (
            <span className="ml-2 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              {session.division}
            </span>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/40 dark:hover:shadow-black/30"
          >
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-xl shadow-md`}>
              {s.icon}
            </div>
            <div className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">{s.value}</div>
            <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mb-8">
        <h2 className="mb-4 text-base font-bold text-zinc-900 dark:text-zinc-100">Navigasi Cepat</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-4 text-center transition-all hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md"
            >
              <span className="text-2xl">{q.icon}</span>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Info akun */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-6">
        <h2 className="mb-4 text-base font-bold text-zinc-900 dark:text-zinc-100">Info Akun</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: "Email",    value: session.email },
            { label: "Nama",     value: session.name || "—" },
            { label: "Role",     value: session.role || "—" },
            { label: "Divisi",   value: session.division || "—" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="w-20 text-zinc-500 dark:text-zinc-400">{row.label}</span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tandai Proyek Selesai ── */}
      <div className="mt-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-6">
        <h2 className="mb-4 text-base font-bold text-zinc-900 dark:text-zinc-100">📦 Tandai Proyek Selesai</h2>

        <div className="flex gap-3">
          <input
            type="text"
            value={markId}
            onChange={(e) => setMarkId(e.target.value)}
            placeholder="Masukkan Order ID, contoh: DSP-BLM5XPQO"
            className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600"
          />
          <button
            type="button"
            onClick={handleMarkComplete}
            className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500 active:scale-95"
          >
            ✅ Tandai Selesai
          </button>
        </div>

        {markMsg && (
          <div className="mt-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">{markMsg}</p>
          </div>
        )}

        {/* Order list */}
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Semua Order</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Belum ada order tersimpan.</p>
          ) : (
            orders.map((o) => (
              <div
                key={o.orderId}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 px-4 py-3 text-sm"
              >
                <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{o.orderId}</span>
                {o.name && <span className="text-zinc-600 dark:text-zinc-400">{o.name}</span>}
                {o.jasa && <span className="text-zinc-500 dark:text-zinc-500">{o.jasa}</span>}
                <span
                  className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    o.status === "completed"
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                      : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {o.status === "completed" ? "Selesai" : "Pending"}
                </span>
                {o.completedAt && (
                  <span className="w-full text-xs text-zinc-400 dark:text-zinc-500">
                    Selesai: {new Date(o.completedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
