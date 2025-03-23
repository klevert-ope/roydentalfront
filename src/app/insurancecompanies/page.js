import {AnimatePage} from '@/components/AnimatePage';
import SideBarComponent from "@/components/SideBarComponent";
import InsuranceCompaniesPage
	from "@/features/insurancecompanies/insuranceCompaniesPage";
import React from "react";

export const metadata = {
	title: "Insurance Companies",
};

export default function InsuranceCompanies() {
  return (
	  <SideBarComponent>
		  <AnimatePage>
			  <InsuranceCompaniesPage/>
		  </AnimatePage>
	  </SideBarComponent>
  );
}
