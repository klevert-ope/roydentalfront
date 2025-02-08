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
	initial: {opacity: 0, y: 30},
	animate: {opacity: 1, y: 0},
	transition: {duration: 0.5},
};

export const LoadingPage = ({children}) => {
	const {patientId} = useParams();

	const patientQuery = useGetPatientByID(patientId);

	const queries = [
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

	const isLoading = patientQuery.isLoading || queries.some(q => q.isLoading);

	if (isLoading) {
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
