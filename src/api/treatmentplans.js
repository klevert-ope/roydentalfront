"use server";
import {axiosInstance} from "@/config/axiosInstance";
import {handleAxiosError} from "@/utility/handleError";

// Fetch all treatment plans for a specific patient
export const fetchTreatmentPlans = async (patient_id) => {
  try {
    const response = await axiosInstance.get(
      `/patients/${patient_id}/treatment_plans`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Create a new treatment plan for a specific patient
export const createTreatmentPlan = async (patient_id, treatmentPlan) => {
  try {
    const response = await axiosInstance.post(
      `/patients/${patient_id}/treatment_plans`,
      treatmentPlan,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Get a treatment plan by patient ID and treatment plan ID
export const getTreatmentPlanByID = async (patient_id, treatment_plan_id) => {
  try {
    const response = await axiosInstance.get(
      `/patients/${patient_id}/treatment_plans/${treatment_plan_id}`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Update a treatment plan by patient ID and treatment plan ID
export const updateTreatmentPlan = async (
  patient_id,
  treatment_plan_id,
  treatmentPlan,
) => {
  try {
    const response = await axiosInstance.put(
      `/patients/${patient_id}/treatment_plans/${treatment_plan_id}`,
      treatmentPlan,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Delete a treatment plan by patient ID and treatment plan ID
export const deleteTreatmentPlan = async (patient_id, treatment_plan_id) => {
  try {
    await axiosInstance.delete(
      `/patients/${patient_id}/treatment_plans/${treatment_plan_id}`,
    );
    return { message: "Treatment plan deleted successfully" };
  } catch (error) {
    handleAxiosError(error);
  }
};
