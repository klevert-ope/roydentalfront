"use client";

import ErrorBoundary from "@/components/ErrorComponent";
import {LoadingPage} from "@/components/LoadingPage";
import ProtectedRoute, {ROLES} from "@/components/ProtectedRoute";
import SideBarComponent from "@/components/SideBarComponent";
import AdminUsersPage from '@/features/users/AdminUsersPage';
import {useManageUsers} from "@/hooks/useUserData";

export default function UsersPage() {
  const { data: Users = [], isPending } = useManageUsers();

  return (
    <ErrorBoundary>
      <ProtectedRoute roles={[ROLES.ADMIN]}>
        <SideBarComponent>
          <div className="container mx-auto px-2 w-full my-16 transition-all fade-in-60 animate-in -translate-y-3">
              {isPending ? (
                  <LoadingPage/>
              ) : (
                  <>
                      <h1 className="text-center mb-8">USERS</h1>
                      <AdminUsersPage users={Users}/>
                  </>
              )}
          </div>
        </SideBarComponent>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
