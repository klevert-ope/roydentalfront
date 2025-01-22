"use client";

import { LoadingPage } from "@/components/LoadingPage";
import ProtectedRoute, { ROLES } from "@/components/ProtectedRoute";
import ErrorComponent from "@/components/ErrorComponent";
import SideBarComponent from "@/components/SideBarComponent";
import { useManageUsers } from "@/hooks/useUserData";
import dynamic from "next/dynamic";

const AdminUsersPage = dynamic(
  () => import("@/features/users/AdminUsersPage"),
  {
    loading: () => <LoadingPage />,
  },
);

export default function UsersPage() {
  const { data: Users, isPending, error } = useManageUsers();

  if (isPending) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorComponent message="Error loading users. Please try again later." />
    );
  }

  return (
    <ProtectedRoute roles={[ROLES.ADMIN]}>
      <SideBarComponent>
        <div className="container mx-auto px-2 w-full my-16 transition-all fade-in-60 animate-in -translate-y-3">
          <h1 className="text-center mb-8">USERS</h1>
          <AdminUsersPage users={Users} />
        </div>
      </SideBarComponent>
    </ProtectedRoute>
  );
}
