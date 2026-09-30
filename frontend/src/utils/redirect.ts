export interface LocationState {
  from?: string | { pathname: string; search?: string };
}

export const getRedirectPath = (state: unknown) => {
  const from = (state as LocationState | null)?.from;
  if (!from) return "/";
  if (typeof from === "string") return from;
  return from.pathname + (from.search ?? "");
};
