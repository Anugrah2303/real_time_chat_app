import { Loader2 } from "lucide-react";

const Loader = ({ label = "Loading..." }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-400">
    <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
    <p className="text-sm">{label}</p>
  </div>
);

export default Loader;
