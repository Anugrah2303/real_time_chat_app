import axios from "axios";

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

export const formatDate = (value: string | Date) =>
  new Date(value).toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });

export const getErrorMessage = (err: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message || err.message || "Something went wrong";
  }
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong";
};

export const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" })}, ${formatTime(iso)}`;
};

export const formatDateSeparator = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(d, now)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: d.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
};

export const formatLastSeen = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "last seen recently";
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(d, now)) return `last seen today at ${formatTime(iso)}`;
  if (isSameDay(d, yesterday)) return `last seen yesterday at ${formatTime(iso)}`;
  return `last seen ${d.toLocaleDateString([], { day: "numeric", month: "short" })}`;
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const getInitials = (name: string) => {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials || "?";
};
