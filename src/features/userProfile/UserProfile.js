"use client";
import { LoadingForm } from "@/components/LoadingPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/utility/AuthProvider";
import {useCookies} from 'next-client-cookies';
import React from "react";
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const router = useRouter();
  const cookies = useCookies();
  const { logoff } = useAuth();
  const { data: userProfile, isLoading, error } = useUserData();

  if (isLoading) {
    return <LoadingForm />;
  }

  if (error) {
    cookies.remove("user");
    cookies.remove("accessToken");
    cookies.remove("refreshToken");
    router.replace("/login");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"text-center"}>{userProfile.role.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={"mb-4"}>
          <p>{userProfile.username}</p>
          <p>{userProfile.email}</p>
        </div>
        <Button variant={"destructive"} onClick={logoff} className={"w-full"}>
          Logoff
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
