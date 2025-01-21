import React, { useEffect, useState } from "react";

const ThemeToggleButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Toggle the `dark` class on the root element
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <button
        style={{
          padding: "10px 20px",
          border: "2px solid currentColor",
          background: "transparent",
          color: "currentColor",
          cursor: "pointer",
        }}
        onClick={toggleTheme}
      >
        Switch to {isDarkMode ? "Light" : "Dark"} Theme
      </button>
    </div>
  );
};

export default ThemeToggleButton;
