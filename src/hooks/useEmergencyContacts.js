"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmergencyContact,
  deleteEmergencyContact,
  fetchEmergencyContacts,
  getEmergencyContactByID,
  updateEmergencyContact,
} from "@/api/emergencycontacts";

// Fetch all emergency contacts
export const useFetchEmergencyContacts = () => {
  return useQuery({
    queryKey: ["emergencyContacts"],
    queryFn: () => fetchEmergencyContacts(),
    throwOnError: true,
  });
};

// Create a new emergency contact
export const useCreateEmergencyContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, emergencyContact }) =>
      createEmergencyContact(patient_id, emergencyContact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencyContacts"] });
    },
    throwOnError: true,
  });
};

// Get an emergency contact by patient ID and emergency contact ID
export const useGetEmergencyContactByID = (patient_id, id) => {
  return useQuery({
    queryKey: ["emergencyContact", patient_id, id],
    queryFn: () => getEmergencyContactByID(patient_id, id),
    enabled: !!patient_id && !!id,
    throwOnError: true,
  });
};

// Update an emergency contact by patient ID and emergency contact ID
export const useUpdateEmergencyContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, id, emergencyContact }) =>
      updateEmergencyContact(patient_id, id, emergencyContact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencyContacts"] });
    },
    throwOnError: true,
  });
};

// Delete an emergency contact by patient ID and emergency contact ID
export const useDeleteEmergencyContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, id }) => deleteEmergencyContact(patient_id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergencyContacts"] });
    },
    throwOnError: true,
  });
};
