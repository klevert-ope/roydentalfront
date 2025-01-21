// Centralized error handler
export const handleAxiosError = (error) => {
  if (error.response) {
    console.error(
      "Response error:",
      error.response.data,
      "Status:",
      error.response.status,
    );
  } else if (error.request) {
    console.error("No response received:", error.request);
  } else {
    console.error("Error:", error.message);
  }
};
