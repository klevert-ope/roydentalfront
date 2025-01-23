"use client";
import {
  createExamination,
  deleteExamination,
  fetchExaminations,
  getExaminationByID,
  updateExamination,
} from "@/api/examinations";
import {useAuth} from "@/utility/AuthProvider";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// Fetch all examinations
export const useFetchExaminations = () => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ["examinations"],
    queryFn: fetchExaminations,
    enabled: !!user && !!user.role,
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
  });
};

// Get an examination by patient ID and examination ID
export const useGetExaminationByID = (patient_id, id) => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ["examination", patient_id, id],
    queryFn: () => getExaminationByID(patient_id, id),
    enabled: !!patient_id && !!id && !!user && !!user.role,
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
  });
};
