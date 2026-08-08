// No login/auth in this app — sessions are anonymous on the backend.
// We fake a private "my companies" history entirely client-side: remember
// which session IDs *this browser* created (and their idea text) in
// localStorage, then cross-check that list against GET /api/sessions for
// live status. Nobody else's sessions ever show up in your sidebar, and no
// backend auth work was needed.
const STORAGE_KEY = "dayone:sessions";

interface StoredEntry {
  idea: string;
  createdAt: string;
}

function readMap(): Record<string, StoredEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function cacheSession(sessionId: string, idea: string) {
  if (typeof window === "undefined") return;
  try {
    const map = readMap();
    map[sessionId] = { idea, createdAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // localStorage unavailable (private mode etc.) — non-fatal, the
    // sidebar just won't remember this one.
  }
}

export function knownSessionIds(): string[] {
  return Object.keys(readMap());
}

export function getCachedTitle(sessionId: string): string | null {
  return readMap()[sessionId]?.idea ?? null;
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
