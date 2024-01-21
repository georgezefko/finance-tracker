import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import DashboardBox from '../../components/DashboardBox';
import BoxHeader from '../../components/BoxHeader';
import FinancialMetricBox from '../../components/FinancialMetricsBox';

interface FinancialData {
    report_month: string;
    total_income_value: string;
    expense_category: string;
    total_expense_value: string;
    net_income_value: string;
    savings_rate_value: string;
    total_monthly_expenses:string;
}

const Row1: React.FC = () => {
    const [financialData, setFinancialData] = useState<FinancialData[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/feed/financial-overview');
                const data: FinancialData[] = await response.json();
                setFinancialData(data);
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

    const latestMonth = financialData[financialData.length - 1]?.report_month;
    const latestMonthData = financialData.filter(data => data.report_month === latestMonth);
    const { total_income_value, net_income_value, savings_rate_value,total_monthly_expenses } = latestMonthData[0] || {};

    return (
        <>
            <DashboardBox sx={{
                gridArea: 'a',
                display: 'grid',
                gap: '1rem',
                padding: '1rem',
            }}>
                <BoxHeader title="Financial Overview" subtitle="Key financial metrics overview" sideText={`Updated: ${latestMonth || ''}`} />
                
                <Box sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    <FinancialMetricBox title="Total Income" value={parseFloat(total_income_value) || 0} unit="DKK" />
                    <FinancialMetricBox title="Total Net Income" value={parseFloat(net_income_value) || 0} unit="DKK" />
                    <FinancialMetricBox title="Savings Rate" value={parseFloat(parseFloat(savings_rate_value).toFixed(2)) || 0} unit="%" />
                    <FinancialMetricBox title="Total Expenses" value={parseFloat(total_monthly_expenses) || 0} unit="DKK" />

                </Box>

                <Box sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {latestMonthData.map((data, index) => (
                        <FinancialMetricBox key={index} title={data.expense_category} value={parseFloat(data.total_expense_value) || 0} unit="DKK" />
                    ))}
                </Box>
            </DashboardBox>
        </>
    );
};

export default Row1;
