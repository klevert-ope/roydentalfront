import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";

export const ChartCard = React.memo(({title, children}) => (
	<Card className="mb-8">
		<CardHeader className="mb-4">
			<CardTitle>{title}</CardTitle>
		</CardHeader>
		<CardContent>{children}</CardContent>
	</Card>
));
