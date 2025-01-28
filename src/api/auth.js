"use server";
import {axiosInstance} from "@/config/axiosInstance";
import {handleAxiosError} from "@/utility/handleError";
import {cookies} from "next/headers";

// Auth routes (Public APIs, No token required)
export const register = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const login = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData);
    const {accessToken, refreshToken, ...userInfo} = response.data;

    const cookieStore = await cookies();
    cookieStore.set("user", JSON.stringify(userInfo), {
      maxAge: 3600 * 24,
      secure: true,
      sameSite: "Strict",
    });
    cookieStore.set("accessToken", accessToken, {
      maxAge: 3600 * 24,
      secure: true,
      sameSite: "Strict",
    });
    cookieStore.set("refreshToken", refreshToken, {
      maxAge: 3600 * 24 * 7,
      secure: true,
      sameSite: "Strict",
    });

    return {success: true, redirectUrl: "/"};
  } catch (error) {
    handleAxiosError(error);
    return {success: false, error: error.message};
  }
};

export const logoff = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("user");

    // Redirect after deleting cookies
    return {success: true, redirectUrl: "/login"};
  } catch (error) {
    handleAxiosError(error);
  }
};

export const sendResetCode = async (emailData) => {
  try {
    const response = await axiosInstance.post(
      "/auth/send-reset-code",
      emailData,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.post(
      "/auth/change-password",
      passwordData,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Protected routes (Require Authorization, Use authInstance)
export const changeEmail = async (emailData) => {
  try {
    const response = await axiosInstance.post("/auth/change-email", emailData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const deleteAccount = async (id) => {
  try {
    await axiosInstance.delete(`/auth/delete-account/${id}`);
  } catch (error) {
    handleAxiosError(error);
  }
};

// Admin routes (Require Authorization, Use authInstance)
export const adminManageUsers = async () => {
  try {
    const cookieStore = cookies();
    const userAccess = cookieStore.get("accessToken");
    const token = typeof userAccess === "object" && userAccess !== null
      ? userAccess.value
      : userAccess;

    const response = await axiosInstance.get("/auth/admin/manage-users", {
      params: {accessToken: token},
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// User routes (Require Authorization, Use authInstance)
export const getUserProfile = async () => {
  try {
    const cookieStore = cookies();
    const userAccess = cookieStore.get("accessToken");
    const token = typeof userAccess === "object" && userAccess !== null
      ? userAccess.value
      : userAccess;

    const response = await axiosInstance.get("/auth/user/profile", {
      params: {accessToken: token},
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put(
      "/auth/user/update-profile",
      profileData,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
