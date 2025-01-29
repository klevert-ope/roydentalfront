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
import React from "react";

export const PatientSubDetails = () => {
	return (
		<Tabs defaultValue="EmergencyContacts" className="my-16 w-full">
			<div className="flex justify-center">
				<div className="flex items-center overflow-x-auto">
					<TabsList className="p-5">
						<TabsTrigger value="EmergencyContacts">
							Emergency Contacts
						</TabsTrigger>
						<TabsTrigger
							value="Appointments">Appointments</TabsTrigger>
						<TabsTrigger
							value="Examinations">Examinations</TabsTrigger>
						<TabsTrigger value="TreatmentPlan">
							Treatment Plans
						</TabsTrigger>
						<TabsTrigger value="Billings">Billings</TabsTrigger>
					</TabsList>
				</div>
			</div>
			<TabsContent value="EmergencyContacts">
				<EmergencyContactsSection/>
			</TabsContent>
			<TabsContent value="Appointments">
				<AppointmentsSection/>
			</TabsContent>
			<TabsContent value="Examinations">
				<ExaminationSection/>
			</TabsContent>
			<TabsContent value="TreatmentPlan">
				<TreatmentPlanSection/>
			</TabsContent>
			<TabsContent value="Billings">
				<BillingSection/>
			</TabsContent>
		</Tabs>
	);
};
