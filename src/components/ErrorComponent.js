"use client";

import {Button} from "@/components/ui/button";
import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {hasError: false};
	}

	/**
	 * Update state to display fallback UI when an error is encountered.
	 */
	static getDerivedStateFromError() {
		return {hasError: true};
	}

	/**
	 * Log error details (can be integrated with a monitoring service).
	 * @param {Error} error - The error object.
	 * @param {object} errorInfo - Additional info about the error.
	 */
	componentDidCatch(error, errorInfo) {
		console.error("Error caught by ErrorBoundary:", error, errorInfo);
		// Optionally, integrate with a logging service like Sentry or LogRocket here.
	}

	/**
	 * Reset the error state to reattempt rendering the children.
	 */
	handleRetry = () => {
		this.setState({hasError: false});
	};

	renderFallbackUI() {
		return (
			<div
				className="flex flex-col items-center justify-center min-h-screen">
				<h2 className="text-lg font-semibold mb-4">
					Oops! Something went wrong.
				</h2>
				<Button onClick={this.handleRetry}>Try Again</Button>
			</div>
		);
	}

	render() {
		const {hasError} = this.state;
		const {children} = this.props;

		// Display fallback UI if an error has occurred
		if (hasError) {
			return this.renderFallbackUI();
		}

		// Render children when no error is present
		return children;
	}
}

export default ErrorBoundary;
