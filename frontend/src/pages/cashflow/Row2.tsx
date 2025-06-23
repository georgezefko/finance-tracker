import DashboardBox from '../../components/DashboardBox';
import React, { useMemo, useEffect, useState, useContext } from 'react';
import { useTheme, Box } from '@mui/material';
import BoxHeader from '../../components/BoxHeader';
import { DataGrid } from "@mui/x-data-grid";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Label } from 'recharts';
import { AuthContext } from '../../context/AuthContext';
import { apiFetch } from '../../utils/apiFetch';

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

    return Object.values(transformedData).sort((a, b) => a.month.localeCompare(b.month));
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
  
    return Object.values(dataMap).sort((a, b) => a.time.localeCompare(b.time));
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
    const [isolatedCategory, setIsolatedCategory] = useState<string | null>(null);
    const authContext = useContext(AuthContext);


    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        { field: 'date', headerName: 'Date', width: 100 },
        { field: 'amount', headerName: 'Amount', type: 'number', width: 90 },
        { field: 'type', headerName: 'Type', width: 100 },
        { field: 'category', headerName: 'Category', width: 150 },
      
        
    ];

    const handleLegendClick = (o: any) => {
        const { dataKey } = o;
        setIsolatedCategory(prev => (prev === dataKey ? null : dataKey));
    };

    useEffect(() => {
        if (!authContext?.token) return;

        const fetchData = async () => {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authContext.token}`
            };

            try {
                const response = await apiFetch(`${baseUrl}/feed/timeseries`, { headers }, authContext);
                const data: RawDataItem[] = await response.json();
                const transformedData = transformData(data);
                setChartData(transformedData);
                

                const financialResponse = await apiFetch(`${baseUrl}/feed/financial-details`, { headers }, authContext);
                const financialDetails: FinancialDetails[] = await financialResponse.json();
                const transformedChartData = transformDataForChart(financialDetails);
                setStuckData(transformedChartData);


                const tableResponse = await apiFetch(`${baseUrl}/feed/list-expenses`, { headers }, authContext);
                const listExpenses: TransformedList[] = await tableResponse.json();
                const formattedData = listExpenses.map((item, index) => ({
                ...item,
                id: index, // Adding an ID for each item
                }));
                setListData(formattedData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching financial data Row 2:', error);
                setError(error instanceof Error ? error : new Error('An unknown error occurred'));
                setLoading(false);
            }
        };
        fetchData();
    }, [authContext?.token]);

    const categoryKeys = useMemo(() => {
        if (chartData.length === 0) return [];
        return Object.keys(chartData[0]).filter(key => key !== 'time');
    }, [chartData]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data.</div>;
    if (!chartData.length) return <div>No data available.</div>;
    if (!stuckData.length) return <div>No data available.</div>;
    if (!listData.length) return <div>No data available.</div>;

    const latestStuckDataMonth = stuckData.length > 0 ? stuckData[stuckData.length - 1].month : '';
    const latestChartDataTime = chartData.length > 0 ? chartData[chartData.length - 1].time : '';

    return (
        <>
        <DashboardBox sx={{ 
                    gridArea: 'd', 
                    display: 'grid',
                    gap: '1rem',
                    padding: '1rem',
                    height: { xs: 250, md: 400 }, // Responsive height
                    width: '100%', }}>
            <BoxHeader title="Expense Types" subtitle="Monthly values of expense types" sideText={`Updated: ${latestStuckDataMonth}`} />
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                  data={stuckData}
                  margin={{
                      top: 20, right: 30, left: 20, bottom: 5,
                  }}
                  barGap={-10}
                  barCategoryGap={0}
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
                          barSize={30}
                      />
                  ))}
              </BarChart>
            </ResponsiveContainer>
            </DashboardBox>

        <DashboardBox sx={{
            gridArea: 'e',
            display: 'grid',
            gap: '1rem',
            padding: '1rem',
            height: { xs: 250, md: 400 }, // Responsive height
            width: '100%',
        }}>
            <BoxHeader title="Expense Categories" subtitle="Monthly values of expense categories" sideText={`Updated: ${latestChartDataTime}`} />
            <ResponsiveContainer width="100%" height={300}>
            <LineChart
          className="timeSeriesChart"
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onClick={(e) => e?.activePayload?.[0] && handleLegendClick(e.activePayload[0])}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend onClick={handleLegendClick} wrapperStyle={{ cursor: 'pointer' }} />
          {categoryKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={generateColor(index)}
              hide={isolatedCategory !== null && isolatedCategory !== key}
              strokeWidth={isolatedCategory === key ? 2.5 : 1}
              connectNulls
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
