"use client";

import ErrorBoundary from "@/components/ErrorComponent";
import {LoadingPage} from "@/components/LoadingPage";
import ProtectedRoute, {ROLES} from "@/components/ProtectedRoute";
import SideBarComponent from "@/components/SideBarComponent";
import AppointmentsToday
  from '@/features/patient/PAppointments/AppointmentsToday';
import PatientsCharts from '@/features/patients/PatientsCharts';
import {useFetchAppointments} from "@/hooks/useAppointments";
import {useFetchPatients} from "@/hooks/usePatients";
import React, {useMemo} from "react";

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

  return (
    <ErrorBoundary>
      <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
        <SideBarComponent>
          <div className="container mx-auto px-2 w-full my-16 transition-all fade-in-60 animate-in -translate-y-3">
            {isLoading ? (
                <LoadingPage/>
            ) : (
                <>
                  <h1 className="text-center mb-8">RADIANT GLOW DENTAL
                    CLINIC</h1>
                  <AppointmentsToday data={Appointments}/>
                  <PatientsCharts data={Patients}/>
                </>
            )}
          </div>
        </SideBarComponent>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
