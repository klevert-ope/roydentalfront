"use client";
import {
  createAppointment,
  deleteAppointment,
  fetchAppointments,
  getAppointmentByID,
  updateAppointment,
} from "@/api/appointments";
import {useAuth} from '@/utility/AuthProvider';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// Fetch all appointments
export const useFetchAppointments = () => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
    enabled: !!user && !!user.role,
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
  const {user} = useAuth();
  return useQuery({
    queryKey: ["appointment", patient_id, id],
    queryFn: () => getAppointmentByID(patient_id, id),
    enabled: !!patient_id && !!id && !!user && !!user.role,
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
