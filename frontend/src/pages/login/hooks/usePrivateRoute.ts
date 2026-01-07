import { useLocation } from "react-router-dom";
import { useGetSessionQuery } from "../../../store/api/authApiSlice";

export const usePrivateRoute = () => {
  const location = useLocation();
  const { data: session, isLoading } = useGetSessionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const isAuthenticated = Boolean(session);
  const redirectPath = "/login";
  const redirectState = { from: location };

  return {
    isLoading,
    isAuthenticated,
    redirectPath,
    redirectState,
  };
};
