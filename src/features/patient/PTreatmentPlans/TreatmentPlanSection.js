"use client";
import DeleteAlertDialog from "@/components/DeleteAlertDialog";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TreatmentPlanForm
  from "@/features/patient/PTreatmentPlans/TreatmentPlanForm";
import {
  TreatmentPlansAccord,
} from "@/features/patient/PTreatmentPlans/TreatmentPlansAccord";
import {
  useCreateTreatmentPlan,
  useDeleteTreatmentPlan,
  useFetchTreatmentPlans,
  useGetTreatmentPlanByID,
  useUpdateTreatmentPlan,
} from "@/hooks/useTreatmentPlans";
import {useParams} from "next/navigation";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";

const TreatmentPlanSection = () => {
  const {patientId} = useParams();
  const {data: treatmentPlans = []} = useFetchTreatmentPlans();
  const createTreatmentPlanMutation = useCreateTreatmentPlan();
  const updateTreatmentPlanMutation = useUpdateTreatmentPlan();
  const deleteTreatmentPlanMutation = useDeleteTreatmentPlan();

  const [state, setState] = useState({
    isCreateDialogOpen: false,
    isUpdateDialogOpen: false,
    isDeleteDialogOpen: false,
    editingTreatmentPlanId: null,
    treatmentPlanToDelete: null,
  });

  const {
    data: editingTreatmentPlan,
    isPending: isEditingLoading,
    refetch,
  } = useGetTreatmentPlanByID(patientId, state.editingTreatmentPlanId, {
    enabled: !!state.editingTreatmentPlanId,
  });

  useEffect(() => {
    if (state.editingTreatmentPlanId) {
      refetch();
    }
  }, [state.editingTreatmentPlanId, refetch]);

  const filteredTreatmentPlans = useMemo(
    () => treatmentPlans?.filter((plan) => plan.patient_id === patientId) || [],
    [treatmentPlans, patientId],
  );

  const handleCreate = useCallback((data) => {
    createTreatmentPlanMutation.mutate(
      { patient_id: patientId, treatmentPlan: data },
      {
        onSuccess: () => {
          toast.success("Treatment plan created successfully!");
          setState((prev) => ({ ...prev, isCreateDialogOpen: false }));
        },
        onError: () => {
          toast.error("Failed to create the treatment plan");
        },
      },
    );
  }, [createTreatmentPlanMutation, patientId]);

  const handleUpdate = useCallback((data) => {
    updateTreatmentPlanMutation.mutate(
      {
        patient_id: patientId,
        id: state.editingTreatmentPlanId,
        treatmentPlan: data,
      },
      {
        onSuccess: () => {
          toast.success("Treatment plan updated successfully!");
          setState((prev) => ({
            ...prev,
            editingTreatmentPlanId: null,
            isUpdateDialogOpen: false,
          }));
        },
        onError: () => {
          toast.error("Failed to update treatment plan");
        },
      },
    );
  }, [updateTreatmentPlanMutation, patientId, state.editingTreatmentPlanId]);

  const handleEdit = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      editingTreatmentPlanId: id,
      isUpdateDialogOpen: true,
    }));
  }, []);

  const handleDelete = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      treatmentPlanToDelete: id,
      isDeleteDialogOpen: true,
    }));
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    deleteTreatmentPlanMutation.mutate(
      { patient_id: patientId, id: state.treatmentPlanToDelete },
      {
        onSuccess: () => {
          toast.success("Treatment plan deleted successfully!");
          setState((prev) => ({
            ...prev,
            isDeleteDialogOpen: false,
            treatmentPlanToDelete: null,
          }));
        },
        onError: () => {
          toast.error("Failed to delete the treatment plan");
        },
      },
    );
  }, [deleteTreatmentPlanMutation, patientId, state.treatmentPlanToDelete]);

  return (
    <div className={"my-16"}>
      <h1 className="text-center mb-8">TREATMENT PLANS</h1>
      <Button
        onClick={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: true }))}
      >
        Create Treatment Plan
      </Button>

      <TreatmentPlansAccord
        plans={filteredTreatmentPlans}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create Dialog */}
      <Dialog
        open={state.isCreateDialogOpen}
        onOpenChange={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: false }))}
      >
        <DialogContent className="w-11/12 md:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Create Treatment Plan</DialogTitle>
            <DialogDescription>
              Enter the details for the new treatment plan.
            </DialogDescription>
          </DialogHeader>
          <TreatmentPlanForm
            patientId={patientId}
            onSubmit={handleCreate}
            onClose={() =>
              setState((prev) => ({ ...prev, isCreateDialogOpen: false }))}
          />
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog
        open={state.isUpdateDialogOpen}
        onOpenChange={() =>
          setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
      >
        <DialogContent className="w-11/12 md:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Update Treatment Plan</DialogTitle>
            <DialogDescription>
              Make changes to the treatment plan information.
            </DialogDescription>
          </DialogHeader>
          <TreatmentPlanForm
            patientId={patientId}
            onSubmit={handleUpdate}
            defaultValues={editingTreatmentPlan}
            onClose={() =>
              setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
            isLoading={isEditingLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <DeleteAlertDialog
        isOpen={state.isDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        description="This action cannot be undone. This will permanently delete the treatment plan."
        onClose={() =>
          setState((prev) => ({ ...prev, isDeleteDialogOpen: false }))}
      />
    </div>
  );
};

export default React.memo(TreatmentPlanSection);
