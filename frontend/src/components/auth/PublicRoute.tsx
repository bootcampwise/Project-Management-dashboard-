import { Navigate } from "react-router-dom";
import { FullScreenLoader } from "../ui/FullScreenLoader";
import { usePublicRoute } from "../../pages/login/hooks/usePublicRoute";

export function PublicRoute({
  children,
  redirectPath,
}: {
  children: React.ReactNode;
  redirectPath?: string;
}) {
  const {
    isLoading,
    isAuthenticated,
    redirectPath: finalRedirectPath,
  } = usePublicRoute(redirectPath);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={finalRedirectPath} replace />;
  }

  return <>{children}</>;
}

export default PublicRoute;
