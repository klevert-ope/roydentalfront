"use client";

import {LoadingPage} from "@/components/LoadingPage";
import {useAuth} from "@/utility/AuthProvider";
import {useRouter} from "next/navigation";
import React, {useEffect, useMemo} from "react";

// Define user roles as constants for reusability and type safety
export const ROLES = {
  ADMIN: "Admin",
  DOCTOR: "Doctor",
  RECEPTIONIST: "Receptionist",
};

/**
 * ProtectedRoute component ensures
 * that only authorized users can access specific routes.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children -
 * The children components to be rendered.
 * @param {string[]} [props.roles=[]] - The roles allowed accessing the route.
 * @returns {React.ReactElement} The rendered component.
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const {user, isLoading: isAuthLoading, accessToken, refreshToken} = useAuth();
  const router = useRouter();

  // Determine if the user is authorized
  const isAuthorized = useMemo(() => {
    // If authentication is still loading or user/tokens are missing,
    // return false
    if (isAuthLoading || !accessToken || !refreshToken || !user) return false;

    // If no roles are specified, allow access to all authenticated users
    if (roles.length === 0) return true;

    // Check if the user's role is included in the allowed roles
    return roles.includes(user.role);
  }, [isAuthLoading, accessToken, refreshToken, user, roles]);

  // Redirect logic based on authentication and authorization
  useEffect(() => {
    // Skip redirection if authentication is still loading
    if (isAuthLoading) return;

    // Redirect to log in if tokens are missing
    if (!accessToken || !refreshToken) {
      router.replace("/login");
      return;
    }

    // Redirect to unauthorized page or login if the user is not authorized
    if (!isAuthorized) {
      router.replace(user ? "/unauthorized" : "/login");
    }
  }, [isAuthLoading, isAuthorized, router, accessToken, refreshToken, user]);

  // Show loading state while authentication is in progress
  // or if the user is not authorized
  if (isAuthLoading || !isAuthorized) {
    return <LoadingPage />;
  }

  // Render the children if the user is authorized
  return children;
};

// Set default props for roles
ProtectedRoute.defaultProps = {
  roles: [],
};

export default ProtectedRoute;
