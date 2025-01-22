"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/utility/AuthProvider";
import React, { useEffect, useMemo, useState } from "react";
import { LoadingPage } from "@/components/LoadingPage";

/**
 * ProtectedRoute component ensures that only authorized users can access certain routes.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to render if authorized.
 * @param {string[]} props.roles - The roles allowed accessing the route. Defaults to an empty array (no restrictions).
 * @returns {React.ReactElement} The rendered component.
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isLoading: isAuthLoading, accessToken, refreshToken } = useAuth();
  const router = useRouter();
  const [authResolved, setAuthResolved] = useState(false);

  // Validate tokens
  const areTokensValid = useMemo(() => !!accessToken && !!refreshToken, [accessToken, refreshToken]);

  // Check if user is authorized
  const isAuthorized = useMemo(() => {
    if (isAuthLoading) return false;
    if (!areTokensValid) return false;
    if (!user) return false;

    return roles.length === 0 || (user.role && roles.includes(user.role));
  }, [user, roles, isAuthLoading, areTokensValid]);

  // Handle redirection logic
  useEffect(() => {
    if (isAuthLoading) return;

    if (!areTokensValid) {
      router.replace("/login");
      return;
    }

    if (isAuthorized) {
      setAuthResolved(true);
    } else {
      const redirectPath = user ? "/unauthorized" : "/login";
      router.replace(redirectPath);
    }
  }, [isAuthorized, isAuthLoading, router, areTokensValid, user]);

  if (isAuthLoading || !authResolved) {
    return <LoadingPage />;
  }

  return children;
};

export const ROLES = {
  ADMIN: "Admin",
  DOCTOR: "Doctor",
  RECEPTIONIST: "Receptionist",
};

export default ProtectedRoute;
