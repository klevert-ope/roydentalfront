"use client"
import ErrorBoundary from "@/components/ErrorComponent";
import {LoadingPage} from "@/components/LoadingPage";
import ProtectedRoute, {ROLES} from "@/components/ProtectedRoute";
import SideBarComponent from "@/components/SideBarComponent";
import PatientsTable from "@/features/patients/patientsTable";
import {useFetchPatients} from "@/hooks/usePatients";
import React from "react";

export default function Patients() {
  const { data: Patients, isPending: isLoadingPatients } = useFetchPatients();

  return (
    <ErrorBoundary>
      <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
        <SideBarComponent>
          <div className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
              {isLoadingPatients ? (
                  <LoadingPage/>
              ) : (
                  <PatientsTable data={Patients}/>
              )}
          </div>
        </SideBarComponent>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
