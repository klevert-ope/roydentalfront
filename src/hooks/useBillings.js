import {
  createBilling,
  deleteBilling,
  fetchBillings,
  getBillingByID,
  updateBilling,
} from "@/api/billings";
import {useAuth} from "@/utility/AuthProvider";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// Fetch all billings
export const useFetchBillings = () => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ["billings"],
    queryFn: fetchBillings,
    enabled: !!user && !!user.role,
  });
};

// Create a new billing
export const useCreateBilling = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ billing }) => createBilling(billing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billings"] });
    },
  });
};

// Get a billing by ID
export const useGetBillingByID = (id) => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ["billing", id],
    queryFn: () => getBillingByID(id),
    enabled: !!id && !!user && !!user.role,
  });
};

// Update a billing by ID
export const useUpdateBilling = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, billing }) => updateBilling(id, billing),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billings"] });
    },
  });
};

// Delete a billing by ID
export const useDeleteBilling = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteBilling(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billings"] });
    },
  });
};
