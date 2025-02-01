"use client";
import {DoctorComboBox} from "@/components/DoctorComboBox";
import {LoadingForm} from '@/components/LoadingForm';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useFetchDoctors} from "@/hooks/useDoctors";
import React, {useCallback, useEffect, useMemo} from "react";
import {Controller, useForm} from "react-hook-form";

const BillingForm = (
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
      procedure: "",
      billing_amount: 0,
      paid_cash_amount: 0,
      paid_insurance_amount: 0,
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
        <label>
          Patient ID
          <Input
            type="text"
            {...register("patient_id", { required: "This field is required" })}
            readOnly
          />
        </label>
        {errors.patient_id && (
          <span className="text-red-700">{errors.patient_id.message}</span>
        )}
      </div>
      <div className="mb-4">
        <Label>
          Doctor ID
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
                className={"w-full"}
              />
            )}
          />
        </Label>
        {errors.doctor_id && (
          <span className="text-red-700">{errors.doctor_id.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label>
          Procedure
          <Input
            type="text"
            {...register("procedure", { required: "This field is required" })}
          />
        </label>
        {errors.procedure && (
          <span className="text-red-700">{errors.procedure.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label>
          Billing Amount
          <Input
            type="number"
            {...register("billing_amount", {
              valueAsNumber: true,
              required: "This field is required",
            })}
          />
        </label>
        {errors.billing_amount && (
          <span className="text-red-700">{errors.billing_amount.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label>
          Paid Cash Amount
          <Input
            type="number"
            {...register("paid_cash_amount", {
              valueAsNumber: true,
              required: "This field is required",
            })}
          />
        </label>
        {errors.paid_cash_amount && (
          <span className="text-red-700">
            {errors.paid_cash_amount.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label>
          Paid Insurance Amount
          <Input
            type="number"
            {...register("paid_insurance_amount", {
              valueAsNumber: true,
              required: "This field is required",
            })}
          />
        </label>
        {errors.paid_insurance_amount && (
          <span className="text-red-700">
            {errors.paid_insurance_amount.message}
          </span>
        )}
      </div>
      <Button type="submit" className={"w-full mt-4"}>Submit</Button>
    </form>
  );
};

export default React.memo(BillingForm);
