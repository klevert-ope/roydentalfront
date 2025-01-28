import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import React from 'react';

export const BChartCard = React.memo(({title, children}) => (
	<Card className="mb-8">
		<CardHeader className="mb-4">
			<CardTitle>{title}</CardTitle>
		</CardHeader>
		<CardContent>{children}</CardContent>
		<CardFooter className="flex-col items-start gap-2 text-sm">
			<div className="leading-none text-muted-foreground">{title}</div>
		</CardFooter>
	</Card>
));
