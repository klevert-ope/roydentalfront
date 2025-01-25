"use client";
import ErrorBoundary from "@/components/ErrorComponent";
import {LoadingPage} from "@/components/LoadingPage";
import ProtectedRoute, {ROLES} from "@/components/ProtectedRoute";
import SideBarComponent from "@/components/SideBarComponent";
import BillingCharts from "@/features/billings/BillingCharts";
import BillingsTable from "@/features/billings/BillingsTable";
import {useFetchBillings} from "@/hooks/useBillings";
import React from "react";

export default function Billings() {
    const {
        data: Billings = [],
        isPending: isLoadingBillings
    } = useFetchBillings();

    return (
        <ErrorBoundary>
            <ProtectedRoute roles={[ROLES.ADMIN]}>
                <SideBarComponent>
                    <div
                        className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
                        {isLoadingBillings ? (
                            <LoadingPage/>
                        ) : (
                            <>
                                <BillingsTable data={Billings}/>
                                <BillingCharts data={Billings}/>
                            </>
                        )}
                    </div>
                </SideBarComponent>
            </ProtectedRoute>
        </ErrorBoundary>
    );
}
