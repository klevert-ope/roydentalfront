"use client";
import ErrorBoundary from "@/components/ErrorComponent";
import {LoadingPage} from "@/components/LoadingPage";
import ProtectedRoute, {ROLES} from "@/components/ProtectedRoute";
import SideBarComponent from "@/components/SideBarComponent";
import AppointmentsSection
  from '@/features/patient/PAppointments/AppointmentSection';
import BillingSection from '@/features/patient/PBillings/BillingSection';
import PatientsAction from '@/features/patient/PDetails/PatientActions';
import PatientDetails from '@/features/patient/PDetails/patientDetails';
import EmergencyContactsSection
  from '@/features/patient/PEmergencyContacts/EmergencyContactSection';
import ExaminationSection
  from '@/features/patient/PExaminations/ExaminationSection';
import TreatmentPlanSection
  from '@/features/patient/PTreatmentPlans/TreatmentPlanSection';
import {useFetchAppointments} from "@/hooks/useAppointments";
import {useFetchBillings} from "@/hooks/useBillings";
import {useFetchEmergencyContacts} from "@/hooks/useEmergencyContacts";
import {useFetchExaminations} from "@/hooks/useExaminations";
import {useGetPatientByID} from "@/hooks/usePatients";
import {useFetchTreatmentPlans} from "@/hooks/useTreatmentPlans";
import {useParams} from "next/navigation";
import React, {useMemo} from "react";

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

  return (
    <ErrorBoundary>
      <ProtectedRoute roles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.RECEPTIONIST]}>
        <SideBarComponent>
          <div className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
            {isLoading ? (
                <LoadingPage/>
            ) : (
                <>
                  <h1 className="text-center mb-8">PATIENT INFORMATION</h1>
                  <PatientsAction editingPatient={Patient}/>
                  <PatientDetails data={Patient}/>
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
                  <BillingSection billings={Billings} patientId={patientId}/>
                </>
            )}
          </div>
        </SideBarComponent>
      </ProtectedRoute>
    </ErrorBoundary>
  );
}
