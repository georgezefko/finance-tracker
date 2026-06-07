import React, { useState, useMemo, useContext } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { themeSettings } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CashFlow from "./pages/cashflow";
import NetWorth from "./pages/networth";
import Navbar from "./pages/navbar";
import Sidebar from "./pages/sidebar";
import LoginPage from "./pages/login";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteTitle from "./components/RouteTitle";
import { YearProvider } from "./context/YearContext"; 

const AppRoutes: React.FC = () => {
    const authContext = useContext(AuthContext);

    return (
        <Routes>
            {!authContext?.isLoggedIn ? (
                <>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<CashFlow />} />
                    <Route path="/cashflow" element={<CashFlow />} />
                    <Route path="/networth" element={<NetWorth />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </>
            )}
        </Routes>
    );
};

function App() {
    const theme = useMemo(() => createTheme(themeSettings), []);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    //const authContext = useContext(AuthContext);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="app">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Navbar onToggleSidebar={toggleSidebar} />
                <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
                <Box
                    width="100%"
                    height="100%"
                    sx={{ padding: { xs: '1rem 1rem 96px 1rem', md: '1rem 2rem 4rem 2rem' } }}
                >
                    <AppRoutes />
                </Box>
            </ThemeProvider>
        </div>
    );
}

const AppWrapper: React.FC = () => (
    <ErrorBoundary>
      <BrowserRouter>
        <RouteTitle />
        <AuthProvider>
          <YearProvider>
            <App />
            </YearProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
);

export default AppWrapper;
