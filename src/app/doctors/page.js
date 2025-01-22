"use client";

import ProtectedRoute, {ROLES}  from "@/components/ProtectedRoute";
import SideBarComponent from '@/components/SideBarComponent';
import React from "react";
import { LoadingPage } from "@/components/LoadingPage";
import ErrorComponent from "@/components/ErrorComponent";
import { useFetchDoctors } from "@/hooks/useDoctors";
import dynamic from "next/dynamic";

const DoctorsPage = dynamic(() => import("@/features/doctors/doctorsPage"), {
  loading: () => <LoadingPage />,
});

export default function Doctors() {
  const { data: Doctors, isLoading: isDoctorsLoading, error } =
    useFetchDoctors();

  if (isDoctorsLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorComponent message="Error loading doctors. Please try again later." />
    );
  }

  return (
    <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
      <SideBarComponent>
      <div className="container mx-auto px-2 w-full my-14">
        <DoctorsPage doctors={Doctors} />
      </div>
      </SideBarComponent>
    </ProtectedRoute>
  );
}
