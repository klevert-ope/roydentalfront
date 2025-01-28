import ErrorBoundary from "@/components/ErrorComponent";
import SideBarComponent from "@/components/SideBarComponent";
import AppointmentsSection
    from "@/features/patient/PAppointments/AppointmentSection";
import BillingSection from "@/features/patient/PBillings/BillingSection";
import PatientsAction from "@/features/patient/PDetails/PatientActions";
import PatientDetails from "@/features/patient/PDetails/patientDetails";
import EmergencyContactsSection
    from "@/features/patient/PEmergencyContacts/EmergencyContactSection";
import ExaminationSection
    from "@/features/patient/PExaminations/ExaminationSection";
import TreatmentPlanSection
    from "@/features/patient/PTreatmentPlans/TreatmentPlanSection";
import React from "react";

export const metadata = {
    title: "Patient",
};
export default function Patient() {
  return (
    <ErrorBoundary>
        <SideBarComponent>
            <div
                className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
                <h1 className="text-center mb-8">PATIENT INFORMATION</h1>
                <PatientsAction/>
                <PatientDetails/>
                <EmergencyContactsSection/>
                <AppointmentsSection/>
                <ExaminationSection/>
                <TreatmentPlanSection/>
                <BillingSection/>
            </div>
        </SideBarComponent>
    </ErrorBoundary>
  );
}
