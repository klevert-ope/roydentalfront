"use client";

import ProtectedRoute, { ROLES } from "@/components/ProtectedRoute";
import SideBarComponent from "@/components/SideBarComponent";
import React from "react";
import { LoadingPage } from "@/components/LoadingPage";
import ErrorComponent from "@/components/ErrorComponent";
import { useFetchInsuranceCompanies } from "@/hooks/useInsuranceCompanies";
import dynamic from "next/dynamic";

const InsuranceCompaniesPage = dynamic(
  () => import("@/features/insurancecompanies/insuranceCompaniesPage"),
  {
    loading: () => <LoadingPage />,
  },
);

export default function InsuranceCompanies() {
  const {
    data: InsuranceCompanies,
    isPending: isLoadingInsuranceCompanies,
    error,
  } = useFetchInsuranceCompanies();

  if (isLoadingInsuranceCompanies) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorComponent message="Error loading insurance companies. Please try again later." />
    );
  }

  return (
    <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
      <SideBarComponent>
        <div className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
          <InsuranceCompaniesPage insuranceCompanies={InsuranceCompanies} />
        </div>
      </SideBarComponent>
    </ProtectedRoute>
  );
}
