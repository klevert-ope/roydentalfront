"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";

export default function CreateUserForm({ onSubmit, defaultValues, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role_id: "",
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

  const submitHandler = useCallback((data) => {
    const formattedData = {
      ...data,
      role_id: parseInt(data.role_id, 10),
    };
    console.log(formattedData)
    onSubmit(formattedData);
    reset();
    onClose();
  }, [onSubmit, onClose, reset]);

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className="mb-4">
        <Label>Username
        <Input
          type="username"
          {...register("username", {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters long",
            },
            maxLength: {
              value: 50,
              message: "Username must be at most 50 characters long",
            },
          })}
        />
        </Label>
        {errors.username && (
          <span className="text-red-700 text-sm">
            {errors.username.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <Label>Email
        <Input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
        </Label>
        {errors.email && (
          <span className="text-red-700 text-sm">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="mb-4">
        <Label>Role
        <Controller
          name="role_id"
          control={control}
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  <SelectItem value="1">Admin</SelectItem>
                  <SelectItem value="2">Doctor</SelectItem>
                  <SelectItem value="3">Receptionist</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        </Label>
        {errors.role_id && (
          <span className="text-red-700">{errors.role_id.message}</span>
        )}
      </div>
      <div className="mb-6">
        <Label>Password
        <Input
          type="password"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character",
            },
          })}
        />
        </Label>
        {errors.password && (
          <span className="text-red-700 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>
      <Button type="submit" className="w-full">
        Create User
      </Button>
    </form>
  );
}
