"use client";
import { LoadingForm } from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

const EmergencyContactForm = (
  { onSubmit, defaultValues, onClose, isLoading, patientId },
) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm({
      defaultValues: useMemo(() => ({
        patient_id: patientId || "",
        name: "",
        phone: "",
        relationship: "",
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

  if (isLoading) {
    return <LoadingForm />;
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mb-4">
        <Label>
          Patient ID
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
        <Label>
          Name
          <Input
            type="text"
            {...register("name", { required: "This field is required" })}
          />
        </Label>
        {errors.name && (
          <span className="text-red-700">{errors.name.message}</span>
        )}
      </div>

      <div className="mb-4">
        <Label>
          Phone
          <Input
            type="text"
            {...register("phone", { required: "This field is required" })}
          />
        </Label>
        {errors.phone && (
          <span className="text-red-700">{errors.phone.message}</span>
        )}
      </div>

      <div className="mb-4">
        <Label>
          Relationship
          <Input
            type="text"
            {...register("relationship", {
              required: "This field is required",
            })}
          />
        </Label>
        {errors.relationship && (
          <span className="text-red-700">{errors.relationship.message}</span>
        )}
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};

export default React.memo(EmergencyContactForm);
