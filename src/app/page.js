"use client";

import ErrorBoundary from "@/components/ErrorComponent";
import ProtectedRoute, { ROLES } from "@/components/ProtectedRoute";
import SideBarComponent from "@/components/SideBarComponent";
import React, { useMemo } from "react";
import { LoadingPage } from "@/components/LoadingPage";
import { useFetchAppointments } from "@/hooks/useAppointments";
import { useFetchPatients } from "@/hooks/usePatients";
import dynamic from "next/dynamic";

const AppointmentsToday = dynamic(
  () => import("@/features/patient/PAppointments/AppointmentsToday"),
  {
    loading: () => <LoadingPage />,
  },
);
const PatientsCharts = dynamic(
  () => import("@/features/patients/PatientsCharts"),
  {
    loading: () => <LoadingPage />,
  },
);

export default function Home() {
  const {
    data: Appointments = [],
    isPending: isLoadingAppointments,
  } = useFetchAppointments();
  const {
    data: Patients = [],
    isPending: isLoadingPatients,
  } = useFetchPatients();

  const isLoading = useMemo(() => (
    isLoadingAppointments || isLoadingPatients
  ), [isLoadingAppointments, isLoadingPatients]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <ErrorBoundary>
      <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
        <SideBarComponent>
          <div className="container mx-auto px-2 w-full my-16 transition-all fade-in-60 animate-in -translate-y-3">
            <h1 className="text-center mb-8">RADIANT GLOW DENTAL CLINIC</h1>
            <AppointmentsToday data={Appointments} />
            <PatientsCharts data={Patients} />
          </div>
        </SideBarComponent>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
