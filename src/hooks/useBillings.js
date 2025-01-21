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
    throwOnError: true,
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
    throwOnError: true,
  });
};

// Get a billing by ID
export const useGetBillingByID = (id) => {
  return useQuery({
    queryKey: ["billing", id],
    queryFn: () => getBillingByID(id),
    enabled: !!id,
    throwOnError: true,
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
    throwOnError: true,
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
    throwOnError: true,
  });
};
