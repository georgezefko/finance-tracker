import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import DashboardBox from '../../components/DashboardBox';
import BoxHeader from '../../components/BoxHeader';
import FinancialMetricBox from '../../components/FinancialMetricsBox';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,Label,
} from 'recharts';


const baseUrl = process.env.BASE_URL || 'http://localhost:8000';

interface FinancialData {
    report_year: string;
    total_income_value: string;
    expense_category: string;
    total_expense_value: string;
    savings_rate_value: string;
    total_yearly_expenses:string;
    cumulative_net_income_value:string;
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


const transformDataForChart = (financialDetails: FinancialDetails[] ): TransformedDataItem[] => {
    const transformedData: Record<string, TransformedDataItem> = {};

    financialDetails.forEach(({ dates, category, amount }) => {
        const month = dates; 
        if (!transformedData[month]) {
            transformedData[month] = { month };
        }
        transformedData[month][category] = (parseFloat(amount) || 0) + (parseFloat(transformedData[month][category] as string) || 0);

    });

    return Object.values(transformedData);
};



const expenseColors = ["#82ca9d", "#8884d8", "#ffc658"]; // Add more colors as needed

const Row1: React.FC = () => {
    const [financialData, setFinancialData] = useState<FinancialData[]>([]);
    const [chartData, setChartData] = useState<TransformedDataItem[]>([]);
    const [chartExpense, setChartExpense] = useState<TransformedDataItem[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
   


    useEffect(() => {
        
        const fetchData = async () => {
            try {
                const response = await fetch(`${baseUrl}/feed/financial-overview`);
                const data: FinancialData[] = await response.json();
                setFinancialData(data);

                const financialResponse = await fetch(`${baseUrl}/feed/financial-details`);
                const financialDetails: FinancialDetails[] = await financialResponse.json();
                const transformedChartData = transformDataForChart(financialDetails);
                setChartData(transformedChartData);

                const financialExpense = await fetch(`${baseUrl}/feed/income-expenses`);
                const financialDetailsExpense: FinancialDetails[] = await financialExpense.json();
                const transformedChartDataExpense = transformDataForChart(financialDetailsExpense);
                setChartExpense(transformedChartDataExpense);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching financial data:', error);
                setError(error instanceof Error ? error : new Error('An unknown error occurred'));
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data.</div>;
    if (!financialData.length) return <div>No data available.</div>;
    if (!chartData.length) return <div>No data available.</div>;
    if (!chartExpense.length) return <div>No data available.</div>;
    const latestMonth = financialData[financialData.length - 1]?.report_year;
    const latestMonthData = financialData.filter(data => data.report_year === latestMonth);
    const { total_income_value, savings_rate_value,total_yearly_expenses,cumulative_net_income_value } = latestMonthData[0] || {};

    return (
        <>
            <DashboardBox sx={{
                gridArea: 'a',
                display: 'grid',
                gap: '1rem',
                padding: '1rem',
                height: '400px', // Set a fixed height
                width: '100%',
            }}>
                <BoxHeader title="Financial Overview" subtitle="Avg annual values of main financial metrics" sideText={`Updated: ${latestMonth || ''}`} />
                
                <Box sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    <FinancialMetricBox title="Acc Income" value={parseFloat(total_income_value) || 0} unit="DKK" />
                    <FinancialMetricBox title="Acc Net Income" value={(parseFloat(cumulative_net_income_value)) || 0} unit="DKK" />
                    <FinancialMetricBox title="Savings Rate" value={parseFloat(parseFloat(savings_rate_value).toFixed(2)) || 0} unit="%" />
                    <FinancialMetricBox title="Total Expenses" value={parseFloat(parseFloat(total_yearly_expenses).toFixed(2)) || 0} unit="%" />

                </Box>

                <Box sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {latestMonthData.map((data, index) => (
                        <FinancialMetricBox key={index} title={data.expense_category} value={parseFloat(parseFloat(data.total_expense_value).toFixed(2)) || 0} unit="%" />
                    ))}
                </Box>
            </DashboardBox>
            <DashboardBox sx={{ 
                    gridArea: 'b', 
                    display: 'grid',
                    gap: '0rem',
                    padding: '1rem', 
                    height: '400px', // Set a fixed height
                    width: '100%', }}>
                <BoxHeader title="Expense/Income" subtitle="Monthly cashflow" sideText={`Updated: ${latestMonth || ''}`} />
                <BarChart
                    width={500}
                    height={250}
                    data={chartExpense}
                    margin={{
                        top: 20, right: 30, left: 20, bottom: 5,
                    }}
                    barGap={10} // Adjust this to control the gap between bars of the same group
                    barCategoryGap={20} // Adjust this to control the gap between bars of different groups
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month"/>
                    <YAxis>
                        <Label value="DKK" angle={-90} position="insideLeft"  />
                    </YAxis>
                    <Tooltip />
                    <Legend wrapperStyle={{ paddingTop: "10px" }} /> 
                    {Object.keys(chartExpense[0] || {}).filter(key => key !== 'month' && key !== 'Savings').map((key, idx) => (
                        <Bar 
                            key={idx} 
                            dataKey={key} 
                            fill={expenseColors[idx % expenseColors.length]} 
                            barSize={20} // Adjust bar size as needed
                        />
                    ))}
                </BarChart>
            </DashboardBox>

            <DashboardBox sx={{ 
                    gridArea: 'c', 
                    display: 'grid',
                    gap: '1rem',
                    padding: '1rem', 
                    height: '400px', // Set a fixed height
                    width: '100%', }}>
                <BoxHeader title="Savings Rate" subtitle="Monthly savings rate" sideText={`Updated: ${latestMonth || ''}`} />
                <BarChart
                    width={500}
                    height={250}
                    data={chartExpense}
                    margin={{
                        top: 20, right: 30, left: 20, bottom: 5,
                    }}
                    barGap={10} // Adjust this to control the gap between bars of the same group
                    barCategoryGap={20} // Adjust this to control the gap between bars of different groups
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month"/>
                    <YAxis>
                        <Label value="Percentage (%)" angle={-90} position="insideLeft"  />
                    </YAxis>
                    <Tooltip />
                    <Legend wrapperStyle={{ paddingTop: "10px" }} /> 
                    {chartExpense.some(data => data.Savings) && (
                        <Bar 
                            dataKey="Savings" 
                            fill={expenseColors[0]} // Adjust as needed for Savings color
                            barSize={20} // Adjust bar size as needed
                        />
                    )}
                </BarChart>
            </DashboardBox>
        </>
    );
};

export default Row1;
