"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/utility/AuthProvider";
import React, { useEffect, useMemo, useState } from "react";
import { LoadingPage } from "@/components/LoadingPage";

/**
 * ProtectedRoute component ensures that only authorized users can access certain routes.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to be rendered if authorized.
 * @param {string[]} [props.roles=[]] - The roles that are allowed to access the route.
 * @returns {React.ReactElement} The rendered component.
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isLoading: isAuthLoading, accessToken, refreshToken } = useAuth();
  const router = useRouter();
  const [authResolved, setAuthResolved] = useState(false);

  // Helper function to check if tokens are valid
  const areTokensValid = () => {
    return !!accessToken && !!refreshToken;
  };

  // Determine if the user is authorized
  const isAuthorized = useMemo(() => {
    if (isAuthLoading) return false;
    if (!areTokensValid()) return false;
    return user && (!roles.length || (user.role && roles.includes(user.role)));
  }, [user, roles, isAuthLoading, accessToken, refreshToken]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!areTokensValid()) {
      router.replace("/login");
      return;
    }

    if (isAuthorized) {
      setAuthResolved(true);
    } else {
      const redirectPath = user ? "/unauthorized" : "/login";
      router.replace(redirectPath);
    }
  }, [isAuthorized, isAuthLoading, router, user, accessToken, refreshToken]);

  if (isAuthLoading || !authResolved) {
    return <LoadingPage />;
  }

  return children;
};

export default ProtectedRoute;
