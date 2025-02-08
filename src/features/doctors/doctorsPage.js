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
import DoctorForm from "@/features/doctors/DoctorForm";
import DoctorsTable from "@/features/doctors/DoctorsTable";
import {
  useCreateDoctor,
  useDeleteDoctor,
  useFetchDoctors,
  useGetDoctorByID,
  useUpdateDoctor,
} from "@/hooks/useDoctors";
import React, {useEffect, useState} from "react";
import {toast} from "sonner";

const DoctorsPage = () => {
	const {data: doctors = []} = useFetchDoctors();
  const createDoctorMutation = useCreateDoctor();
  const updateDoctorMutation = useUpdateDoctor();
  const deleteDoctorMutation = useDeleteDoctor();

  const [state, setState] = useState({
    editingDoctorId: null,
    isCreateDialogOpen: false,
    isUpdateDialogOpen: false,
    isDeleteDialogOpen: false,
    doctorToDelete: null,
  });

  const { data: editingDoctor, isPending: isEditingDoctorLoading, refetch } =
    useGetDoctorByID(state.editingDoctorId, {
      enabled: !!state.editingDoctorId,
    });

  useEffect(() => {
    if (state.editingDoctorId) {
      refetch();
    }
  }, [state.editingDoctorId, refetch]);

  const handleCreate = (data) => {
    createDoctorMutation.mutate({ doctor: data }, {
      onSuccess: () => {
        toast.success("Doctor created successfully!");
      },
      onError: () => {
        toast.error("Failed to create the Doctor");
      },
      onSettled: () => {
        setState((prev) => ({...prev, isCreateDialogOpen: false}));
      },
    });
  };

  const handleUpdate = (data) => {
    updateDoctorMutation.mutate({ id: state.editingDoctorId, doctor: data }, {
      onSuccess: () => {
        toast.success("Doctor updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update the Doctor");
      },
      onSettled: () => {
        setState((prev) => ({
          ...prev,
          editingDoctorId: null,
          isUpdateDialogOpen: false,
        }));
      },
    });
  };

  const handleEdit = (id) => {
    setState((prev) => ({
      ...prev,
      editingDoctorId: id,
      isUpdateDialogOpen: true,
    }));
  };

  const handleDelete = (id) => {
    setState((prev) => ({
      ...prev,
      doctorToDelete: id,
      isDeleteDialogOpen: true,
    }));
  };

  const confirmDelete = () => {
    deleteDoctorMutation.mutate({ id: state.doctorToDelete }, {
      onSuccess: () => {
        toast.success("Doctor deleted successfully!");
      },
      onError: () => {
        toast.error("Failed to delete the Doctor");
      },
      onSettled: () => {
        setState((prev) => ({
          ...prev,
          isDeleteDialogOpen: false,
          doctorToDelete: null,
        }));
      },
    });
  };

  return (
    <div className={"my-16"}>
      <h1 className={"mb-8 text-center"}>DOCTORS</h1>
      <Button
        className={"mb-4"}
        onClick={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: true }))}
      >
        Create Doctor
      </Button>
      <DoctorsTable
        doctors={doctors}
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
            <DialogTitle>Create Doctor</DialogTitle>
            <DialogDescription>
              Enter the details for the new doctor.
            </DialogDescription>
          </DialogHeader>
          <DoctorForm
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
            <DialogTitle>Update Doctor</DialogTitle>
            <DialogDescription>
              Make changes to the doctor's information.
            </DialogDescription>
          </DialogHeader>
          <DoctorForm
            onSubmit={handleUpdate}
            defaultValues={editingDoctor}
            onClose={() =>
              setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
            isLoading={isEditingDoctorLoading}
          />
        </DialogContent>
      </Dialog>

      <DeleteAlertDialog
        isOpen={state.isDeleteDialogOpen}
        onConfirm={confirmDelete}
        description={"This action cannot be undone. This will permanently delete the Doctor."}
        onClose={() =>
          setState((prev) => ({ ...prev, isDeleteDialogOpen: false }))}
      />
    </div>
  );
};

export default DoctorsPage;
