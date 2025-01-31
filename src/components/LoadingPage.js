"use client";
import {useFetchAppointments} from '@/hooks/useAppointments';
import {useFetchBillings} from '@/hooks/useBillings';
import {useFetchDoctors} from '@/hooks/useDoctors';
import {useFetchEmergencyContacts} from '@/hooks/useEmergencyContacts';
import {useFetchExaminations} from '@/hooks/useExaminations';
import {useFetchInsuranceCompanies} from '@/hooks/useInsuranceCompanies';
import {useFetchPatients, useGetPatientByID} from '@/hooks/usePatients';
import {useFetchTreatmentPlans} from '@/hooks/useTreatmentPlans';
import {useManageUsers} from '@/hooks/useUserData';
import {motion} from 'framer-motion';
import {Loader} from 'lucide-react';
import {useParams} from 'next/navigation';
import React from 'react';

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
	const {isLoading: isLoadingPatient} = useGetPatientByID(patientId ?? '');
	const {isLoading: isLoadingUsers} = useManageUsers();
	const {isLoading: isLoadingPatients} = useFetchPatients();
	const {isLoading: isLoadingInsuranceCompanies} = useFetchInsuranceCompanies();
	const {isLoading: isLoadingDoctors} = useFetchDoctors();
	const {isLoading: isLoadingBillings} = useFetchBillings();
	const {isLoading: isLoadingExaminations} = useFetchExaminations();
	const {isLoading: isLoadingTreatmentPlans} = useFetchTreatmentPlans();
	const {isLoading: isLoadingEmergencyContacts} = useFetchEmergencyContacts();
	const {isLoading: isLoadingAppointments} = useFetchAppointments();

	const isFetching = React.useMemo(() => {
		return (
			isLoadingUsers ||
			isLoadingPatients ||
			isLoadingPatient ||
			isLoadingInsuranceCompanies ||
			isLoadingDoctors ||
			isLoadingBillings ||
			isLoadingExaminations ||
			isLoadingTreatmentPlans ||
			isLoadingEmergencyContacts ||
			isLoadingAppointments
		);
	}, [
		isLoadingUsers,
		isLoadingPatients,
		isLoadingPatient,
		isLoadingInsuranceCompanies,
		isLoadingDoctors,
		isLoadingBillings,
		isLoadingExaminations,
		isLoadingTreatmentPlans,
		isLoadingEmergencyContacts,
		isLoadingAppointments,
	]);

	if (isFetching) {
		return <LoadingSpinner/>;
	}

	return (
		<div className="container mx-auto px-2 w-full my-16">
			<motion.div {...pageAnimation}>{children}</motion.div>
		</div>
	);
};
