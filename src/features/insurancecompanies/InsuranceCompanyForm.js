"use client";
import { LoadingForm } from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const InsuranceCompanyForm = (
  { onSubmit, defaultValues, onClose, isLoading },
) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm({
      defaultValues: {
        name: "",
        ...defaultValues,
      },
    });

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, defaultValues[key]);
      });
    }
  }, [defaultValues, setValue]);

  const submitHandler = (data) => {
    const upperCaseData = {
      ...data,
      name: data.name.toUpperCase(),
    };
    onSubmit(upperCaseData);
    reset();
    onClose();
  };

  if (isLoading) {
    return <LoadingForm />;
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className={"mb-4"}>
        <label>
          Name
          <Input
            type="text"
            {...register("name", {
              required: "This field is required",
              maxLength: {
                value: 20,
                message: "Name cannot exceed 20 characters",
              },
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />
        </label>
        {errors.name && (
          <span className="text-red-700">{errors.name.message}</span>
        )}
      </div>
      <Button className={"w-full mt-4"} type="submit">Submit</Button>
    </form>
  );
};

export default React.memo(InsuranceCompanyForm);
