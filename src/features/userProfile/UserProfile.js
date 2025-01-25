"use client";

import {LoadingForm} from "@/components/LoadingPage";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useUserData} from "@/hooks/useUserData";
import {useAuth} from "@/utility/AuthProvider";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

const UserProfile = () => {
  const router = useRouter();
  const { logoff } = useAuth();
  const { data: userProfile, isLoading, error } = useUserData();

  useEffect(() => {
    if (error && !userProfile?.user?.role) {
      router.replace("/login");
    }
  }, [userProfile?.user?.role, error, router]);

  if (isLoading) {
    return <LoadingForm />;
  }

  const roleName = userProfile?.user?.role?.name || "Role not available";
  const username = userProfile?.user?.username || "Username not available";
  const email = userProfile?.user?.email || "Email not available";

  return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{roleName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p>{username}</p>
            <p>{email}</p>
          </div>
          <Button variant="destructive" onClick={logoff} className="w-full">
            Logoff
          </Button>
        </CardContent>
      </Card>
  );
};

export default UserProfile;
