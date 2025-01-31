import {LoadingPage} from '@/components/LoadingPage';
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
		  <LoadingPage>
			  <InsuranceCompaniesPage/>
		  </LoadingPage>
	  </SideBarComponent>
  );
}
