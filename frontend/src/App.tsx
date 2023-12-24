// src/App.tsx
import React from 'react';
import './App.css';
import ExpenseForm from './ExpenseForm'; // Import your ExpenseForm component
import TimeSeriesChart from './timeSeriesChart';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* You can keep or modify this header as needed */}
        <h1>Finance Tracker</h1>
      </header>
      <main>
        {/* Expense Form Component */}
        <ExpenseForm />
        <TimeSeriesChart />
      </main>
    </div>
  );
}

export default App;

