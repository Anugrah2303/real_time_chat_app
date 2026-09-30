import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
    {icon && <div className="mb-1 text-ink-300">{icon}</div>}
    <h3 className="text-lg font-semibold text-ink-800">{title}</h3>
    {description && <p className="max-w-sm text-sm text-ink-400">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default EmptyState;
