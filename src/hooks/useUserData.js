import {
  adminManageUsers,
  deleteAccount,
  getUserProfile,
  register,
} from "@/api/auth";
import {useAuth} from "@/utility/AuthProvider";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// Fetch user
export const useUserData = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user"],
    queryFn: getUserProfile,
    enabled: !!user && !!user.role,
  });
};

// Fetch all users
export const useManageUsers = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["users"],
    queryFn: adminManageUsers,
    enabled: user && user.role === "Admin",
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
  });
};
