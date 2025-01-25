"use client";

import ErrorBoundary from "@/components/ErrorComponent";
import {LoadingPage} from "@/components/LoadingPage";
import ProtectedRoute, {ROLES} from "@/components/ProtectedRoute";
import SideBarComponent from "@/components/SideBarComponent";
import InsuranceCompaniesPage
  from "@/features/insurancecompanies/insuranceCompaniesPage";
import {useFetchInsuranceCompanies} from "@/hooks/useInsuranceCompanies";
import React from "react";

export default function InsuranceCompanies() {
  const {
    data: InsuranceCompanies,
    isPending: isLoadingInsuranceCompanies,
  } = useFetchInsuranceCompanies();

  return (
    <ErrorBoundary>
      <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
        <SideBarComponent>
          <div className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
            {isLoadingInsuranceCompanies ? (
                <LoadingPage/>
            ) : (
                <InsuranceCompaniesPage
                    insuranceCompanies={InsuranceCompanies}/>
            )}
          </div>
        </SideBarComponent>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
