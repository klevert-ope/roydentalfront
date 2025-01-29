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
import EmergencyContactForm
  from "@/features/patient/PEmergencyContacts/EmergencyContactForm";
import EmergencyContactsTable
  from "@/features/patient/PEmergencyContacts/EmergencyContactsTable";
import {
  useCreateEmergencyContact,
  useDeleteEmergencyContact,
  useFetchEmergencyContacts,
  useGetEmergencyContactByID,
  useUpdateEmergencyContact,
} from "@/hooks/useEmergencyContacts";
import {useParams} from "next/navigation";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";

const EmergencyContactsSection = () => {
  const {patientId} = useParams();
  const {data: emergencyContacts = []} = useFetchEmergencyContacts();
  const createEmergencyContactMutation = useCreateEmergencyContact();
  const updateEmergencyContactMutation = useUpdateEmergencyContact();
  const deleteEmergencyContactMutation = useDeleteEmergencyContact();

  const [state, setState] = useState({
    isCreateDialogOpen: false,
    isUpdateDialogOpen: false,
    isDeleteDialogOpen: false,
    editingEmergencyContactId: null,
    emergencyContactToDelete: null,
  });

  const {
    data: editingEmergencyContact,
    isLoading: isEditingEmergencyContactLoading,
    refetch,
  } = useGetEmergencyContactByID(patientId, state.editingEmergencyContactId, {
    enabled: !!state.editingEmergencyContactId,
  });

  useEffect(() => {
    if (state.editingEmergencyContactId) {
      refetch();
    }
  }, [state.editingEmergencyContactId, refetch]);

  const filteredEmergencyContacts = useMemo(
    () =>
      emergencyContacts?.filter((contact) =>
        contact.patient_id === patientId
      ) || [],
    [emergencyContacts, patientId],
  );

  const handleCreate = useCallback((data) => {
    createEmergencyContactMutation.mutate(
      { patient_id: patientId, emergencyContact: data },
      {
        onSuccess: () => {
          toast.success("Emergency contact created successfully!");
          setState((prev) => ({ ...prev, isCreateDialogOpen: false }));
        },
        onError: () => {
          toast.error("Failed to create the emergency contact");
        },
      },
    );
  }, [createEmergencyContactMutation, patientId]);

  const handleUpdate = useCallback((data) => {
    updateEmergencyContactMutation.mutate(
      {
        patient_id: patientId,
        id: state.editingEmergencyContactId,
        emergencyContact: data,
      },
      {
        onSuccess: () => {
          toast.success("Emergency contact updated successfully!");
          setState((prev) => ({
            ...prev,
            editingEmergencyContactId: null,
            isUpdateDialogOpen: false,
          }));
        },
        onError: () => {
          toast.error("Failed to update the emergency contact");
        },
      },
    );
  }, [
    updateEmergencyContactMutation,
    patientId,
    state.editingEmergencyContactId,
  ]);

  const handleEdit = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      editingEmergencyContactId: id,
      isUpdateDialogOpen: true,
    }));
  }, []);

  const handleDelete = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      emergencyContactToDelete: id,
      isDeleteDialogOpen: true,
    }));
  }, []);

  const confirmDelete = useCallback(() => {
    deleteEmergencyContactMutation.mutate(
      { patient_id: patientId, id: state.emergencyContactToDelete },
      {
        onSuccess: () => {
          toast.success("Emergency Contact deleted successfully!");
          setState((prev) => ({
            ...prev,
            isDeleteDialogOpen: false,
            emergencyContactToDelete: null,
          }));
        },
        onError: () => {
          toast.error("Failed to delete the emergency contact");
        },
      },
    );
  }, [
    deleteEmergencyContactMutation,
    patientId,
    state.emergencyContactToDelete,
  ]);

  return (
    <div className={"my-16"}>
      <h2 className="text-center mb-8">EMERGENCY CONTACTS</h2>
      <Button
        onClick={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: true }))}
        className="mb-8"
      >
        Create Emergency Contact
      </Button>

      <EmergencyContactsTable
        emergencyContacts={filteredEmergencyContacts}
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
            <DialogTitle>Create Emergency Contact</DialogTitle>
            <DialogDescription>
              Enter the details for the new emergency contact.
            </DialogDescription>
          </DialogHeader>
          <EmergencyContactForm
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
            <DialogTitle>Update Emergency Contact</DialogTitle>
            <DialogDescription>
              Make changes to the emergency contact information.
            </DialogDescription>
          </DialogHeader>
          <EmergencyContactForm
            patientId={patientId}
            onSubmit={handleUpdate}
            defaultValues={editingEmergencyContact}
            onClose={() =>
              setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
            isLoading={isEditingEmergencyContactLoading}
          />
        </DialogContent>
      </Dialog>

      <DeleteAlertDialog
        isOpen={state.isDeleteDialogOpen}
        onConfirm={confirmDelete}
        description="This action cannot be undone. This will permanently delete the emergency contact."
        onClose={() =>
          setState((prev) => ({ ...prev, isDeleteDialogOpen: false }))}
      />
    </div>
  );
};

export default React.memo(EmergencyContactsSection);
