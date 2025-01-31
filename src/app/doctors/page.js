import {LoadingPage} from '@/components/LoadingPage';
import SideBarComponent from "@/components/SideBarComponent";
import DoctorsPage from "@/features/doctors/doctorsPage";
import React from "react";

export const metadata = {
	title: "Doctors",
};

export default function Doctors() {
  return (
	  <SideBarComponent>
		  <LoadingPage>
			  <DoctorsPage/>
		  </LoadingPage>
	  </SideBarComponent>
  );
}
