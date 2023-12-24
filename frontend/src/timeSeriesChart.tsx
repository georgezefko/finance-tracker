import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './timeSeriesChart.css'; 

interface RawDataItem {
    total: string;
    time: string;
    type_name: string;
  }

interface ChartData {
    time: string;
    [key: string]: string | number;
  }

const TimeSeriesChart = () => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/feed/timeseries')
      .then(response => response.json())
      .then(data => {
        const transformedData = transformData(data);
        setChartData(transformedData);
      })
      .catch(error => console.error('Error fetching timeseries data:', error));
  }, []);

  return (
    <LineChart
      width={600}
      height={300}
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
          stroke={getRandomColor(index)} // Implement getRandomColor to assign colors
        />
      ))}
    </LineChart>
  );
};

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
const getRandomColor = (index: number): string => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0', /* More colors */];
    return colors[index % colors.length];
  };

export default TimeSeriesChart;
