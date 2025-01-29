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
          <div
              className="container mx-auto px-2 w-full my-14 transition-all fade-in-60 animate-in -translate-y-3">
              <InsuranceCompaniesPage/>
          </div>
      </SideBarComponent>
  );
}
