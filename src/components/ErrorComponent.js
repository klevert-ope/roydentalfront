import React from 'react';

const ErrorComponent = ({ message }) => {
	return (
		<div className="flex flex-col items-center justify-center min-h-[100svh]">
			<h2>Oops! Something went wrong.</h2>
			<p className="text-red-700">{message}</p>
		</div>
	);
};

export default ErrorComponent;
