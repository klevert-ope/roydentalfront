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
import BillingForm from "@/features/patient/PBillings/BillingForm";
import BillingsTable from "@/features/patient/PBillings/BillingTable";
import {
  useCreateBilling,
  useDeleteBilling,
  useFetchBillings,
  useGetBillingByID,
  useUpdateBilling,
} from "@/hooks/useBillings";
import {useParams} from "next/navigation";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";

const BillingSection = () => {
  const {patientId} = useParams();
  const {data: billings = []} = useFetchBillings();
  const createBillingMutation = useCreateBilling();
  const updateBillingMutation = useUpdateBilling();
  const deleteBillingMutation = useDeleteBilling();

  const [state, setState] = useState({
    editingBillingId: null,
    isCreateDialogOpen: false,
    isUpdateDialogOpen: false,
    isDeleteDialogOpen: false,
    billingToDelete: null,
  });

  const {
    data: editingBilling,
    isPending: isEditingBillingLoading,
    refetch,
  } = useGetBillingByID(state.editingBillingId, {
    enabled: !!state.editingBillingId,
  });

  useEffect(() => {
    if (state.editingBillingId) {
      refetch();
    }
  }, [state.editingBillingId, refetch]);

  const filteredBillings = useMemo(
    () => billings?.filter((billing) => billing.patient_id === patientId) || [],
    [billings, patientId],
  );

  const handleCreate = useCallback((data) => {
    createBillingMutation.mutate({ billing: data, patient_id: patientId }, {
      onSuccess: () => {
        toast.success("Bill created successfully!");
        setState((prev) => ({ ...prev, isCreateDialogOpen: false }));
      },
      onError: () => {
        toast.error("Failed to create the bill");
      },
    });
  }, [createBillingMutation, patientId]);

  const handleUpdate = useCallback((data) => {
    updateBillingMutation.mutate({
      id: state.editingBillingId,
      billing: data,
    }, {
      onSuccess: () => {
        toast.success("Bill updated successfully!");
        setState((prev) => ({
          ...prev,
          editingBillingId: null,
          isUpdateDialogOpen: false,
        }));
      },
      onError: () => {
        toast.error("Failed to update the bill");
      },
    });
  }, [updateBillingMutation, state.editingBillingId]);

  const handleEdit = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      editingBillingId: id,
      isUpdateDialogOpen: true,
    }));
  }, []);

  const handleDelete = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      billingToDelete: id,
      isDeleteDialogOpen: true,
    }));
  }, []);

  const confirmDelete = useCallback(() => {
    deleteBillingMutation.mutate({ id: state.billingToDelete }, {
      onSuccess: () => {
        toast.success("Bill deleted successfully!");
        setState((prev) => ({
          ...prev,
          isDeleteDialogOpen: false,
          billingToDelete: null,
        }));
      },
      onError: () => {
        toast.error("Failed to delete the bill");
      },
    });
  }, [deleteBillingMutation, state.billingToDelete]);

  return (
    <div className={"my-16"}>
      <h2 className="text-center mb-8">BILLINGS</h2>
      <Button
        onClick={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: true }))}
        className="mb-8"
      >
        Create Bill
      </Button>

      <BillingsTable
        billings={filteredBillings}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create Billing Dialog */}
      <Dialog
        open={state.isCreateDialogOpen}
        onOpenChange={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: false }))}
      >
        <DialogContent className="w-11/12 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Billing</DialogTitle>
            <DialogDescription>
              Enter the details for the new billing.
            </DialogDescription>
          </DialogHeader>
          <BillingForm
            patientId={patientId}
            onSubmit={handleCreate}
            onClose={() =>
              setState((prev) => ({ ...prev, isCreateDialogOpen: false }))}
          />
        </DialogContent>
      </Dialog>

      {/* Update Billing Dialog */}
      <Dialog
        open={state.isUpdateDialogOpen}
        onOpenChange={() =>
          setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
      >
        <DialogContent className="w-11/12 sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Update Billing</DialogTitle>
            <DialogDescription>
              Make changes to the billing information.
            </DialogDescription>
          </DialogHeader>
          <BillingForm
            patientId={patientId}
            onSubmit={handleUpdate}
            defaultValues={editingBilling}
            onClose={() =>
              setState((prev) => ({ ...prev, isUpdateDialogOpen: false }))}
            isLoading={isEditingBillingLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Billing Confirmation Dialog */}
      <DeleteAlertDialog
        isOpen={state.isDeleteDialogOpen}
        onConfirm={confirmDelete}
        description="This action cannot be undone. This will permanently delete the bill."
        onClose={() =>
          setState((prev) => ({ ...prev, isDeleteDialogOpen: false }))}
      />
    </div>
  );
};

export default React.memo(BillingSection);
