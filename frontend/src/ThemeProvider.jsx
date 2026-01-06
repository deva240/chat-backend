import { useState } from "react";
import ThemeContext from "./ThemeContext";

function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark((prev) => !prev);   // <-- This switches dark mode
  };

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
