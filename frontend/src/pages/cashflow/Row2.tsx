import DashboardBox from '../../components/DashboardBox';
import React, { useMemo, useEffect, useState } from 'react';
import { useTheme } from '@mui/material';
import BoxHeader from '../../components/BoxHeader';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';


interface RawDataItem {
    total: string;
    time: string;
    type_name: string;
  }

interface ChartData {
    time: string;
    [key: string]: string | number;
  }

// Function to transform the data
const transformData = (data: RawDataItem[]): ChartData[] => {
    const dataMap: Record<string, ChartData> = {};
  
    data.forEach(item => {
      if (!dataMap[item.time]) {
        dataMap[item.time] = { time: item.time };
      }
      dataMap[item.time][item.type_name] = parseFloat(item.total);
    });
  
    return Object.values(dataMap);
  };

// Function to get random colors - you can customize this part
// const getRandomColor = (index: number): string => {
//   const colors = [
//     '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0', 
//     '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
//     '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A83731',
//     '#7692FF', '#34D399', '#FBBF24', '#FB7185', '#9D174D'
//     /* Add more colors if needed */
// ];
//     return colors[index % colors.length];
//   };
const generateColor = (index: number) => {
    // Generate a color in a way that spreads out the colors
    // This uses the HSL color space
    return `hsl(${index * 137.508}, 50%, 60%)`; // 137.508 is the golden angle in degrees
};

const Row2: React.FC = () => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/feed/timeseries');
                const data: RawDataItem[] = await response.json();
                const transformedData = transformData(data);
                setChartData(transformedData);
                console.log('trans',transformData)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching financial data row 2:', error);
                setError(error instanceof Error ? error : new Error('An unknown error occurred'));
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data.</div>;
    if (!chartData.length) return <div>No data available.</div>;

    return (
        <>
        <DashboardBox sx={{
            gridArea: 'd',
            display: 'grid',
            gap: '1rem',
            padding: '1rem',
            height: '400px', // Set a fixed height
            width: '100%',
        }}>
            <BoxHeader title="Expense Categories" subtitle="Monthly values of expense categories" sideText={`Updated: ${'2024' || ''}`} />
            <ResponsiveContainer width="100%" height={300}>
            <LineChart
          className="timeSeriesChart" // Apply the class here
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(chartData[0] || {}).filter(key => key !== 'time').map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={generateColor(index)}
            />
          ))}
        </LineChart>
        </ResponsiveContainer>
        </DashboardBox>
    </>
    );
};

export default Row2;
