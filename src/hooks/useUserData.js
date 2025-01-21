"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminManageUsers,
  deleteAccount,
  getUserProfile,
  register,
} from "@/api/auth";

// Fetch user
export const useUserData = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUserProfile,
  });
};

// Fetch all users
export const useManageUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: adminManageUsers,
    throwOnError: true,
  });
};

// Create User
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userData }) => register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    throwOnError: true,
  });
};

//Delete User
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    throwOnError: true,
  });
};
