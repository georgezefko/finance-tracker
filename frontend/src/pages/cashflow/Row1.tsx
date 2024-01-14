import DashboardBox from '../../components/DashboardBox';
import BoxHeader from '../../components/BoxHeader';
import FinancialMetricBox from '../../components/FinancialMetricsBox';
import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { useTheme } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';



// Example data, replace with real data fetching logic
const financialData = {
    totalIncome: 100000,
    totalNetIncome: 75000,
    accNetIncome: 300000,
    savingsRate: 0.2, // Example as a decimal
    expenses: 25000,
    housingCosts: 10000,
    personalCosts: 5000,
    travelCosts: 3000,
};

const Row1: React.FC = () => {
    const { palette } = useTheme();

    const processedFinancialData = useMemo(() => {
        // Processing logic here
        return financialData;
    }, [financialData]);
    return (
        <>
        <DashboardBox sx={{
            gridArea: 'a',
            display: 'grid',
            //gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            padding: '1rem',
        }}>
             <BoxHeader title="Financial Overview" subtitle="Key financial metrics overview" sideText="Updated now" />
             
            <Box sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                <FinancialMetricBox title="Total Income" value={financialData.totalIncome} unit="$" />
                <FinancialMetricBox title="Total Net Income" value={financialData.totalNetIncome} unit="$" />
                <FinancialMetricBox title="Accumulative Net Income" value={financialData.accNetIncome} unit="$" />
                <FinancialMetricBox title="Savings Rate" value={financialData.savingsRate * 100} unit="%" />
            </Box>
            <Box sx={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                <FinancialMetricBox title="Expenses" value={financialData.expenses} unit="$" />
                <FinancialMetricBox title="Housing Fixed Costs" value={financialData.housingCosts} unit="$" />
                <FinancialMetricBox title="Personal Fixed Costs" value={financialData.personalCosts} unit="$" />
                <FinancialMetricBox title="Travel Costs" value={financialData.travelCosts} unit="$" />
            </Box>
        </DashboardBox>
        
        </>
    );
};

export default Row1;
