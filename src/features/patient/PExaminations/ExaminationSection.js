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
import ExaminationForm from "@/features/patient/PExaminations/ExaminationForm";
import {
    ExaminationsAccord,
} from "@/features/patient/PExaminations/ExaminationsAccord";
import {
    useCreateExamination,
    useDeleteExamination,
    useFetchExaminations,
    useGetExaminationByID,
    useUpdateExamination,
} from "@/hooks/useExaminations";
import {useParams} from "next/navigation";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {toast} from "sonner";

const ExaminationSection = () => {
	const {patientId} = useParams();
	const {data: examinations} = useFetchExaminations();
  const createExaminationMutation = useCreateExamination();
  const updateExaminationMutation = useUpdateExamination();
  const deleteExaminationMutation = useDeleteExamination();

  const [state, setState] = useState({
    isCreateDialogOpen: false,
    isUpdateDialogOpen: false,
    isDeleteDialogOpen: false,
    editingExaminationId: null,
    examinationToDelete: null,
  });

  const {
    data: editingExamination,
    isPending: isEditingExaminationLoading,
    refetch,
  } = useGetExaminationByID(patientId, state.editingExaminationId, {
    enabled: !!state.editingExaminationId,
  });

  useEffect(() => {
    if (state.editingExaminationId) {
      refetch();
    }
  }, [state.editingExaminationId, refetch]);

  const filteredExaminations = useMemo(
    () =>
      examinations?.filter((examination) =>
        examination.patient_id === patientId
      ) || [],
    [examinations, patientId],
  );

  const handleCreate = useCallback((data) => {
    createExaminationMutation.mutate(
      { patient_id: patientId, examination: data },
      {
        onSuccess: () => {
          toast.success("Examination created successfully!");
        },
        onError: () => {
          toast.error("Failed to create examination");
        },
          onSettled: () => {
              setState((prev) => ({...prev, isCreateDialogOpen: false}));
          },
      },
    );
  }, [createExaminationMutation, patientId]);

  const handleUpdate = useCallback((data) => {
    updateExaminationMutation.mutate(
      {
        patient_id: patientId,
        id: state.editingExaminationId,
        examination: data,
      },
      {
        onSuccess: () => {
          toast.success("Examination updated successfully!");
        },
          onError: () => {
              toast.error("Failed to update the examination");
          },
          onSettled: () => {
              setState((prev) => ({
                  ...prev,
                  editingExaminationId: null,
                  isUpdateDialogOpen: false,
              }));
          },
      },
    );
  }, [updateExaminationMutation, patientId, state.editingExaminationId]);

  const handleEdit = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      editingExaminationId: id,
      isUpdateDialogOpen: true,
    }));
  }, []);

  const handleDelete = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      examinationToDelete: id,
      isDeleteDialogOpen: true,
    }));
  }, []);

  const confirmDelete = useCallback(() => {
    deleteExaminationMutation.mutate(
      { patient_id: patientId, id: state.examinationToDelete },
      {
        onSuccess: () => {
          toast.success("Examination deleted successfully!");
        },
          onError: () => {
              toast.error("Failed to delete the examination");
          },
          onSettled: () => {
              setState((prev) => ({
                  ...prev,
                  isDeleteDialogOpen: false,
                  examinationToDelete: null,
              }));
          },
      },
    );
  }, [deleteExaminationMutation, patientId, state.examinationToDelete]);

  return (
    <div className={"my-16"}>
      <h2 className="text-center mb-8">EXAMINATIONS</h2>
      <Button
        onClick={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: true }))}
        className="mb-8"
      >
        Create Examination
      </Button>

      <ExaminationsAccord
        examinations={filteredExaminations}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        open={state.isCreateDialogOpen}
        onOpenChange={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: false }))}
      >
        <DialogContent className="w-11/12 md:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Create Examination</DialogTitle>
            <DialogDescription>
              Enter the details for the new examination.
            </DialogDescription>
          </DialogHeader>
          <ExaminationForm
            patientId={patientId}
            onSubmit={handleCreate}
            onClose={() =>
              setState((prev) => ({ ...prev, isCreateDialogOpen: false }))}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={state.isUpdateDialogOpen}
        onOpenChange={() =>
          setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
      >
        <DialogContent className="w-11/12 md:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>Update Examination</DialogTitle>
            <DialogDescription>
              Make changes to the examination information.
            </DialogDescription>
          </DialogHeader>
          <ExaminationForm
            patientId={patientId}
            onSubmit={handleUpdate}
            defaultValues={editingExamination}
            onClose={() =>
              setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
            isLoading={isEditingExaminationLoading}
          />
        </DialogContent>
      </Dialog>

      <DeleteAlertDialog
        isOpen={state.isDeleteDialogOpen}
        onConfirm={confirmDelete}
        description="This action cannot be undone. This will permanently delete the examination."
        onClose={() =>
          setState((prev) => ({ ...prev, isDeleteDialogOpen: false }))}
      />
    </div>
  );
};

export default React.memo(ExaminationSection);
