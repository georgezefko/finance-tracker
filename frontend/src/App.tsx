import React, { useState, useMemo } from "react";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { themeSettings } from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CashFlow from "./pages/cashflow";
import Navbar from "./pages/navbar";
import Sidebar from "./pages/sidebar";
import Transaction from "./pages/transactions";

function App() {
    const theme = useMemo(() => createTheme(themeSettings), []);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="app">
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    
                        <Navbar onToggleSidebar={toggleSidebar} />
                        <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
                        <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
                            <Routes>
                            <Route path="/" element={<Transaction />} /> 
                                <Route path="/cashflow" element={<CashFlow />} />
                                {/* Add other routes as needed */}
                             
                            </Routes>
                        </Box>
                   
                </ThemeProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
