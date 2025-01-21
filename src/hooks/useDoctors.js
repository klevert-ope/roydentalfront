"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDoctor,
  deleteDoctor,
  fetchDoctors,
  getDoctorByID,
  updateDoctor,
} from "@/api/doctors";

// Fetch all doctors
export const useFetchDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });
};

// Create a new doctor
export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ doctor }) => createDoctor(doctor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

// Get a doctor by ID
export const useGetDoctorByID = (id) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorByID(id),
    enabled: !!id,
  });
};

// Update a doctor by ID
export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, doctor }) => updateDoctor(id, doctor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

// Delete a doctor by ID
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};
