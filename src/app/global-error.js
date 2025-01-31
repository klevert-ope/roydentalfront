"use client";

import {Button} from "@/components/ui/button";
import React from "react";

export default function GlobalError({error, reset}) {
	return (
		<html lang="en">
		<head>
			<meta
				name="format-detection"
				content="telephone=no, date=no, email=no, address=no"
			/>
			<meta name="viewport"
			      content="width=device-width, initial-scale=1"/>
		</head>
		<body>
		<div
			className="px-2 flex flex-col items-center justify-center h-svh">
			<h2 className="mb-4">
				Oops! Something went wrong.
			</h2>
			<p className="text-red-700 mb-4 max-w-lg">{error.message}</p>
			<Button onClick={() => reset()}>Try again</Button>
		</div>
		</body>
		</html>
	);
}
