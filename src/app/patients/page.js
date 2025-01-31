import {LoadingPage} from '@/components/LoadingPage';
import SideBarComponent from "@/components/SideBarComponent";
import PatientsTable from "@/features/patients/patientsTable";
import React from "react";

export const metadata = {
	title: "Patients",
};

export default function Patients() {
  return (
	  <SideBarComponent>
		  <LoadingPage>
			  <PatientsTable/>
		  </LoadingPage>
	  </SideBarComponent>
  );
}
