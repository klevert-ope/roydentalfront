import {DoctorComboBox} from "@/components/DoctorComboBox";
import {LoadingForm} from '@/components/LoadingForm';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useFetchDoctors} from "@/hooks/useDoctors";
import React, {useCallback, useEffect, useMemo} from "react";
import {Controller, useForm} from "react-hook-form";

const AppointmentForm = (
    {onSubmit, defaultValues, onClose, patientId, isLoading},
) => {
    const {data: doctors = [], isLoading: isLoadingDoctors} = useFetchDoctors();

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

    if (isLoading || isLoadingDoctors) {
        return <LoadingForm/>
    }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mb-4">
          <Label>Patient ID
        <Input
          type="text"
          {...register("patient_id", { required: "This field is required" })}
          readOnly
        />
          </Label>
        {errors.patient_id && (
          <span className="text-red-700">{errors.patient_id.message}</span>
        )}
      </div>
      <div className="mb-4">
          <Label>Doctor ID
        <Controller
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
          </Label>
        {errors.doctor_id && (
          <span className="text-red-700">{errors.doctor_id.message}</span>
        )}
      </div>
      <div className="mb-4">
	      <Label>Date and Time
        <Input
          type="datetime-local"
          {...register("date_time", { required: "This field is required" })}
        />
          </Label>
        {errors.date_time && (
          <span className="text-red-700">{errors.date_time.message}</span>
        )}
      </div>
      <div className="mb-4">
	      <Label>Status
        <Controller
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
          </Label>
        {errors.status && (
          <span className="text-red-700">{errors.status.message}</span>
        )}
      </div>
      <Button type="submit" className="w-full mt-4">Submit</Button>
    </form>
  );
};

export default React.memo(AppointmentForm);
