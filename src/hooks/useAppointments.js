import {
  createAppointment,
  deleteAppointment,
  fetchAppointments,
  getAppointmentByID,
  updateAppointment,
} from "@/api/appointments";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// Fetch all appointments
export const useFetchAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });
};

// Create a new appointment
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, appointment }) =>
      createAppointment(patient_id, appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

// Get an appointment by patient ID and appointment ID
export const useGetAppointmentByID = (patient_id, id) => {
  return useQuery({
    queryKey: ["appointment", patient_id, id],
    queryFn: () => getAppointmentByID(patient_id, id),
    enabled: !!patient_id && !!id,
  });
};

// Update an appointment by patient ID and appointment ID
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, id, appointment }) =>
      updateAppointment(patient_id, id, appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

// Delete an appointment by patient ID and appointment ID
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, id }) => deleteAppointment(patient_id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
