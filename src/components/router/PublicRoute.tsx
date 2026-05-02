import { Navigate } from "react-router-dom";
import { getAccessToken, isTokenExpired } from "../../lib/auth";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getAccessToken();

  if (token && !isTokenExpired()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}