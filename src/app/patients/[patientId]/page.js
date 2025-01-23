"use client";
import ErrorBoundary from "@/components/ErrorComponent";
import ProtectedRoute, { ROLES } from "@/components/ProtectedRoute";
import SideBarComponent from "@/components/SideBarComponent";
import React, { useMemo } from "react";
import { useFetchEmergencyContacts } from "@/hooks/useEmergencyContacts";
import { useGetPatientByID } from "@/hooks/usePatients";
import { useFetchAppointments } from "@/hooks/useAppointments";
import { useFetchExaminations } from "@/hooks/useExaminations";
import { useFetchTreatmentPlans } from "@/hooks/useTreatmentPlans";
import { useFetchBillings } from "@/hooks/useBillings";
import { useParams } from "next/navigation";
import { LoadingPage } from "@/components/LoadingPage";
import dynamic from "next/dynamic";

const PatientsAction = dynamic(
  () => import("@/features/patient/PDetails/PatientActions"),
  {
    loading: () => <LoadingPage />,
  },
);
const PatientDetails = dynamic(
  () => import("@/features/patient/PDetails/patientDetails"),
  {
    loading: () => <LoadingPage />,
  },
);
const AppointmentsSection = dynamic(
  () => import("@/features/patient/PAppointments/AppointmentSection"),
  {
    loading: () => <LoadingPage />,
  },
);
const BillingSection = dynamic(
  () => import("@/features/patient/PBillings/BillingSection"),
  {
    loading: () => <LoadingPage />,
  },
);
const EmergencyContactsSection = dynamic(
  () => import("@/features/patient/PEmergencyContacts/EmergencyContactSection"),
  {
    loading: () => <LoadingPage />,
  },
);
const ExaminationSection = dynamic(
  () => import("@/features/patient/PExaminations/ExaminationSection"),
  {
    loading: () => <LoadingPage />,
  },
);
const TreatmentPlanSection = dynamic(
  () => import("@/features/patient/PTreatmentPlans/TreatmentPlanSection"),
  {
    loading: () => <LoadingPage />,
  },
);

export default function Patient() {
  const { patientId } = useParams();

  const { data: Patient, isPending: isLoadingPatient } = useGetPatientByID(
    patientId,
  );
  const {
    data: EmergencyContacts = [],
    isPending: isLoadingEmergencyContacts,
  } = useFetchEmergencyContacts();
  const {
    data: Appointments,
    isPending: isLoadingAppointments,
  } = useFetchAppointments();
  const {
    data: Examinations,
    isPending: isLoadingExaminations,
  } = useFetchExaminations();
  const {
    data: TreatmentPlans,
    isPending: isLoadingTreatmentPlans,
  } = useFetchTreatmentPlans();
  const { data: Billings, isPending: isLoadingBillings } = useFetchBillings();

  const isLoading = useMemo(() => (
    isLoadingPatient || isLoadingEmergencyContacts || isLoadingAppointments ||
    isLoadingExaminations || isLoadingTreatmentPlans || isLoadingBillings
  ), [
    isLoadingPatient,
    isLoadingEmergencyContacts,
    isLoadingAppointments,
    isLoadingExaminations,
    isLoadingTreatmentPlans,
    isLoadingBillings,
  ]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <ErrorBoundary>
      <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
        <SideBarComponent>
          <div className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
            <h1 className="text-center mb-8">PATIENT INFORMATION</h1>
            <PatientsAction editingPatient={Patient} />
            <PatientDetails data={Patient} />
            <EmergencyContactsSection
              emergencyContacts={EmergencyContacts}
              patientId={patientId}
            />
            <AppointmentsSection
              appointments={Appointments}
              patientId={patientId}
            />
            <ExaminationSection
              examinations={Examinations}
              patientId={patientId}
            />
            <TreatmentPlanSection
              treatmentPlans={TreatmentPlans}
              patientId={patientId}
            />
            <BillingSection billings={Billings} patientId={patientId} />
          </div>
        </SideBarComponent>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
