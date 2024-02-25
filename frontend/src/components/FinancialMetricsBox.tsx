import React from 'react';
import { Box, Typography } from '@mui/material';

type FinancialMetricBoxProps = {
    title: string;
    value: number;
    unit: string;
};

const getColorByCategory = (category: string, value:number) => {
    if (category === 'Acc Income' && value > 50000) {
        return 'lightgreen';
    }
    if (category === 'Acc Net Income' && value > 20000) {
        return 'lightgreen';
    }
    if (category === 'Savings Rate' && value > 35) {
        return 'lightgreen';
    }
    if (category === 'Total Expenses' && value < 70) {
        return 'lightgreen';
    }
    if (category === 'Housing Fixed Costs' && value < 30) {
        return 'lightgreen';
    }
    if (category === 'Personal Fixed Costs' && value < 7) {
        return 'lightgreen';
    }
    if (category === 'Personal Running Costs' && value < 14) {
        return 'lightgreen';
    }
    if (category === 'Travel Costs' && value < 11) {
        return 'lightgreen';
    }
    return '#ff6666' //light red;
};
const FinancialMetricBox: React.FC<FinancialMetricBoxProps> = ({ title, value, unit }) => {
    const color = getColorByCategory(title, value);
    return (
        <Box sx={{
            padding: 1,
            border: '1.5px solid lightgray',
            borderRadius: '10px',
            textAlign: 'center',
            //boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            <Typography variant="h4" sx={{ color: color }}>
                {value.toLocaleString()}{unit}
            </Typography>
        </Box>
    );
};

export default FinancialMetricBox;
