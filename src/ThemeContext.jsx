import { createContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

export const ThemeContext = createContext();

export const ThemeProviderWrapper = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: '"Inter", sans-serif',
          fontWeightRegular: 400,
          fontSize: 16, // Kích thước mặc định lớn hơn
          h1: { fontSize: "2rem", fontWeight: 700 },
          h2: { fontSize: "1.75rem", fontWeight: 700 },
          h3: { fontSize: "1.5rem", fontWeight: 700 },
          h4: { fontSize: "1.25rem", fontWeight: 700 },
          h5: { fontSize: "1.125rem", fontWeight: 700 },
          h6: { fontSize: "1rem", fontWeight: 700 },
          button: { fontWeight: 600, fontSize: "1rem" },
        },
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: darkMode ? "#90caf9" : "#1976d2" },
          background: {
            default: darkMode ? "#121212" : "#f5f5f5",
            paper: darkMode ? "#1e1e1e" : "#fff",
          },
          text: { primary: darkMode ? "#fff" : "#000" },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
