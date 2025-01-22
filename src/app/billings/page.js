"use client";

import ProtectedRoute, {ROLES} from "@/components/ProtectedRoute";
import SideBarComponent from '@/components/SideBarComponent';
import React from "react";
import { LoadingPage } from "@/components/LoadingPage";
import ErrorComponent from "@/components/ErrorComponent";
import { useFetchBillings } from "@/hooks/useBillings";
import dynamic from "next/dynamic";

const BillingsTable = dynamic(
  () => import("@/features/billings/BillingsTable"),
  {
    loading: () => <LoadingPage />,
  },
);
const BillingCharts = dynamic(
  () => import("@/features/billings/BillingCharts"),
  {
    loading: () => <LoadingPage />,
  },
);

export default function Billings() {
  const { data: Billings = [], isPending: isLoadingBillings, error } =
    useFetchBillings();

  if (isLoadingBillings) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <ErrorComponent message="Error loading billings. Please try again later." />
    );
  }

  return (
    <ProtectedRoute roles={[ROLES.ADMIN]}>
        <SideBarComponent>
      <div className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
        <BillingsTable data={Billings} />
        <BillingCharts data={Billings} />
      </div>
        </SideBarComponent>
    </ProtectedRoute>
  );
}
