"use client";

import {login} from "@/api/auth";
import {Button} from "@/components/ui/button";
import {Card, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useRouter} from "next/navigation";
import React from "react";
import {useForm} from "react-hook-form";
import {toast} from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm();

  const onLogin = async (data) => {
    const result = await login(data);
    if (result.success === true) {
      toast.success("Logged in successfully");
      router.push(result.redirectUrl);
      reset();
    } else {
      toast.error("Login failed. Please check your credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70svh]">
      <Card className="p-6 w-full max-w-lg">
        <CardHeader className="mb-6 text-center">
          <CardTitle className="text-xl font-semibold">Login Form</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onLogin)}>
          <fieldset disabled={isSubmitting}>
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
            <div className="mb-6">
              <Label>Password
                <Input
                    type="password"
                    {...register("password", {required: "Password is required"})}
                />
              </Label>
              {errors.password && (
                  <span className="text-red-700 text-sm">
                {errors.password.message}
              </span>
              )}
            </div>
            <Button type="submit" className="w-full mt-4"
                    disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </fieldset>
        </form>
      </Card>
    </div>
  );
}
