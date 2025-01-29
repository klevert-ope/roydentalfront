import SideBarComponent from "@/components/SideBarComponent";
import DoctorsPage from "@/features/doctors/doctorsPage";
import React from "react";

export const metadata = {
	title: "Doctors",
};

export default function Doctors() {
  return (
	  <SideBarComponent>
		  <div className="container mx-auto px-2 w-full my-14">
			  <DoctorsPage/>
		  </div>
	  </SideBarComponent>
  );
}
