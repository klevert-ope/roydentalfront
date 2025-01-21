"use server";
import { axiosInstance } from "@/config/axiosInstance";
import { handleAxiosError } from "@/utility/utility";

// Fetch all examinations for a specific patient
export const fetchExaminations = async (patient_id) => {
  try {
    const response = await axiosInstance.get(
      `/patients/${patient_id}/examinations`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Create a new examination for a specific patient
export const createExamination = async (patient_id, examination) => {
  try {
    const response = await axiosInstance.post(
      `/patients/${patient_id}/examinations`,
      examination,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Get an examination by patient ID and examination ID
export const getExaminationByID = async (patient_id, examination_id) => {
  try {
    const response = await axiosInstance.get(
      `/patients/${patient_id}/examinations/${examination_id}`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Update an examination by patient ID and examination ID
export const updateExamination = async (
  patient_id,
  examination_id,
  examination,
) => {
  try {
    const response = await axiosInstance.put(
      `/patients/${patient_id}/examinations/${examination_id}`,
      examination,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Delete an examination by patient ID and examination ID
export const deleteExamination = async (patient_id, examination_id) => {
  try {
    await axiosInstance.delete(
      `/patients/${patient_id}/examinations/${examination_id}`,
    );
    return { message: "Examination deleted successfully" };
  } catch (error) {
    handleAxiosError(error);
  }
};
