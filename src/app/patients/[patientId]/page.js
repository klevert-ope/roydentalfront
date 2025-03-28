import {AnimatePage} from '@/components/AnimatePage';
import SideBarComponent from "@/components/SideBarComponent";
import {PatientSubDetails} from "@/features/patient/PatientSubDetails";
import PatientsAction from "@/features/patient/PDetails/PatientActions";
import PatientDetails from "@/features/patient/PDetails/patientDetails";
import React from "react";

export const metadata = {
	title: "Patient Details",
};

export default function Patient() {
  return (
	  <SideBarComponent>
		  <AnimatePage>
			  <h1 className="text-center mb-8">PATIENT INFORMATION</h1>
			  <PatientsAction/>
			  <PatientDetails/>
			  <PatientSubDetails/>
		  </AnimatePage>
	  </SideBarComponent>
  );
}
