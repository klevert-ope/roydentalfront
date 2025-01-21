"use client";
import LoginForm from "@/features/login/LoginForm";
import React from "react";

export default function Login() {
  return (
    <div className="container mx-auto px-2 w-full my-16 transition-all fade-in-60 animate-in -translate-y-3">
      <h1 className="text-center mb-8">RADIANT GLOW DENTAL CLINIC</h1>
      <LoginForm />
    </div>
  );
}
