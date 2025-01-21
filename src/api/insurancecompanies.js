"use server";
import { axiosInstance } from "@/config/axiosInstance";
import { handleAxiosError } from "@/utility/utility";

// Fetch all insurance companies
export const fetchInsuranceCompanies = async () => {
  try {
    const response = await axiosInstance.get("/insurance_companies");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Create a new insurance company
export const createInsuranceCompany = async (insuranceCompany) => {
  try {
    const response = await axiosInstance.post(
      "/insurance_companies",
      insuranceCompany,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Get an insurance company by ID
export const getInsuranceCompanyByID = async (id) => {
  try {
    const response = await axiosInstance.get(`/insurance_companies/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Update an insurance company by ID
export const updateInsuranceCompany = async (id, insuranceCompany) => {
  try {
    const response = await axiosInstance.put(
      `/insurance_companies/${id}`,
      insuranceCompany,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Delete an insurance company by ID
export const deleteInsuranceCompany = async (id) => {
  try {
    await axiosInstance.delete(`/insurance_companies/${id}`);
    return { message: "Insurance company deleted successfully" };
  } catch (error) {
    handleAxiosError(error);
  }
};
