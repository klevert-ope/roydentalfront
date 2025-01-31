"use client";

import {Button} from '@/components/ui/button';
import React, {Component} from "react";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {hasError: false, error: null};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return {hasError: true, error};
	}

	componentDidCatch(error, errorInfo) {
		// You can also log the error to an error reporting service
		console.error("ErrorBoundary caught an error", error, errorInfo);
	}

	resetErrorBoundary = () => {
		this.setState({hasError: false, error: null});
	};

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return <GlobalError error={this.state.error}
			                    reset={this.resetErrorBoundary}/>;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;

const GlobalError = ({error, reset}) => {
	return (
		<div className="px-2 flex flex-col items-center justify-center h-svh">
			<h2 className="mb-4">
				Oops! Something went wrong.
			</h2>
			<p className="text-red-700 mb-4 max-w-lg">{error.message}</p>
			<Button onClick={reset}>Try again</Button>
		</div>
	);
};
