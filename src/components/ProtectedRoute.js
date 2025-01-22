"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/utility/AuthProvider";
import React, { useEffect } from "react";
import { LoadingPage } from "@/components/LoadingPage";

/**
 * ProtectedRoute component ensures that only authorized users can access certain routes.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to render if authorized.
 * @param {string[]} props.roles - The roles allowed accessing the route. Defaults to an empty array (no restrictions).
 * @returns {React.ReactElement} The rendered component.
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isLoading: isAuthLoading, accessToken, refreshToken } =
    useAuth();
  const router = useRouter();

  // Check if user is authorized
  const isAuthorized = !isAuthLoading && !!accessToken && !!refreshToken &&
    user &&
    (roles.length === 0 || (user.role && roles.includes(user.role)));

  // Handle redirection logic
  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken || !refreshToken) {
      router.replace("/login");
      return;
    }

    if (!isAuthorized) {
      const redirectPath = user ? "/unauthorized" : "/login";
      router.replace(redirectPath);
    }
  }, [isAuthLoading, isAuthorized, router, user, accessToken, refreshToken]);

  if (isAuthLoading || !isAuthorized) {
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
