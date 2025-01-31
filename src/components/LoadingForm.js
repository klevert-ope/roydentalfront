import {Loader} from 'lucide-react';
import React from 'react';

export const LoadingForm = () => (
	<div className="flex items-center justify-center my-5">
		<Loader className="motion-safe:animate-spin"/>
	</div>
);
