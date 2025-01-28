"use client";
import {Label} from "@/components/ui/label";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Separator} from "@/components/ui/separator";
import {useFetchAppointments} from "@/hooks/useAppointments";
import Link from "next/link";
import React, {useCallback, useEffect, useMemo, useState} from "react";

const AppointmentCard = React.memo(({ appointment }) => {
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
      <Separator className="my-8 w-full" />
    </div>
  );
});

const AppointmentsToday = () => {
  const {data = []} = useFetchAppointments();
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const filterAppointments = useCallback(() => {
    if (data && Array.isArray(data)) {
      // Compute today's date in Nairobi timezone
      const now = new Date();
      const todayNairobi = new Date(now.setUTCHours(0, 0, 0, 0)); // Midnight UTC
      const timezoneOffsetMinutes = -(new Date().getTimezoneOffset() + 180); // Nairobi is UTC+3
      const todayStartInNairobi = new Date(
        todayNairobi.getTime() + timezoneOffsetMinutes * 60000,
      );

      // Filter appointments
      const filtered = data.filter((appointment) => {
        const appointmentDateTime = new Date(appointment.date_time);
        const appointmentNairobiTime = new Date(
          appointmentDateTime.getTime() + timezoneOffsetMinutes * 60000,
        );
        return (
          appointment.status === "scheduled" &&
          appointmentNairobiTime.getUTCFullYear() ===
            todayStartInNairobi.getUTCFullYear() &&
          appointmentNairobiTime.getUTCMonth() ===
            todayStartInNairobi.getUTCMonth() &&
          appointmentNairobiTime.getUTCDate() ===
            todayStartInNairobi.getUTCDate()
        );
      });

      setFilteredAppointments(filtered);
    }
  }, [data]);

  useEffect(() => {
    filterAppointments();
  }, [filterAppointments]);

  const memoizedFilteredAppointments = useMemo(() => filteredAppointments, [
    filteredAppointments,
  ]);

  return (
    <div className={"my-24"}>
      <h2 className={"mb-5"}>Scheduled Appointments for Today</h2>
      {memoizedFilteredAppointments.length === 0
        ? <p>No scheduled appointments for today.</p>
        : (
          <ScrollArea className="max-h-[500px] max-w-[600px] p-4 bg-[var(--card)] rounded-md border">
            {memoizedFilteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.patient_id}
                appointment={appointment}
              />
            ))}
          </ScrollArea>
        )}
    </div>
  );
};

export default AppointmentsToday;
