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
import {useSwipeable} from "react-swipeable";

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

	const handleSwipe = (direction) => {
		const currentIndex = tabSections.findIndex((tab) => tab.value === activeTab);
		let newIndex;

		if (direction === "left") {
			newIndex = (currentIndex + 1) % tabSections.length;
		} else if (direction === "right") {
			newIndex = (currentIndex - 1 + tabSections.length) % tabSections.length;
		}

		setActiveTab(tabSections[newIndex].value);
	};

	const swipeHandlers = useSwipeable({
		onSwipedLeft: () => handleSwipe("left"),
		onSwipedRight: () => handleSwipe("right"),
		preventDefaultTouchmoveEvent: true,
		trackMouse: true,
	});

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
			<div {...swipeHandlers}>
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
