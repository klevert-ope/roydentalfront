import { DoctorComboBox } from "@/components/DoctorComboBox";
import { LoadingForm } from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchDoctors } from "@/hooks/useDoctors";
import React, { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

const AppointmentForm = (
  { onSubmit, defaultValues, onClose, isLoading, patientId },
) => {
  const { data: doctors, isLoading: isDoctorsLoading } = useFetchDoctors();

  const memoizedDoctors = useMemo(() => doctors, [doctors]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => ({
      patient_id: patientId,
      doctor_id: "",
      date_time: "",
      status: "",
      ...defaultValues,
    }), [patientId, defaultValues]),
  });

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, defaultValues[key]);
      });
    }
  }, [defaultValues, setValue]);

  const submitHandler = useCallback((data) => {
    onSubmit(data);
    reset();
    onClose();
  }, [onSubmit, onClose, reset]);

  if (isLoading || isDoctorsLoading) {
    return <LoadingForm />;
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mb-4">
        <Label htmlFor="patient_id">Patient ID</Label>
        <Input
          id="patient_id"
          type="text"
          {...register("patient_id", { required: "This field is required" })}
          readOnly
        />
        {errors.patient_id && (
          <span className="text-red-700">{errors.patient_id.message}</span>
        )}
      </div>
      <div className="mb-4">
        <Label htmlFor="doctor_id">Doctor ID</Label>
        <Controller
          id="doctor_id"
          name="doctor_id"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <DoctorComboBox
              items={memoizedDoctors}
              selectedValue={field.value}
              onSelect={field.onChange}
              placeholder="Select Doctor"
              className="w-full"
            />
          )}
        />
        {errors.doctor_id && (
          <span className="text-red-700">{errors.doctor_id.message}</span>
        )}
      </div>
      <div className="mb-4">
        <Label htmlFor="date_time">Date and Time</Label>
        <Input
          id="date_time"
          type="datetime-local"
          {...register("date_time", { required: "This field is required" })}
        />
        {errors.date_time && (
          <span className="text-red-700">{errors.date_time.message}</span>
        )}
      </div>
      <div className="mb-4">
        <Label htmlFor="status">Status</Label>
        <Controller
          id="status"
          name="status"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.status && (
          <span className="text-red-700">{errors.status.message}</span>
        )}
      </div>
      <Button type="submit" className="w-full">Submit</Button>
    </form>
  );
};

export default React.memo(AppointmentForm);
