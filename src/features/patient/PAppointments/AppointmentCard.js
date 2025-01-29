import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import Link from "next/link";
import React from "react";

export const AppointmentCard = React.memo(({appointment}) => {
	const dateTime = new Date(appointment.date_time);
	const options = {
		timeZone: "Africa/Nairobi",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	};
	const formatter = new Intl.DateTimeFormat("en-US", options);
	const scheduledTime = formatter.format(dateTime);

	return (
		<div id={"appointment-card"} className="max-w-[600px] mb-4">
			<h3>Appointment Details</h3>
			<div className={"flex flex-row justify-between mb-4"}>
				<Label className={"mr-2"}>
					Doctor ID
					<p>{appointment.doctor_id}</p>
				</Label>
				<Label>
					Patient
					<p>
						<Link
							href={`/patients/${appointment.patient_id}`}
							title="View Patient details"
							prefetch={true}
						>
							{appointment.patient.first_name} {appointment.patient.last_name}
						</Link>
					</p>
				</Label>
			</div>
			<p className={"underline"}>Scheduled Time: {scheduledTime}</p>
			<Separator className="my-8 w-full"/>
		</div>
	);
});
