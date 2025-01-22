"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { login as apiLogin } from "@/api/auth";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Create the AuthContext
const AuthContext = createContext();

/**
 * AuthProvider component manages authentication state and provides it to the application.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to be rendered.
 * @returns {React.ReactElement} The rendered component.
 */
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const cookies = useCookies();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    // Retrieve user and tokens from cookies
    const storedUser = cookies.get("user");
    const storedAccessToken = cookies.get("accessToken");
    const storedRefreshToken = cookies.get("refreshToken");

    if (storedUser && storedAccessToken && storedRefreshToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
    } else {
      // Redirect to log in if cookies are missing
      router.replace("/login");
    }
    setIsLoading(false); // Set loading to false once cookie check is complete
  }, [cookies, router]); // Run this effect when cookies or router change

  /**
   * Logs in the user and sets the authentication state.
   * @param {Object} userData - The user data for login.
   */
  const login = async (userData) => {
    try {
      const loggedInUser = await apiLogin(userData);
      const { accessToken, refreshToken, ...userInfo } = loggedInUser;

      // Set user info and tokens in cookies
      cookies.set("user", JSON.stringify(userInfo), {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
      cookies.set("accessToken", accessToken, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });
      cookies.set("refreshToken", refreshToken, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      setUser(userInfo);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      router.replace("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  /**
   * Logs off the user and clears the authentication state.
   */
  const logoff = async () => {
    try {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      // Remove user and tokens from cookies
      cookies.remove("user");
      cookies.remove("accessToken");
      cookies.remove("refreshToken");
      router.replace("/login");
    } catch (error) {
      toast.error("Failed to logoff");
    }
  };

  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(() => ({
    user,
    login,
    logoff,
    isLoading,
    accessToken,
    refreshToken,
  }), [user, login, logoff, isLoading, accessToken, refreshToken]);

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the AuthContext.
 * @returns {Object} The authentication context value.
 */
export const useAuth = () => useContext(AuthContext);
