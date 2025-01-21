"use server";
import { axiosInstance } from "@/config/axiosInstance";
import { handleAxiosError } from "@/utility/utility";

// Fetch all emergency contacts for a specific patient
export const fetchEmergencyContacts = async (patient_id) => {
  try {
    const response = await axiosInstance.get(
      `/patients/${patient_id}/emergency_contacts`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Create a new emergency contact for a specific patient
export const createEmergencyContact = async (patient_id, emergencyContact) => {
  try {
    const response = await axiosInstance.post(
      `/patients/${patient_id}/emergency_contacts`,
      emergencyContact,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Get an emergency contact by patient ID and emergency contact ID
export const getEmergencyContactByID = async (
  patient_id,
  emergency_contact_id,
) => {
  try {
    const response = await axiosInstance.get(
      `/patients/${patient_id}/emergency_contacts/${emergency_contact_id}`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Update an emergency contact by patient ID and emergency contact ID
export const updateEmergencyContact = async (
  patient_id,
  emergency_contact_id,
  emergencyContact,
) => {
  try {
    const response = await axiosInstance.put(
      `/patients/${patient_id}/emergency_contacts/${emergency_contact_id}`,
      emergencyContact,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Delete an emergency contact by patient ID and emergency contact ID
export const deleteEmergencyContact = async (
  patient_id,
  emergency_contact_id,
) => {
  try {
    await axiosInstance.delete(
      `/patients/${patient_id}/emergency_contacts/${emergency_contact_id}`,
    );
    return { message: "Emergency contact deleted successfully" };
  } catch (error) {
    handleAxiosError(error);
  }
};
