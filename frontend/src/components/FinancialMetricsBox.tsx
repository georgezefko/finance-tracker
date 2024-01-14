import React from 'react';
import { Box, Typography } from '@mui/material';

type FinancialMetricBoxProps = {
    title: string;
    value: number;
    unit: string;
};

const FinancialMetricBox: React.FC<FinancialMetricBoxProps> = ({ title, value, unit }) => {
    return (
        <Box sx={{
            padding: 2,
            border: '1px solid lightgray',
            borderRadius: '10px',
            textAlign: 'center',
            //boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{title}</Typography>
            <Typography variant="h4">
                {value.toLocaleString()}{unit}
            </Typography>
        </Box>
    );
};

export default FinancialMetricBox;
