import {
  createDoctor,
  deleteDoctor,
  fetchDoctors,
  getDoctorByID,
  updateDoctor,
} from "@/api/doctors";
import {useAuth} from "@/utility/AuthProvider";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// Fetch all doctors
export const useFetchDoctors = () => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    enabled: !!user && !!user.role,
  });
};

// Create a new doctor
export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ doctor }) => createDoctor(doctor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

// Get a doctor by ID
export const useGetDoctorByID = (id) => {
  const {user} = useAuth();
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => getDoctorByID(id),
    enabled: !!id && !!user && !!user.role,
  });
};

// Update a doctor by ID
export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, doctor }) => updateDoctor(id, doctor),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

// Delete a doctor by ID
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};
