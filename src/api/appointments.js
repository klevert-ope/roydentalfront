"use server";
import { axiosInstance } from "@/config/axiosInstance";
import { handleAxiosError } from "@/utility/utility";

// Fetch all appointments for a specific patient
export const fetchAppointments = async (patient_id) => {
  try {
    const response = await axiosInstance.get(
      `/patients/${patient_id}/appointments`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Create a new appointment for a specific patient
export const createAppointment = async (patient_id, appointment) => {
  try {
    const response = await axiosInstance.post(
      `/patients/${patient_id}/appointments`,
      appointment,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Get an appointment by patient ID and appointment ID
export const getAppointmentByID = async (patient_id, appointment_id) => {
  try {
    const response = await axiosInstance.get(
      `/patients/${patient_id}/appointments/${appointment_id}`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Update an appointment by patient ID and appointment ID
export const updateAppointment = async (
  patient_id,
  appointment_id,
  appointment,
) => {
  try {
    const response = await axiosInstance.put(
      `/patients/${patient_id}/appointments/${appointment_id}`,
      appointment,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Delete an appointment by patient ID and appointment ID
export const deleteAppointment = async (patient_id, appointment_id) => {
  try {
    await axiosInstance.delete(
      `/patients/${patient_id}/appointments/${appointment_id}`,
    );
    return { message: "Appointment deleted successfully" };
  } catch (error) {
    handleAxiosError(error);
  }
};
