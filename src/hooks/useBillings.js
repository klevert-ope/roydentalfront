"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBilling,
  deleteBilling,
  fetchBillings,
  getBillingByID,
  updateBilling,
} from "@/api/billings";

// Fetch all billings
export const useFetchBillings = () => {
  return useQuery({
    queryKey: ["billings"],
    queryFn: fetchBillings,
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
  return useQuery({
    queryKey: ["billing", id],
    queryFn: () => getBillingByID(id),
    enabled: !!id,
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
    onError: () => {
      console.log(billings);
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
