"use client";

import ErrorBoundary from "@/components/ErrorComponent";
import {LoadingPage} from "@/components/LoadingPage";
import ProtectedRoute, {ROLES} from "@/components/ProtectedRoute";
import SideBarComponent from "@/components/SideBarComponent";
import DoctorsPage from "@/features/doctors/doctorsPage";
import {useFetchDoctors} from "@/hooks/useDoctors";
import React from "react";

export default function Doctors() {
  const { data: Doctors, isLoading: isDoctorsLoading } = useFetchDoctors();

  return (
    <ErrorBoundary>
      <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
        <SideBarComponent>
          <div className="container mx-auto px-2 w-full my-14">
            {isDoctorsLoading ? (
                <LoadingPage/>
            ) : (
                <DoctorsPage doctors={Doctors}/>
            )}
          </div>
        </SideBarComponent>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
