import SideBarComponent from "@/components/SideBarComponent";
import {PatientSubDetails} from "@/features/patient/PatientSubDetails";
import PatientsAction from "@/features/patient/PDetails/PatientActions";
import PatientDetails from "@/features/patient/PDetails/patientDetails";
import React from "react";

export const metadata = {
    title: "Patient",
};

export default function Patient() {
  return (
      <SideBarComponent>
          <div
              className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
              <h1 className="text-center mb-8">PATIENT INFORMATION</h1>
              <PatientsAction/>
              <PatientDetails/>
              <PatientSubDetails/>
          </div>
      </SideBarComponent>
  );
}
