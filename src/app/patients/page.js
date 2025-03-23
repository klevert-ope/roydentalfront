import {AnimatePage} from '@/components/AnimatePage';
import SideBarComponent from "@/components/SideBarComponent";
import PatientsTable from "@/features/patients/patientsTable";
import React from "react";

export const metadata = {
	title: "Patients",
};

export default function Patients() {
  return (
	  <SideBarComponent>
		  <AnimatePage>
			  <PatientsTable/>
		  </AnimatePage>
	  </SideBarComponent>
  );
}
