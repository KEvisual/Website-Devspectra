"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginApi, saveSession, getSession } from "@/app/lib/api";

type Tab = "login" | "register";

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden="true">
    {open ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
      </>
    )}
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab]           = useState<Tab>("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (getSession()) router.replace("/admin");
  }, [router]);

  const reset = () => { setError(""); setSuccess(""); };
  const switchTab = (t: Tab) => { setTab(t); reset(); setEmail(""); setPassword(""); setConfirm(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();

    if (!email.trim() || !password.trim()) { setError("Email dan password wajib diisi."); return; }

    if (tab === "register") {
      if (password !== confirm) { setError("Konfirmasi password tidak cocok."); return; }
      if (password.length < 6)  { setError("Password minimal 6 karakter."); return; }
      // Register tidak ada endpoint publik — arahkan ke admin untuk membuat akun
      setError("Pendaftaran admin hanya bisa dilakukan oleh admin. Hubungi tim Devspectra.");
      return;
    }

    // Login via backend
    setLoading(true);
    try {
      const data = await loginApi(email.trim(), password);
      saveSession(data);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-zinc-200 dark:ring-zinc-800 shadow-lg transition-transform duration-300 hover:scale-105">
            <Image src="/logo-devspectra.jpeg" alt="Devspectra" width={64} height={64} className="h-full w-full object-cover" priority />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Devspectra Admin</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {tab === "login" ? "Masuk ke dashboard admin" : "Informasi pendaftaran"}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 shadow-xl shadow-zinc-100/40 dark:shadow-black/40 backdrop-blur-md">

          {/* Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all duration-200
                  ${tab === t
                    ? "border-b-2 border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-300"
                  }`}
              >
                {t === "login" ? "🔑 Login" : "📝 Register"}
              </button>
            ))}
          </div>

          <div className="p-7">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18v12H3zM3 7l9 7 9-7" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@devspectra.id"
                    required
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 py-3 pl-9 pr-4 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-400/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    autoComplete={tab === "login" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={tab === "register" ? "Min. 6 karakter" : "••••••••"}
                    required
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 py-3 pl-9 pr-10 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-400/20"
                  />
                  <button type="button" onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>

              {/* Konfirmasi (register only) */}
              {tab === "register" && (
                <div>
                  <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="confirm"
                      type={showConf ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Ulangi password"
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 py-3 pl-9 pr-10 text-sm text-zinc-900 dark:text-zinc-100 outline-none transition placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-400/20"
                    />
                    <button type="button" onClick={() => setShowConf((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                      <EyeIcon open={showConf} />
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  <span className="flex-shrink-0">⚠️</span> {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                  <span>✅</span> {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-blue-600 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Masuk...
                  </span>
                ) : tab === "login" ? "🔑 Masuk" : "📝 Informasi"}
              </button>

              <p className="mt-1 text-center text-xs text-zinc-400 dark:text-zinc-500">
                {tab === "login"
                  ? <><span>Belum punya akun? </span><button type="button" onClick={() => switchTab("register")} className="text-blue-500 hover:underline">Info register</button></>
                  : <><span>Sudah punya akun? </span><button type="button" onClick={() => switchTab("login")} className="text-blue-500 hover:underline">Login di sini</button></>
                }
              </p>
            </form>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Devspectra Digital Kreasi · Admin Panel · © 2026
        </p>
      </div>
    </div>
  );
}
