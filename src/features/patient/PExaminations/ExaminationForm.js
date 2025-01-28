"use client";
import RichTextEditor from "@/components/RichTextEditor";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import React, {useCallback, useEffect, useMemo} from "react";
import {Controller, useForm} from "react-hook-form";

const ExaminationForm = (
    {onSubmit, defaultValues, onClose, patientId},
) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => ({
      patient_id: patientId || "",
      report: "",
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

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      {/* Patient ID Field */}
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
          <span className="text-red-700 text-sm">
            {errors.patient_id.message}
          </span>
        )}
      </div>

      {/* Treatment Plan Field */}
      <div className="mb-4">
        <Label>
          Report
          <Controller
            name="report"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange, value } }) => (
              <RichTextEditor
                name="report"
                defaultValue={value}
                onChange={onChange}
                setValue={setValue}
              />
            )}
          />
        </Label>
        {errors.report && (
          <span className="text-red-700 text-sm">{errors.report.message}</span>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full mt-4">
        Submit
      </Button>
    </form>
  );
};

export default React.memo(ExaminationForm);
