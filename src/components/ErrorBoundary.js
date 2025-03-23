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
			return <GlobalError error={this.state.error}
			                    reset={this.resetErrorBoundary}/>;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;

const GlobalError = ({error, reset}) => {
	return (<div
		className="flex flex-col items-center justify-center min-h-screen px-2">
		<h2 className="mb-4 text-center">
			Oops! Something went wrong.
		</h2>
		<p className="mb-4 max-w-lg text-center text-red-700 whitespace-pre-wrap">
			{error.message}
		</p>
		<div className="flex justify-center">
			<Button onClick={reset}>Try again</Button>
		</div>
	</div>);
};
