import {Loader} from 'lucide-react';
import React from 'react';

export default function Loading() {
	return (<div className="flex flex-col items-center justify-center h-screen">
			<Loader className="motion-safe:animate-spin"/>
		</div>)
}
