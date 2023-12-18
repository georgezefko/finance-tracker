// src/App.tsx
import React from 'react';
import './App.css';
import ExpenseForm from './ExpenseForm'; // Import your ExpenseForm component

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
      </main>
    </div>
  );
}

export default App;

