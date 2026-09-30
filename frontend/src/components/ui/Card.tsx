import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
}

const Card = ({ children, hoverable = false, className = "", ...rest }: CardProps) => (
  <div
    className={`rounded-2xl border border-ink-100 bg-white shadow-card ${
      hoverable ? "transition-shadow hover:shadow-pop" : ""
    } ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export default Card;
