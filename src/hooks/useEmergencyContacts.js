import {
  createEmergencyContact,
  deleteEmergencyContact,
  fetchEmergencyContacts,
  getEmergencyContactByID,
  updateEmergencyContact,
} from "@/api/emergencycontacts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// Fetch all emergency contacts
export const useFetchEmergencyContacts = () => {
  return useQuery({
    queryKey: ["emergencyContacts"],
    queryFn: () => fetchEmergencyContacts(),
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
  });
};

// Get an emergency contact by patient ID and emergency contact ID
export const useGetEmergencyContactByID = (patient_id, id) => {
  return useQuery({
    queryKey: ["emergencyContact", patient_id, id],
    queryFn: () => getEmergencyContactByID(patient_id, id),
    enabled: !!patient_id && !!id,
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
  });
};
