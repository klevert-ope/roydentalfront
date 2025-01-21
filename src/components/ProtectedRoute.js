"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/utility/AuthProvider";
import React, { useEffect, useMemo, useState } from "react";
import { LoadingPage } from "@/components/LoadingPage";
import { useCookies } from "next-client-cookies";

/**
 * ProtectedRoute component ensures that only authorized users can access certain routes.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to be rendered if authorized.
 * @param {string[]} [props.roles=[]] - The roles that are allowed to access the route.
 * @returns {React.ReactElement} The rendered component.
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const cookies = useCookies();
  const [authResolved, setAuthResolved] = useState(false);

  // Determine if the user is authorized
  const isAuthorized = useMemo(() => {
    if (isAuthLoading || !cookies) return false;

    const accessToken = cookies.get("accessToken");
    const refreshToken = cookies.get("refreshToken");

    if (!accessToken || !refreshToken) return false;

    return user && (!roles.length || roles.includes(user.role));
  }, [user, roles, cookies, isAuthLoading]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (isAuthorized) {
      setAuthResolved(true);
    } else {
      const redirectPath = user ? "/unauthorized" : "/login";
      router.replace(redirectPath);
    }
  }, [isAuthorized, isAuthLoading, router, user]);

  if (isAuthLoading || !authResolved) {
    return <LoadingPage />;
  }

  return children;
};

export default ProtectedRoute;
