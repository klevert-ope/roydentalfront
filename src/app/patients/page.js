import ErrorBoundary from "@/components/ErrorComponent";
import SideBarComponent from "@/components/SideBarComponent";
import PatientsTable from "@/features/patients/patientsTable";
import React from "react";

export const metadata = {
    title: "Patients",
};

export default function Patients() {
  return (
    <ErrorBoundary>
        <SideBarComponent>
            <div
                className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
                <PatientsTable/>
            </div>
        </SideBarComponent>
    </ErrorBoundary>
  );
}
