import {
  createTreatmentPlan,
  deleteTreatmentPlan,
  fetchTreatmentPlans,
  getTreatmentPlanByID,
  updateTreatmentPlan,
} from "@/api/treatmentplans";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// Fetch all treatment plans
export const useFetchTreatmentPlans = () => {
  return useQuery({
    queryKey: ["treatmentPlans"],
    queryFn: fetchTreatmentPlans,
  });
};

// Create a new treatment plan
export const useCreateTreatmentPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, treatmentPlan }) =>
      createTreatmentPlan(patient_id, treatmentPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatmentPlans"] });
    },
  });
};

// Get a treatment plan by patient ID and treatment plan ID
export const useGetTreatmentPlanByID = (patient_id, id) => {
  return useQuery({
    queryKey: ["treatmentPlan", patient_id, id],
    queryFn: () => getTreatmentPlanByID(patient_id, id),
    enabled: !!patient_id && !!id,
  });
};

// Update a treatment plan by patient ID and treatment plan ID
export const useUpdateTreatmentPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, id, treatmentPlan }) =>
      updateTreatmentPlan(patient_id, id, treatmentPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatmentPlans"] });
    },
  });
};

// Delete a treatment plan by patient ID and treatment plan ID
export const useDeleteTreatmentPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ patient_id, id }) => deleteTreatmentPlan(patient_id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treatmentPlans"] });
    },
  });
};
