"use client";
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
import ErrorComponent from "@/components/ErrorComponent";
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

  const { data: Patient, isPending: isLoadingPatient, error: patientError } =
    useGetPatientByID(patientId);
  const {
    data: EmergencyContacts = [],
    isPending: isLoadingEmergencyContacts,
    error: emergencyContactsError,
  } = useFetchEmergencyContacts();
  const {
    data: Appointments,
    isPending: isLoadingAppointments,
    error: appointmentsError,
  } = useFetchAppointments();
  const {
    data: Examinations,
    isPending: isLoadingExaminations,
    error: examinationsError,
  } = useFetchExaminations();
  const {
    data: TreatmentPlans,
    isPending: isLoadingTreatmentPlans,
    error: treatmentPlansError,
  } = useFetchTreatmentPlans();
  const { data: Billings, isPending: isLoadingBillings, error: billingsError } =
    useFetchBillings();

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

  const hasError = useMemo(() => (
    patientError || emergencyContactsError || appointmentsError ||
    examinationsError || treatmentPlansError || billingsError
  ), [
    patientError,
    emergencyContactsError,
    appointmentsError,
    examinationsError,
    treatmentPlansError,
    billingsError,
  ]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (hasError) {
    return (
      <ErrorComponent message="Error loading patient information. Please try again later." />
    );
  }

  return (
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
  );
}
