"use client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";

const DoctorForm = ({onSubmit, defaultValues, onClose}) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm({
      defaultValues: {
        first_name: "",
        last_name: "",
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

  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const submitHandler = (data) => {
    const transformedData = {
      ...data,
      first_name: capitalizeFirstLetter(data.first_name),
      last_name: capitalizeFirstLetter(data.last_name),
    };
    onSubmit(transformedData);
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mb-4">
        <label>
          First Name
          <Input
            type="text"
            {...register("first_name", {
              required: "This field is required",
              maxLength: {
                value: 20,
                message: "First name cannot exceed 20 characters",
              },
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
            })}
          />
        </label>
        {errors.first_name && (
          <span className="text-red-700">{errors.first_name.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label>
          Last Name
          <Input
            type="text"
            {...register("last_name", {
              required: "This field is required",
              maxLength: {
                value: 20,
                message: "Last name cannot exceed 20 characters",
              },
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters",
              },
            })}
          />
        </label>
        {errors.last_name && (
          <span className="text-red-700">{errors.last_name.message}</span>
        )}
      </div>
      <Button className={"w-full mt-4"} type="submit">Submit</Button>
    </form>
  );
};

export default React.memo(DoctorForm);
