"use server";
import { axiosInstance } from "@/config/axiosInstance";
import { handleAxiosError } from "@/utility/utility";

// Fetch all billings
export const fetchBillings = async () => {
  try {
    const response = await axiosInstance.get("/billings");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Create a new billing
export const createBilling = async (billing) => {
  try {
    const response = await axiosInstance.post("/billings", billing);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Get a billing by ID
export const getBillingByID = async (id) => {
  try {
    const response = await axiosInstance.get(`/billings/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Update a billing by ID
export const updateBilling = async (id, billing) => {
  try {
    console.log("Updating billing with ID:", id);
    console.log("Billing data:", billing);
    const response = await axiosInstance.put(`/billings/${id}`, billing);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Delete a billing by ID
export const deleteBilling = async (id) => {
  try {
    await axiosInstance.delete(`/billings/${id}`);
    return { message: "Billing deleted successfully" };
  } catch (error) {
    handleAxiosError(error);
  }
};
