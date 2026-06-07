import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatCurrency } from '../utils/format';

type FinancialMetricBoxProps = {
    title: string;
    value: number;
    unit?: string;
    format?: 'currency' | 'percent' | 'number';
    useSignColor?: boolean;
};

// Titles that have a defined target. Anything not listed here is shown in a
// neutral colour rather than red, so a renamed/new category doesn't "scream bad".
const KNOWN_TARGETS = new Set([
    'Acc Income',
    'Acc Net Income',
    'Savings Rate',
    'Total Expenses',
    'Housing Fixed Costs',
    'Personal Fixed Costs',
    'Personal Running Costs',
    'Travel Costs',
]);

const NEUTRAL = '#90A4AE'; // blue-grey

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
    // A known metric below its target is a warning (red); an unknown metric is
    // simply uncoloured (neutral) instead of misleadingly red.
    return KNOWN_TARGETS.has(category) ? '#ff6666' : NEUTRAL;
};

const getSignColor = (value: number) => {
    if (value > 0) return '#2E7D32';   // green
    if (value < 0) return '#C62828';   // red
    return '#90A4AE';                  // neutral grey
    };


const FinancialMetricBox: React.FC<FinancialMetricBoxProps> = ({ title, value, unit, format, useSignColor, }) => {
    const color = useSignColor ? getSignColor(value) : getColorByCategory(title, value);

    const displayValue =
        format === 'currency'
            ? formatCurrency(value)
            : `${value.toLocaleString()}${unit ?? ''}`;

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
                {displayValue}
            </Typography>
        </Box>
    );
};

export default FinancialMetricBox;
