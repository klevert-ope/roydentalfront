import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {format, toZonedTime} from 'date-fns-tz';
import Link from "next/link";
import React from "react";

export const AppointmentCard = React.memo(({appointment}) => {

	const dateTime = new Date(appointment.date_time);
	const zonedDate = toZonedTime(dateTime, 'Africa/Nairobi');
	const scheduledTime = format(zonedDate, 'yyyy-MM-dd HH:mm', {timeZone: 'Africa/Nairobi'});

	return (<div id="appointment-card" className="max-w-[600px] mb-4">
			<h3>Appointment Details</h3>
			<div className="flex flex-row justify-between mb-4">
				<Label className="mr-2">
					Doctor
					<p>DR. {appointment.doctor.first_name} {appointment.doctor.last_name}</p>
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
			<p className="underline">Scheduled Time: {scheduledTime}</p>
			<Separator className="my-8 w-full"/>
		</div>
	);
});
