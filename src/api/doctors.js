"use server";
import {axiosInstance} from "@/config/axiosInstance";
import {handleAxiosError} from "@/utility/handleError";

// Fetch all doctors
export const fetchDoctors = async () => {
  try {
    const response = await axiosInstance.get("/doctors");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Create a new doctor
export const createDoctor = async (doctor) => {
  try {
    const response = await axiosInstance.post("/doctors", doctor);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Get a doctor by ID
export const getDoctorByID = async (id) => {
  try {
    const response = await axiosInstance.get(`/doctors/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Update a doctor by ID
export const updateDoctor = async (id, doctor) => {
  try {
    const response = await axiosInstance.put(`/doctors/${id}`, doctor);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Delete a doctor by ID
export const deleteDoctor = async (id) => {
  try {
    await axiosInstance.delete(`/doctors/${id}`);
    return { message: "Doctor deleted successfully" };
  } catch (error) {
    handleAxiosError(error);
  }
};
