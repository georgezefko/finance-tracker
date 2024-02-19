import DashboardBox from '../../components/DashboardBox';
import React, { useMemo, useEffect, useState } from 'react';
import { useTheme, Box } from '@mui/material';
import BoxHeader from '../../components/BoxHeader';
import { DataGrid } from "@mui/x-data-grid";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer, BarChart, Bar, Label } from 'recharts';

const baseUrl = process.env.BASE_URL || 'http://localhost:8000';

interface RawDataItem {
    total: string;
    time: string;
    type_name: string;
  }

interface ChartData {
    time: string;
    [key: string]: string | number;
  }

  interface FinancialDetails {
    dates: string;
    category: string;
    amount: string;
}

interface TransformedDataItem {
    month: string;
    [key: string]: string | number;
}


interface TransformedList {
    date: string;
    type: string;
    category: string;
    amount: number
}


const transformDataForChart = (financialDetails: FinancialDetails[] ): TransformedDataItem[] => {
    const transformedData: Record<string, TransformedDataItem> = {};

    financialDetails.forEach(({ dates, category, amount }) => {
        const month = dates; // Assuming dates are already in 'YYYY-MM' format
        if (!transformedData[month]) {
            transformedData[month] = { month };
        }
        transformedData[month][category] = (parseFloat(amount) || 0) + (parseFloat(transformedData[month][category] as string) || 0);

    });

    return Object.values(transformedData);
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


const barColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']; 
const generateColor = (index: number) => {
   
    return `hsl(${index * 137.508}, 50%, 60%)`; 
};

const Row2: React.FC = () => {
    const { palette } = useTheme();
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [stuckData, setStuckData] = useState<TransformedDataItem[]>([]);
    const [listData, setListData] = useState<TransformedList[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);


    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'date', headerName: 'Date', width: 100 },
        { field: 'amount', headerName: 'Amount', type: 'number', width: 90 },
        { field: 'type', headerName: 'Type', width: 100 },
        { field: 'category', headerName: 'Category', width: 150 },
      
        
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/feed/timeseries`);
                const data: RawDataItem[] = await response.json();
                const transformedData = transformData(data);
                setChartData(transformedData);
                

                const financialResponse = await fetch(`${baseUrl}/feed/financial-details`);
                const financialDetails: FinancialDetails[] = await financialResponse.json();
                const transformedChartData = transformDataForChart(financialDetails);
                setStuckData(transformedChartData);


                const tableResponse = await fetch(`${baseUrl}/feed/list-expenses`);
                const listExpenses: TransformedList[] = await tableResponse.json();
                const formattedData = listExpenses.map((item, index) => ({
                ...item,
                id: index, // Adding an ID for each item
                }));
                console.log('forl',formattedData)
                setListData(formattedData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching financial data Row 2:', error);
                setError(error instanceof Error ? error : new Error('An unknown error occurred'));
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data.</div>;
    if (!chartData.length) return <div>No data available.</div>;
    if (!stuckData.length) return <div>No data available.</div>;
    if (!listData.length) return <div>No data available.</div>;

    return (
        <>
        <DashboardBox sx={{ 
                    gridArea: 'd', 
                    display: 'grid',
                    gap: '1rem',
                    padding: '1rem',
                    height: '400px', // Set a fixed height
                    width: '100%', }}>
            <BoxHeader title="Expense Types" subtitle="Monthly values of expense types" sideText={`Updated: ${'2024' || ''}`} />
            <BarChart
                width={500}
                height={250}
                data={stuckData}
                margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                }}
                barGap={-10} // Adjust this to control the gap between bars of the same group
                barCategoryGap={0} // Adjust this to control the gap between bars of different groups
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month"/>
                <YAxis>
                    <Label value="DKK" angle={-90} position="insideLeft"  />
                </YAxis>
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: "10px" }} /> 
                {Object.keys(stuckData[0] || {}).filter(key => key !== 'month').map((key, idx) => (
                    <Bar 
                        key={idx} 
                        dataKey={key} 
                        stackId="a" 
                        fill={barColors[idx % barColors.length]} 
                        barSize={30} // Adjust bar size as needed
                    />
                ))}
            </BarChart>
            </DashboardBox>

        <DashboardBox sx={{
            gridArea: 'e',
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
        <DashboardBox gridArea="f">
                <BoxHeader
                    title="List of Transcactions"
                    sideText={`${listData?.length} Transactions`}
                />
                <Box
                    mt="1rem"
                    p="0 0.5rem"
                    height="80%"
                    sx={{
                        "& .MuiDataGrid-root": {
                            color: palette.grey[300],
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            visibility: "hidden",
                        },
                    }}
                >
                    <DataGrid
                        columnHeaderHeight={25}
                        rowHeight={35}
                        hideFooter={true}
                        rows={listData}
                        columns={columns}
                    />
                </Box>
            </DashboardBox>
    </>
    );
};

export default Row2;
