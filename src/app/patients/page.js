"use client";
import ErrorComponent from "@/components/ErrorComponent";
import SideBarComponent from "@/components/SideBarComponent";
import React, { useMemo } from "react";
import { LoadingPage } from "@/components/LoadingPage";
import ProtectedRoute, { ROLES } from "@/components/ProtectedRoute";
import { useFetchPatients } from "@/hooks/usePatients";
import dynamic from "next/dynamic";

const PatientsTable = dynamic(
  () => import("@/features/patients/patientsTable"),
  {
    loading: () => <LoadingPage />,
  },
);

export default function Patients() {
  const { data: Patients, isPending: isLoadingPatients, error } =
    useFetchPatients();

  const isLoading = useMemo(() => isLoadingPatients, [isLoadingPatients]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorComponent message="Error loading patients. Please try again later." />
    );
  }

  return (
    <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
      <SideBarComponent>
        <div className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
          <PatientsTable data={Patients} />
        </div>
      </SideBarComponent>
    </ProtectedRoute>
  );
}
