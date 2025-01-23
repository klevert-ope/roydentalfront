"use client";
import {
  createPatient,
  deleteAllPatientData,
  deletePatient,
  fetchPatients,
  getPatientByID,
  updatePatient,
} from "@/api/patients";
import {useAuth} from "@/utility/AuthProvider";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// Fetch all patients
export const useFetchPatients = () => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ["patients"],
    queryFn: fetchPatients,
    enabled: !!user && !!user.role,
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
  });
};

// Get a patient by ID
export const useGetPatientByID = (patient_id) => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ["patient", patient_id],
    queryFn: () => getPatientByID(patient_id),
    enabled: !!patient_id && !!user && !!user.role,
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
  });
};
