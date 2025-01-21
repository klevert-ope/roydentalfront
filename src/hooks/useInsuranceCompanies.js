"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInsuranceCompany,
  deleteInsuranceCompany,
  fetchInsuranceCompanies,
  getInsuranceCompanyByID,
  updateInsuranceCompany,
} from "@/api/insurancecompanies";

// Fetch all insurance companies
export const useFetchInsuranceCompanies = () => {
  return useQuery({
    queryKey: ["insuranceCompanies"],
    queryFn: fetchInsuranceCompanies,
  });
};

// Create a new insurance company
export const useCreateInsuranceCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ insuranceCompany }) =>
      createInsuranceCompany(insuranceCompany),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insuranceCompanies"] });
    },
  });
};

// Get an insurance company by ID
export const useGetInsuranceCompanyByID = (id) => {
  return useQuery({
    queryKey: ["insuranceCompany", id],
    queryFn: () => getInsuranceCompanyByID(id),
    enabled: !!id,
  });
};

// Update an insurance company by ID
export const useUpdateInsuranceCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, insuranceCompany }) =>
      updateInsuranceCompany(id, insuranceCompany),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insuranceCompanies"] });
    },
  });
};

// Delete an insurance company by ID
export const useDeleteInsuranceCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteInsuranceCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insuranceCompanies"] });
    },
  });
};
