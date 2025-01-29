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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PatientUpForm from "@/features/patient/PDetails/PatientUpForm";
import {
  useDeleteAllPatientData,
  useDeletePatient,
  useGetPatientByID,
  useUpdatePatient,
} from "@/hooks/usePatients";
import {Ellipsis} from "lucide-react";
import {useParams, useRouter} from "next/navigation";
import React, {useCallback, useState} from "react";
import toast from "react-hot-toast";

const PatientsAction = () => {
	const {patientId} = useParams();
	const {data: editingPatient = []} = useGetPatientByID(patientId);
  const router = useRouter();
  const updatePatientMutation = useUpdatePatient();
  const deletePatientMutation = useDeletePatient();
  const deleteAllPatientDataMutation = useDeleteAllPatientData();

  const [state, setState] = useState({
    editingPatientId: null,
    isUpdateDialogOpen: false,
    isDeleteDialogOpen: false,
    patientToDelete: null,
    isDeleteAllDataDialogOpen: false,
    patientToDeleteAllData: null,
  });

  const handleUpdate = useCallback((data) => {
    updatePatientMutation.mutate({
      patient_id: state.editingPatientId,
      patientData: data,
    }, {
      onSuccess: () => {
        toast.success("Patient details updated successfully!");
        resetState();
      },
      onError: () => {
        toast.error("Failed to update the patient details");
      },
    });
  }, [updatePatientMutation, state.editingPatientId]);

  const handleEdit = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      editingPatientId: id,
      isUpdateDialogOpen: true,
    }));
  }, []);

  const handleDelete = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      patientToDelete: id,
      isDeleteDialogOpen: true,
    }));
  }, []);

  const handleDeleteAllData = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      patientToDeleteAllData: id,
      isDeleteAllDataDialogOpen: true,
    }));
  }, []);

  const confirmDelete = useCallback(() => {
    deletePatientMutation.mutate({ patient_id: state.patientToDelete }, {
      onSuccess: () => {
        toast.success("Patient details deleted successfully!");
        router.push("/patients");
        resetState();
      },
      onError: () => {
        toast.error("Failed to delete patient details");
      },
    });
  }, [deletePatientMutation, state.patientToDelete]);

  const confirmDeleteAllData = useCallback(() => {
    deleteAllPatientDataMutation.mutate({
      patient_id: state.patientToDeleteAllData,
    }, {
      onSuccess: () => {
        toast.success(
          "Patient details and all related data deleted successfully!",
        );
        router.push("/patients");
        resetState();
      },
      onError: () => {
        toast.error(
          "Failed to delete patient details and related data",
        );
      },
    });
  }, [deleteAllPatientDataMutation, state.patientToDeleteAllData]);

  const resetState = useCallback(() => {
    setState({
      editingPatientId: null,
      isUpdateDialogOpen: false,
      isDeleteDialogOpen: false,
      patientToDelete: null,
      isDeleteAllDataDialogOpen: false,
      patientToDeleteAllData: null,
    });
  }, []);

  return (
    <div>
      <div className={"my-4 w-full flex justify-end"}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Ellipsis color={"var(--primary)"} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={"w-56 mr-2"}>
            <DropdownMenuLabel>Patient Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                variant="ghost"
                onClick={() => handleEdit(editingPatient.id)}
                className={"w-full"}
              >
                Edit Patient Info
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                onClick={() => handleDelete(editingPatient.id)}
                className={"w-full"}
              >
                Delete Patient Info
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="ghost"
                onClick={() => handleDeleteAllData(editingPatient.id)}
                className={"w-full"}
              >
                Delete All Patient Data
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog
        open={state.isUpdateDialogOpen}
        onOpenChange={() =>
          setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
      >
        <DialogContent className="w-11/12 sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Update Patient</DialogTitle>
            <DialogDescription>
              Make changes to the patient's information.
            </DialogDescription>
          </DialogHeader>
          <PatientUpForm
            onSubmit={handleUpdate}
            defaultValues={editingPatient}
            onClose={() =>
              setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
          />
        </DialogContent>
      </Dialog>

      <DeleteAlertDialog
        isOpen={state.isDeleteDialogOpen}
        onConfirm={confirmDelete}
        description={"This action cannot be undone. This will permanently delete the Patient information."}
        onClose={() =>
          setState((prev) => ({ ...prev, isDeleteDialogOpen: false }))}
      />
      <DeleteAlertDialog
        isOpen={state.isDeleteAllDataDialogOpen}
        onConfirm={confirmDeleteAllData}
        description={"This action cannot be undone. This will permanently delete the Patient information and all the related data."}
        onClose={() =>
          setState((prev) => ({ ...prev, isDeleteAllDataDialogOpen: false }))}
      />
    </div>
  );
};

export default React.memo(PatientsAction);
