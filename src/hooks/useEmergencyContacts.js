import {
  createEmergencyContact,
  deleteEmergencyContact,
  fetchEmergencyContacts,
  getEmergencyContactByID,
  updateEmergencyContact,
} from "@/api/emergencycontacts";
import {useAuth} from "@/utility/AuthProvider";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// Fetch all emergency contacts
export const useFetchEmergencyContacts = () => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ["emergencyContacts"],
    queryFn: () => fetchEmergencyContacts(),
    enabled: !!user && !!user.role,
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
  const {user} = useAuth();
  return useQuery({
    queryKey: ["emergencyContact", patient_id, id],
    queryFn: () => getEmergencyContactByID(patient_id, id),
    enabled: !!patient_id && !!id && !!user && !!user.role,
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
