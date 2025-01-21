"use server";
import { axiosInstance } from "@/config/axiosInstance";
import { handleAxiosError } from "@/utility/utility";

// Fetch patients
export const fetchPatients = async () => {
  try {
    const response = await axiosInstance.get("/patients");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Create a new patient
export const createPatient = async (patientData) => {
  try {
    const response = await axiosInstance.post("/patients", patientData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Get a patient by ID
export const getPatientByID = async (patient_id) => {
  try {
    const response = await axiosInstance.get(`/patients/${patient_id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Update a patient by ID
export const updatePatient = async (patient_id, patientData) => {
  try {
    const response = await axiosInstance.put(
      `/patients/${patient_id}`,
      patientData,
    );
    console.log("update patient", response);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Delete a patient by ID
export const deletePatient = async (patient_id) => {
  try {
    await axiosInstance.delete(`/patients/${patient_id}`);
    return { message: "Patient deleted successfully" };
  } catch (error) {
    handleAxiosError(error);
  }
};

// Delete all patient related data by ID
export const deleteAllPatientData = async (patient_id) => {
  try {
    await axiosInstance.delete(`/patients/${patient_id}/related`);
    return { message: "All Patient data deleted successfully" };
  } catch (error) {
    handleAxiosError(error);
  }
};
