"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExamination,
  deleteExamination,
  fetchExaminations,
  getExaminationByID,
  updateExamination,
} from "@/api/examinations";

// Fetch all examinations
export const useFetchExaminations = () => {
  return useQuery({
    queryKey: ["examinations"],
    queryFn: fetchExaminations,
    throwOnError: true,
  });
};

// Create a new examination
export const useCreateExamination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, examination }) =>
      createExamination(patient_id, examination),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examinations"] });
    },
    throwOnError: true,
  });
};

// Get an examination by patient ID and examination ID
export const useGetExaminationByID = (patient_id, id) => {
  return useQuery({
    queryKey: ["examination", patient_id, id],
    queryFn: () => getExaminationByID(patient_id, id),
    enabled: !!patient_id && !!id,
    throwOnError: true,
  });
};

// Update an examination by patient ID and examination ID
export const useUpdateExamination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, id, examination }) =>
      updateExamination(patient_id, id, examination),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examinations"] });
    },
    throwOnError: true,
  });
};

// Delete an examination by patient ID and examination ID
export const useDeleteExamination = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, id }) => deleteExamination(patient_id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examinations"] });
    },
    throwOnError: true,
  });
};
