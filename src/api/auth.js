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
    const {accessToken, refreshToken} = response.data;

    const cookieStore = await cookies();
    cookieStore.set("accessToken", accessToken, {
      maxAge: 86400, // 1 day
      expires: new Date(Date.now() + 86400 * 1000),
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      httpOnly: true,
	    priority: "high",
    });
    const refreshMax = 86400 * 7; // 7 days
    cookieStore.set("refreshToken", refreshToken, {
      maxAge: refreshMax,
      expires: new Date(Date.now() + 86400 * 1000 * 7),
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      httpOnly: true,
	    priority: "medium",
    });

	  return {success: true, redirectUrl: "/"};
  } catch (error) {
    handleAxiosError(error);
    return {success: false, redirectUrl: "/login"};
  }
};

export const logoff = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

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
    const cookieStore = await cookies();
    const userAccess = cookieStore.get("accessToken");
    if (!userAccess || typeof userAccess !== "object" || !userAccess.value) {
      console.log("Unauthorized: No valid access token found");
    }

    const token = userAccess.value;

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
    const cookieStore = await cookies();
    const userAccess = cookieStore.get("accessToken");
    if (!userAccess || typeof userAccess !== "object" || !userAccess.value) {
      console.log("Unauthorized: No valid access token found");
    }

    const token = userAccess.value;

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

export const refreshToken = async () => {
  try {
    const cookieStore = await cookies();
    const userAccess = cookieStore.get("accessToken");
    if (!userAccess || typeof userAccess !== "object" || !userAccess.value) {
      console.log("Unauthorized: No valid access token found");
    }

    const token = userAccess.value;

    const response = await axiosInstance.get("/refresh-token", {
      params: {accessToken: token},
    });
    // a new access token
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Verify the access token with the backend
export const verifyToken = async (token) => {
  try {
    const response = await axiosInstance.post("/auth/decrypt", {token});
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
