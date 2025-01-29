import SideBarComponent from "@/components/SideBarComponent";
import AppointmentsToday
  from "@/features/patient/PAppointments/AppointmentsToday";
import PatientsCharts from "@/features/patients/PatientsCharts";
import React from "react";

export const metadata = {
  title: "Radiant Glow Dental Clinic",
  description: "Dental clinic management system",
};

export default function Home() {
  return (
      <SideBarComponent>
        <div
            className="container mx-auto px-2 w-full my-16 transition-all fade-in-60 animate-in -translate-y-3">
          <h1 className="text-center mb-8">
            RADIANT GLOW DENTAL CLINIC
          </h1>
          <AppointmentsToday/>
          <PatientsCharts/>
        </div>
      </SideBarComponent>
  );
}
