import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './expenseIncomeBarPlot.css'; // Importing the CSS file

interface RawDataItem {
  total: number; // assuming 'total' is a number
  time: string;
  names: string; // 'Expense' or 'Income'
}

interface ChartData {
  time: string;
  Expense: number;
  Income: number;
}

const ExpenseIncomeBarPlot = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/feed/income-expenses') // Adjust the endpoint as needed
      .then(response => response.json())
      .then(data => {
        const transformedData = transformData(data);
        setChartData(transformedData);
      })
      .catch(error => console.error('Error fetching expense-income data:', error));
  }, []);

  return (
    <div className="barChartContainer">
      <h2 className="chartTitle">Expense vs Income</h2> {/* Add a title if needed */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          className="barPlot"
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Expense" fill="#8884d8" />
        <Bar dataKey="Income" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Function to transform the data
const transformData = (data: RawDataItem[]): ChartData[] => {
  const dataMap: Record<string, ChartData> = {};

  data.forEach(item => {
    if (!dataMap[item.time]) {
      dataMap[item.time] = { time: item.time, Expense: 0, Income: 0 };
    }
    if (item.names === 'Expense') {
      dataMap[item.time].Expense += item.total;
    } else if (item.names === 'Income') {
      dataMap[item.time].Income += item.total;
    }
  });

  return Object.values(dataMap);
};

export default ExpenseIncomeBarPlot;
