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
import AppointmentForm from "@/features/patient/PAppointments/AppointmentForm";
import AppointmentsTable
  from "@/features/patient/PAppointments/AppointmentsTable";
import {
  useCreateAppointment,
  useDeleteAppointment,
  useFetchAppointments,
  useGetAppointmentByID,
  useUpdateAppointment,
} from "@/hooks/useAppointments";
import {useParams} from "next/navigation";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {toast} from "sonner";

const AppointmentsSection = () => {
	const {patientId} = useParams();
	const {data: appointments = []} = useFetchAppointments();
  const createAppointmentMutation = useCreateAppointment();
  const updateAppointmentMutation = useUpdateAppointment();
  const deleteAppointmentMutation = useDeleteAppointment();

  const [state, setState] = useState({
    editingAppointmentId: null,
    isCreateDialogOpen: false,
    isUpdateDialogOpen: false,
    isDeleteDialogOpen: false,
    appointmentToDelete: null,
  });

  const {
    data: editingAppointment,
    isPending: isEditingAppointmentLoading,
    refetch,
  } = useGetAppointmentByID(patientId, state.editingAppointmentId, {
    enabled: !!state.editingAppointmentId,
  });

  useEffect(() => {
    if (state.editingAppointmentId) {
      refetch();
    }
  }, [state.editingAppointmentId, refetch]);

  const filteredAppointments = useMemo(
    () =>
      appointments?.filter((appointment) =>
        appointment.patient_id === patientId
      ) ||
      [],
    [appointments, patientId],
  );

  const handleCreate = useCallback((data) => {
    createAppointmentMutation.mutate({
      patient_id: patientId,
      appointment: data,
    }, {
      onSuccess: () => {
        toast.success("Appointment created successfully!");
      },
      onError: () => {
        toast.error("Failed to create appointment");
      },
      onSettled: () => {
        setState((prev) => ({...prev, isCreateDialogOpen: false}));
      },
    });
  }, [createAppointmentMutation, patientId]);

  const handleUpdate = useCallback((data) => {
    updateAppointmentMutation.mutate({
      patient_id: patientId,
      id: state.editingAppointmentId,
      appointment: data,
    }, {
      onSuccess: () => {
        toast.success("Appointment updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update appointment");
      },
      onSettled: () => {
        setState((prev) => ({
          ...prev,
          editingAppointmentId: null,
          isUpdateDialogOpen: false,
        }));
      },
    });
  }, [updateAppointmentMutation, patientId, state.editingAppointmentId]);

  const handleEdit = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      editingAppointmentId: id,
      isUpdateDialogOpen: true,
    }));
  }, []);

  const handleDelete = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      appointmentToDelete: id,
      isDeleteDialogOpen: true,
    }));
  }, []);

  const confirmDelete = useCallback(() => {
    deleteAppointmentMutation.mutate({
      patient_id: patientId,
      id: state.appointmentToDelete,
    }, {
      onSuccess: () => {
        toast.success("Appointment deleted successfully!");
      },
      onError: () => {
        toast.error("Failed to delete appointment");
      },
      onSettled: () => {
        setState((prev) => ({
          ...prev,
          isDeleteDialogOpen: false,
          appointmentToDelete: null,
        }));
      },
    });
  }, [deleteAppointmentMutation, patientId, state.appointmentToDelete]);

  return (
    <div className={"my-16"}>
      <h2 className="text-center mb-8">APPOINTMENTS</h2>
      <Button
        onClick={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: true }))}
        className="mb-8"
      >
        Create Appointment
      </Button>
      <AppointmentsTable
        appointments={filteredAppointments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog
        open={state.isCreateDialogOpen}
        onOpenChange={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: false }))}
      >
        <DialogContent className="w-11/12 sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create Appointment</DialogTitle>
            <DialogDescription>
              Enter the details for the new appointment.
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
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
        <DialogContent className="w-11/12 sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Update Appointment</DialogTitle>
            <DialogDescription>
              Make changes to the appointment information.
            </DialogDescription>
          </DialogHeader>
          <AppointmentForm
            patientId={patientId}
            onSubmit={handleUpdate}
            defaultValues={editingAppointment}
            onClose={() =>
              setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
            isLoading={isEditingAppointmentLoading}
          />
        </DialogContent>
      </Dialog>

      <DeleteAlertDialog
        isOpen={state.isDeleteDialogOpen}
        onConfirm={confirmDelete}
        description="This action cannot be undone. This will permanently delete the appointment."
        onClose={() =>
          setState((prev) => ({ ...prev, isDeleteDialogOpen: false }))}
      />
    </div>
  );
};

export default React.memo(AppointmentsSection);
