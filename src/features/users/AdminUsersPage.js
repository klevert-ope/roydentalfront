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
import CreateUserForm from "@/features/users/CreateUserForm";
import AdminUsersTable from "@/features/users/UsersTable";
import {
    useCreateUser,
    useDeleteUser,
    useManageUsers,
} from "@/hooks/useUserData";
import React, {useCallback, useState} from "react";
import toast from "react-hot-toast";

const AdminUsersPage = () => {
	const {data: users = []} = useManageUsers();
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();

  const [state, setState] = useState({
    isCreateDialogOpen: false,
    isDeleteDialogOpen: false,
    userToDelete: null,
  });

  const handleCreate = useCallback((data) => {
    createUserMutation.mutate(
      { userData: data },
      {
        onSuccess: () => {
          toast.success("User created successfully!");
          setState((prev) => ({ ...prev, isCreateDialogOpen: false }));
        },
        onError: () => {
          toast.error("Failed to create the user");
        },
      },
    );
  }, [createUserMutation]);

  const handleDelete = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      userToDelete: id,
      isDeleteDialogOpen: true,
    }));
  }, []);

  const confirmDelete = useCallback(() => {
    deleteUserMutation.mutate(
      { id: state.userToDelete },
      {
        onSuccess: () => {
          toast.success("User deleted successfully");
          setState((prev) => ({
            ...prev,
            isDeleteDialogOpen: false,
            userToDelete: null,
          }));
        },
        onError: () => {
          toast.error("Failed to delete the user");
        },
      },
    );
  }, [deleteUserMutation, state.userToDelete]);

  return (
    <div>
      <Button
        className="mb-4"
        onClick={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: true }))}
      >
        Create User
      </Button>
      <AdminUsersTable users={users} onDelete={handleDelete} />

      <Dialog
        open={state.isCreateDialogOpen}
        onOpenChange={() =>
          setState((prev) => ({ ...prev, isCreateDialogOpen: false }))}
      >
        <DialogContent className="w-11/12 sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
              Enter the details for the new user.
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm
            onSubmit={handleCreate}
            onClose={() =>
              setState((prev) => ({ ...prev, isCreateDialogOpen: false }))}
          />
        </DialogContent>
      </Dialog>

      <DeleteAlertDialog
        isOpen={state.isDeleteDialogOpen}
        onConfirm={confirmDelete}
        description={"This action cannot be undone. This will permanently delete the user."}
        onClose={() =>
          setState((prev) => ({ ...prev, isDeleteDialogOpen: false }))}
      />
    </div>
  );
};

export default AdminUsersPage;
