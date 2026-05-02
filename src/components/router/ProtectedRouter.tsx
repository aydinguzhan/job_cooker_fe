import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken, isTokenExpired } from "../../lib/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getAccessToken();
  const location = useLocation();

  if (!token || isTokenExpired()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}