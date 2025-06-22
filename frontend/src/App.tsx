import React, { useState, useMemo, useContext } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { themeSettings } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CashFlow from "./pages/cashflow";
import Navbar from "./pages/navbar";
import Sidebar from "./pages/sidebar";
import LoginPage from "./pages/login";
import { AuthProvider, AuthContext } from "./context/AuthContext";

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
                    <Route path="/logout" element={
                        <button onClick={authContext.logout}>Logout</button> // A simple logout button
                    } />
                    <Route path="*" element={<Navigate to="/" />} />
                </>
            )}
        </Routes>
    );
};

function App() {
    const theme = useMemo(() => createTheme(themeSettings), []);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const authContext = useContext(AuthContext);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="app">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Navbar onToggleSidebar={toggleSidebar} />
                <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
                <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
                    <AppRoutes />
                </Box>
            </ThemeProvider>
        </div>
    );
}

const AppWrapper: React.FC = () => (
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
);

export default AppWrapper;
