import {AnimatePage} from '@/components/AnimatePage';
import SideBarComponent from "@/components/SideBarComponent";
import DoctorsPage from "@/features/doctors/doctorsPage";
import React from "react";

export const metadata = {
	title: "Doctors",
};

export default function Doctors() {
  return (
	  <SideBarComponent>
		  <AnimatePage>
			  <DoctorsPage/>
		  </AnimatePage>
	  </SideBarComponent>
  );
}
