"use client";
import {logoff} from "@/api/auth";
import {LoadingForm} from "@/components/LoadingForm";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useUserData} from "@/hooks/useUserData";
import {useRouter} from "next/navigation";
import React, {useEffect} from "react";
import {toast} from "sonner";

const UserProfile = () => {
	const router = useRouter();
	const {data: userProfile, refetch, isLoading} = useUserData();

	useEffect(() => {
		refetch();
	}, [refetch]);

	const onLogoff = async () => {
		const result = await logoff();
		if (result?.success) {
			router.push(result.redirectUrl);
		} else {
			toast.error("Failed to log off.");
		}
	};

	const roleName = userProfile?.user?.role?.name || "Guest";
	const username = userProfile?.user?.username || "Unknown User";
	const email = userProfile?.user?.email || "No Email Provided";

	if (isLoading) {
		return <LoadingForm/>;
	}

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
				<Button variant="destructive" onClick={onLogoff}
				        className="w-full">
					Logoff
				</Button>
			</CardContent>
		</Card>
	);
};

export default React.memo(UserProfile);
