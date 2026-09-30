import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types";
import Loader from "../ui/Loader";

interface RoleRouteProps {
  allowed: UserRole[];
  children: ReactNode;
}

const RoleRoute = ({ allowed, children }: RoleRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default RoleRoute;
