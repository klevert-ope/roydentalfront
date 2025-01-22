"use client";
import { InsuranceComboBox } from "@/components/InsuranceComboBox";
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
import React, { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useFetchInsuranceCompanies } from "@/hooks/useInsuranceCompanies";

const PatientForm = ({ onSubmit, defaultValues, onClose, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => ({
      first_name: "",
      middle_name: "",
      last_name: "",
      sex: "",
      date_of_birth: "",
      insured: false,
      cash: false,
      insurance_company: "",
      scheme: "",
      cover_limit: 0,
      occupation: "",
      place_of_work: "",
      phone: "",
      email: "",
      address: "",
      ...defaultValues,
    }), [defaultValues]),
  });

  const { data: insuranceCompanies, isLoading: isInsuranceCompaniesLoading } =
    useFetchInsuranceCompanies();

  const memoizedInsuranceCompanies = useMemo(() => insuranceCompanies, [
    insuranceCompanies,
  ]);

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, defaultValues[key]);
      });
    }
  }, [defaultValues, setValue]);

  const insured = watch("insured");

  useEffect(() => {
    if (!insured) {
      setValue("insurance_company", "");
      setValue("scheme", "");
      setValue("cover_limit", 0);
    }
  }, [insured, setValue]);

  const capitalizeFirstLetter = useCallback((str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }, []);

  const submitHandler = useCallback((data) => {
    const transformedData = {
      ...data,
      first_name: capitalizeFirstLetter(data.first_name),
      middle_name: data.middle_name
        ? capitalizeFirstLetter(data.middle_name)
        : "",
      last_name: capitalizeFirstLetter(data.last_name),
    };

    onSubmit(transformedData);
    reset(defaultValues);
    onClose();
  }, [capitalizeFirstLetter, onSubmit, defaultValues, onClose, reset]);

  if (isLoading || isInsuranceCompaniesLoading) {
    return <LoadingForm />;
  }

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="mb-4">
          <Label>
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
          </Label>
          {errors.first_name && (
            <span className="text-red-700">{errors.first_name.message}</span>
          )}
        </div>
        <div className="mb-4">
          <Label>
            Middle Name
            <Input
              type="text"
              {...register("middle_name", {
                maxLength: {
                  value: 20,
                  message: "Middle name cannot exceed 20 characters",
                },
              })}
            />
          </Label>
          {errors.middle_name && (
            <span className="text-red-700">{errors.middle_name.message}</span>
          )}
        </div>
        <div className="mb-4">
          <Label>
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
          </Label>
          {errors.last_name && (
            <span className="text-red-700">{errors.last_name.message}</span>
          )}
        </div>
        <div className="mb-4">
          <Label>
            Sex
            <Controller
              name="sex"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sex</SelectLabel>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Label>
          {errors.sex && (
            <span className="text-red-700">{errors.sex.message}</span>
          )}
        </div>
        <div className="mb-4">
          <Label>
            Date of Birth
            <Input
              type="date"
              {...register("date_of_birth", {
                required: "This field is required",
              })}
            />
          </Label>
          {errors.date_of_birth && (
            <span className="text-red-700">{errors.date_of_birth.message}</span>
          )}
        </div>
        <div className="mb-4">
          <Label>
            Insured
            <Controller
              name="insured"
              control={control}
              rules={{
                validate: (value) => {
                  if (value === null || value === undefined) {
                    return "This field is required";
                  }
                },
              }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value?.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Insured status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Insured</SelectLabel>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Label>
          {errors.insured && (
            <span className="text-red-700">{errors.insured.message}</span>
          )}
        </div>
        <div className="mb-4">
          <Label>
            Cash
            <Controller
              name="cash"
              control={control}
              rules={{
                validate: (value) => {
                  if (value === null || value === undefined) {
                    return "This field is required";
                  }
                },
              }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value?.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Cash status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Cash</SelectLabel>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Label>
          {errors.cash && (
            <span className="text-red-700">{errors.cash.message}</span>
          )}
        </div>
        <div className="mb-4">
          <Label>
            Insurance Company
            <Controller
              name="insurance_company"
              control={control}
              rules={{
                validate: (value) => {
                  if (insured && value === "") {
                    return "Required when insured";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <InsuranceComboBox
                  items={memoizedInsuranceCompanies}
                  selectedValue={field.value}
                  onSelect={field.onChange}
                  placeholder="Select Insurance Company"
                  className={"w-full"}
                  disabled={!insured}
                />
              )}
            />
          </Label>
          {errors.insurance_company && (
            <span className="text-red-700">
              {errors.insurance_company.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <Label>
            Scheme
            <Input
              type="text"
              {...register("scheme", {
                validate: (value) => {
                  if (insured && value === "") {
                    return "Required when insured";
                  }
                },
              })}
              disabled={!insured}
            />
          </Label>
          {errors.scheme && (
            <span className="text-red-700">{errors.scheme.message}</span>
          )}
        </div>
        <div className="mb-4">
          <Label>
            Cover Limit
            <Input
              type="number"
              step="0.01"
              {...register("cover_limit", {
                valueAsNumber: true,
                validate: (value) => {
                  if (insured && !value) {
                    return "Required when insured";
                  }
                },
              })}
              disabled={!insured}
            />
          </Label>
          {errors.cover_limit && (
            <span className="text-red-700">{errors.cover_limit.message}</span>
          )}
        </div>
        <div className="mb-4">
          <Label>
            Occupation
            <Input
              type="text"
              {...register("occupation", {
                required: "This field is required",
              })}
            />
          </Label>
          {errors.occupation && (
            <span className="text-red-700">{errors.occupation.message}</span>
          )}
        </div>
        <div className="mb-4">
          <Label>
            Place of Work
            <Input
              type="text"
              {...register("place_of_work", {
                required: "This field is required",
              })}
            />
          </Label>
          {errors.place_of_work && (
            <span className="text-red-700">{errors.place_of_work.message}</span>
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
            Email
            <Input
              type="email"
              {...register("email")}
            />
          </Label>
          {errors.email && (
            <span className="text-red-700">{errors.email.message}</span>
          )}
        </div>
        <div className="mb-4">
          <Label>
            Address
            <Input
              type="text"
              {...register("address", { required: "This field is required" })}
            />
          </Label>
          {errors.address && (
            <span className="text-red-700">{errors.address.message}</span>
          )}
        </div>
      </div>
      <div className={"w-full flex justify-end mt-4"}>
        <Button type="submit" className={"max-w-56"}>Submit</Button>
      </div>
    </form>
  );
};

export default React.memo(PatientForm);
