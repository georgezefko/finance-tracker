import React, { useState } from 'react';
import './App.css';
import ExpenseForm from './ExpenseForm';
import TimeSeriesChart from './timeSeriesChart';
import ExpenseIncomeBarPlot from './expenseIncomeBarPlot';
import FinancialForecastTable from './forecastTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function App() {
  const [selectedTab, setSelectedTab] = useState(0);

  // Correctly typed parameters for the event handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Finance Tracker</h1>
      </header>
      <main>
        <ExpenseForm />
        
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Overview" />
          <Tab label="Cashflow" />
        </Tabs>

        <Box component="div" hidden={selectedTab !== 0}>
          <ExpenseIncomeBarPlot />
          <TimeSeriesChart />
        </Box>
        <Box component="div" hidden={selectedTab !== 1}>
          <FinancialForecastTable />
        </Box>
      </main>
    </div>
  );
}

export default App;
