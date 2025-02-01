"use client";

import {useFetchAppointments} from "@/hooks/useAppointments";
import {useFetchBillings} from "@/hooks/useBillings";
import {useFetchDoctors} from "@/hooks/useDoctors";
import {useFetchEmergencyContacts} from "@/hooks/useEmergencyContacts";
import {useFetchExaminations} from "@/hooks/useExaminations";
import {useFetchInsuranceCompanies} from "@/hooks/useInsuranceCompanies";
import {useFetchPatients, useGetPatientByID} from "@/hooks/usePatients";
import {useFetchTreatmentPlans} from "@/hooks/useTreatmentPlans";
import {useManageUsers} from "@/hooks/useUserData";
import {motion} from "framer-motion";
import {Loader} from "lucide-react";
import {useParams} from "next/navigation";
import React from "react";

const LoadingSpinner = () => (
	<div className="flex flex-col items-center justify-center h-screen">
		<Loader className="motion-safe:animate-spin"/>
	</div>
);

const pageAnimation = {
	initial: {opacity: 0, y: 50},
	animate: {opacity: 1, y: 0},
	transition: {duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01]},
};

export const LoadingPage = ({children}) => {
	const {patientId} = useParams();

	// Always call the hook, but let the hook handle its internal logic
	const {isLoading: isLoadingPatient} = useGetPatientByID(patientId || null);

	// Fetch all other required data
	const fetchHooks = [
		useManageUsers(),
		useFetchPatients(),
		useFetchInsuranceCompanies(),
		useFetchDoctors(),
		useFetchBillings(),
		useFetchExaminations(),
		useFetchTreatmentPlans(),
		useFetchEmergencyContacts(),
		useFetchAppointments(),
	];

	// Check if any data is still loading
	const isFetching = fetchHooks.some((hook) => hook.isLoading) || isLoadingPatient;

	if (isFetching) {
		return <LoadingSpinner/>;
	}

	return (
		<div className="container mx-auto px-2 w-full my-16">
			<motion.div
				initial={pageAnimation.initial}
				animate={pageAnimation.animate}
				transition={pageAnimation.transition}
			>
				{children}
			</motion.div>
		</div>
	);
};
