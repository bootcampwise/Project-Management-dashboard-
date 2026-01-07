import { Navigate, Outlet } from "react-router-dom";
import { FullScreenLoader } from "../ui/FullScreenLoader";
import { usePrivateRoute } from "../../pages/login/hooks/usePrivateRoute";

export function PrivateRoute() {
  const { isLoading, isAuthenticated, redirectPath, redirectState } =
    usePrivateRoute();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace state={redirectState} />;
  }

  return <Outlet />;
}

export default PrivateRoute;
