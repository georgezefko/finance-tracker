import DashboardBox from '../../components/DashboardBox';
import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { useTheme } from '@mui/material';
import ExpenseForm from '../../components/ExpenseForm';




const Row2: React.FC = () => {
  

    return (
        <DashboardBox sx={{
            gridArea: 'd',
        }}>
              
            <Box>
                <ExpenseForm /> 
            </Box>
        </DashboardBox>
    );
};

export default Row2;
