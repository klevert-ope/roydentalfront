"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPatient,
  deleteAllPatientData,
  deletePatient,
  fetchPatients,
  getPatientByID,
  updatePatient,
} from "@/api/patients";

// Fetch all patients
export const useFetchPatients = () => {
  return useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
    throwOnError: true,
  });
};

// Create a new patient
export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patientData }) => createPatient(patientData),
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
    },
    throwOnError: true,
  });
};

// Get a patient by ID
export const useGetPatientByID = (patient_id) => {
  return useQuery({
    queryKey: ["patient", patient_id],
    queryFn: () => getPatientByID(patient_id),
    enabled: !!patient_id,
    throwOnError: true,
  });
};

// Update a patient by ID
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, patientData }) =>
      updatePatient(patient_id, patientData),
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
    },
    throwOnError: true,
  });
};

// Delete a patient by ID
export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id }) => deletePatient(patient_id),
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
    },
    throwOnError: true,
  });
};

// Delete all patient related data by ID
export const useDeleteAllPatientData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id }) => deleteAllPatientData(patient_id),
    onSuccess: () => {
      queryClient.invalidateQueries(["patients"]);
    },
    throwOnError: true,
  });
};
