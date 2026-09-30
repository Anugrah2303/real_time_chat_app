export const getServerUrl = () => {
  const base: string = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return base.replace(/\/api\/?$/, "");
};

export const getFileUrl = (path: string) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return getServerUrl() + path;
};
