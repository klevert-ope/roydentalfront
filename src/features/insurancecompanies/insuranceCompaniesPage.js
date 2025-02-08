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
import InsuranceCompaniesTable
  from "@/features/insurancecompanies/InsuranceCompaniesTable";
import InsuranceCompanyForm
  from "@/features/insurancecompanies/InsuranceCompanyForm";
import {
  useCreateInsuranceCompany,
  useDeleteInsuranceCompany,
  useFetchInsuranceCompanies,
  useGetInsuranceCompanyByID,
  useUpdateInsuranceCompany,
} from "@/hooks/useInsuranceCompanies";
import React, {useCallback, useEffect, useState} from "react";
import {toast} from "sonner";

const InsuranceCompaniesPage = () => {
	const {data: insuranceCompanies = []} = useFetchInsuranceCompanies();
  const createInsuranceCompanyMutation = useCreateInsuranceCompany();
  const updateInsuranceCompanyMutation = useUpdateInsuranceCompany();
  const deleteInsuranceCompanyMutation = useDeleteInsuranceCompany();

  const [state, setState] = useState({
    editingInsuranceCompanyId: null,
    isCreateDialogOpen: false,
    isUpdateDialogOpen: false,
    isDeleteDialogOpen: false,
    insuranceCompanyToDelete: null,
  });

  const {
    data: editingInsuranceCompany,
    isPending: isEditingInsuranceCompanyLoading,
    refetch,
  } = useGetInsuranceCompanyByID(state.editingInsuranceCompanyId, {
    enabled: !!state.editingInsuranceCompanyId,
  });

  useEffect(() => {
    if (state.editingInsuranceCompanyId) {
      refetch();
    }
  }, [state.editingInsuranceCompanyId, refetch]);

  const handleCreate = useCallback((data) => {
    createInsuranceCompanyMutation.mutate({ insuranceCompany: data }, {
      onSuccess: () => {
        toast.success("Company created successfully!");
      },
      onError: () => {
        toast.error("Failed to create the company");
      },
      onSettled: () => {
        setState((prev) => ({...prev, isCreateDialogOpen: false}));
      },
    });
  }, [createInsuranceCompanyMutation]);

  const handleUpdate = useCallback((data) => {
    updateInsuranceCompanyMutation.mutate({
      id: state.editingInsuranceCompanyId,
      insuranceCompany: data,
    }, {
      onSuccess: () => {
        toast.success("Company updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update the company");
      },
      onSettled: () => {
        setState((prev) => ({
          ...prev,
          editingInsuranceCompanyId: null,
          isUpdateDialogOpen: false,
        }));
      },
    });
  }, [updateInsuranceCompanyMutation, state.editingInsuranceCompanyId]);

  const handleEdit = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      editingInsuranceCompanyId: id,
      isUpdateDialogOpen: true,
    }));
  }, []);

  const handleDelete = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      insuranceCompanyToDelete: id,
      isDeleteDialogOpen: true,
    }));
  }, []);

  const confirmDelete = useCallback(() => {
    deleteInsuranceCompanyMutation.mutate({
      id: state.insuranceCompanyToDelete,
    }, {
      onSuccess: () => {
        toast.success("Company deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete the company");
      },
      onSettled: () => {
        setState((prev) => ({
          ...prev,
          isDeleteDialogOpen: false,
          insuranceCompanyToDelete: null,
        }));
      },
    });
  }, [deleteInsuranceCompanyMutation, state.insuranceCompanyToDelete]);

  return (
    <div className={"my-16"}>
      <h1 className={"mb-8 text-center"}>
        INSURANCE COMPANIES
      </h1>
      <Button
        className={"mb-4"}
        onClick={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: true }))}
      >
        Create Insurance Company
      </Button>
      <InsuranceCompaniesTable
        insuranceCompanies={insuranceCompanies}
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
            <DialogTitle>Create Insurance Company</DialogTitle>
            <DialogDescription>
              Enter the details for the new insurance company.
            </DialogDescription>
          </DialogHeader>
          <InsuranceCompanyForm
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
            <DialogTitle>Update Insurance Company</DialogTitle>
            <DialogDescription>
              Make changes to the insurance company's information.
            </DialogDescription>
          </DialogHeader>
          <InsuranceCompanyForm
            onSubmit={handleUpdate}
            defaultValues={editingInsuranceCompany}
            onClose={() =>
              setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
            isLoading={isEditingInsuranceCompanyLoading}
          />
        </DialogContent>
      </Dialog>

      <DeleteAlertDialog
        isOpen={state.isDeleteDialogOpen}
        onConfirm={confirmDelete}
        description={"This action cannot be undone. This will permanently delete the Insurance Company."}
        onClose={() =>
          setState((prev) => ({ ...prev, isDeleteDialogOpen: false }))}
      />
    </div>
  );
};

export default InsuranceCompaniesPage;
