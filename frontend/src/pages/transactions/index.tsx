import { Box } from "@mui/material";
import { styled } from "@mui/system";
import DashboardBox from '../../components/DashboardBox';
import BoxHeader from '../../components/BoxHeader';
import ExpenseForm from '../../components/ExpenseForm';

// New styled component for top center alignment
const FlexTopCenter = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    height: "100vh", // Full viewport height
});

const Transaction: React.FC = () => {
    return (
        <FlexTopCenter>
            <DashboardBox width="20%" p="1rem" overflow="hidden">
                <BoxHeader title="Transactions" subtitle="Add expenses" sideText="" />
                <Box>
                    <ExpenseForm/> 
                </Box>
            </DashboardBox>
        </FlexTopCenter>
    );
};

export default Transaction;
