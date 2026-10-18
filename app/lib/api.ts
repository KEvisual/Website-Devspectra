const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

// ── Auth ──────────────────────────────────────────────────
export async function loginApi(email: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Login gagal");
  return data as {
    token: string;
    type: string;
    email: string;
    name: string;
    role: string;
    division: string;
  };
}

// ── Inquiries ─────────────────────────────────────────────
export async function createInquiry(payload: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const res = await fetch(`${BASE}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Gagal mengirim pesan");
  return data;
}

// ── Testimonials ──────────────────────────────────────────
export async function getTestimonials() {
  const res = await fetch(`${BASE}/api/testimonials`, {
    next: { revalidate: 60 }, // cache 60 detik
  });
  if (!res.ok) return [];
  return res.json() as Promise<
    Array<{
      id: number;
      clientName: string;
      company: string;
      content: string;
      rating: number;
      isActive: boolean;
    }>
  >;
}

export async function createTestimonial(
  payload: { clientName: string; company?: string; content: string; rating: number },
  token: string
) {
  const res = await fetch(`${BASE}/api/testimonials`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan testimoni");
  return data;
}

// ── Session helpers (localStorage) ───────────────────────
export const SESSION_KEY = "devspectra_session";

export type SessionData = {
  token: string;
  email: string;
  name: string;
  role: string;
  division: string;
  loginAt: string;
};

export function getSession(): SessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionData) : null;
  } catch { return null; }
}

export function saveSession(data: Omit<SessionData, "loginAt">) {
  const session: SessionData = { ...data, loginAt: new Date().toISOString() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
