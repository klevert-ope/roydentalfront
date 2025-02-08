"use client"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import AppointmentsSection
	from "@/features/patient/PAppointments/AppointmentSection";
import BillingSection from "@/features/patient/PBillings/BillingSection";
import EmergencyContactsSection
	from "@/features/patient/PEmergencyContacts/EmergencyContactSection";
import ExaminationSection
	from "@/features/patient/PExaminations/ExaminationSection";
import TreatmentPlanSection
	from "@/features/patient/PTreatmentPlans/TreatmentPlanSection";
import React, {useMemo, useState} from "react";

export const PatientSubDetails = () => {
	const [activeTab, setActiveTab] = useState("EmergencyContacts");

	const tabSections = useMemo(
		() => [
			{
				value: "EmergencyContacts",
				label: "Emergency Contacts",
				component: <EmergencyContactsSection/>,
			},
			{
				value: "Appointments",
				label: "Appointments",
				component: <AppointmentsSection/>,
			},
			{
				value: "Examinations",
				label: "Examinations",
				component: <ExaminationSection/>,
			},
			{
				value: "TreatmentPlan",
				label: "Treatment Plans",
				component: <TreatmentPlanSection/>,
			},
			{
				value: "Billings",
				label: "Billings",
				component: <BillingSection/>,
			},
		],
		[]
	);

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab}
		      className="my-16 w-full">
			<div className="flex justify-center">
				<div>
					<TabsList
						className="p-3 flex flex-wrap items-center h-auto gap-4">
						{tabSections.map((tab) => (
							<TabsTrigger key={tab.value} value={tab.value}
							             className="p-3">
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</div>
			</div>
			<div>
				{tabSections.map((tab) => (
					<TabsContent key={tab.value} value={tab.value}
					             className="min-h-[50svh]">
						{tab.component}
					</TabsContent>
				))}
			</div>
		</Tabs>
	);
};
