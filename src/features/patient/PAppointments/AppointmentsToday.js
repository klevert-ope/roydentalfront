"use client";
import {ScrollArea} from "@/components/ui/scroll-area";
import {
    AppointmentCard
} from '@/features/patient/PAppointments/AppointmentCard';
import {useFetchAppointments} from "@/hooks/useAppointments";
import React, {useEffect, useMemo, useState} from "react";

const AppointmentsToday = () => {
    const {data = []} = useFetchAppointments();
    const [filteredAppointments, setFilteredAppointments] = useState([]);

    // Memoize today's start time in Nairobi timezone
    const todayStartInNairobi = useMemo(() => {
        const now = new Date();
        const todayNairobi = new Date(now.setUTCHours(0, 0, 0, 0)); // Midnight UTC
        const timezoneOffsetMinutes = -(new Date().getTimezoneOffset() + 180); // Nairobi is UTC+3
        return new Date(todayNairobi.getTime() + timezoneOffsetMinutes * 60000);
    }, []);

    // Filter appointments for today
    useEffect(() => {
        if (Array.isArray(data)) {
            const filtered = data.filter((appointment) => {
                const appointmentDateTime = new Date(appointment.date_time);
                const appointmentNairobiTime = new Date(
                    appointmentDateTime.getTime() + (todayStartInNairobi.getTimezoneOffset() * 60000)
                );

                return (
                    appointment.status === "scheduled" &&
                    appointmentNairobiTime.getUTCFullYear() === todayStartInNairobi.getUTCFullYear() &&
                    appointmentNairobiTime.getUTCMonth() === todayStartInNairobi.getUTCMonth() &&
                    appointmentNairobiTime.getUTCDate() === todayStartInNairobi.getUTCDate()
                );
            });

            // Only update state if filtered data changes
            setFilteredAppointments((prev) => {
                const isSame =
                    prev.length === filtered.length &&
                    prev.every((item, index) => item.id === filtered[index]?.id);
                return isSame ? prev : filtered;
            });
        }
    }, [data, todayStartInNairobi]);

    return (
        <div className="my-24">
            <h2 className="mb-5">Scheduled Appointments for Today</h2>
            {filteredAppointments.length === 0 ? (
                <p>No scheduled appointments for today.</p>
            ) : (
                <ScrollArea
                    className="max-h-[500px] max-w-[600px] p-4 bg-[var(--card)] rounded-md border">
                    {filteredAppointments.map((appointment) => (
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

export default React.memo(AppointmentsToday);
