"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/utility/AuthProvider";
import React, { useEffect, useMemo } from "react";
import { LoadingPage } from "@/components/LoadingPage";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isLoading: isAuthLoading, accessToken, refreshToken } =
    useAuth();
  const router = useRouter();

  // Determine if the user is authorized
  const isAuthorized = useMemo(() => {
    if (isAuthLoading || !accessToken || !refreshToken || !user) return false;
    return roles.length === 0 || roles.includes(user.role);
  }, [isAuthLoading, accessToken, refreshToken, user, roles]);

  // Redirect logic
  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken || !refreshToken) {
      router.replace("/login");
      return;
    }

    if (!isAuthorized) {
      router.replace(user ? "/unauthorized" : "/login");
    }
  }, [
    isAuthLoading,
    isAuthorized,
    router,
    accessToken,
    refreshToken,
    user?.role,
  ]);

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

ProtectedRoute.defaultProps = {
  roles: [],
};

export default ProtectedRoute;
