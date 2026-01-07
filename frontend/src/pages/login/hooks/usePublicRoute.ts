import { useGetSessionQuery } from "../../../store/api/authApiSlice";

export const usePublicRoute = (customRedirectPath = "/dashboard") => {
  const { data: session, isLoading } = useGetSessionQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const isAuthenticated = Boolean(session);
  const redirectPath = customRedirectPath;

  return {
    isLoading,
    isAuthenticated,
    redirectPath,
  };
};
