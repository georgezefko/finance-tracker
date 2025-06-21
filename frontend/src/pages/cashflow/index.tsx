import { Box, useMediaQuery } from "@mui/material";
import Row1 from "./Row1";
import Row2 from "./Row2";
import ExpenseFormModal from "../../components/ExpenseFormModal";
import { useState } from "react";

const gridTemplateLargeScreens = `
    "a b c"
    "d e f"
`;

const gridTemplateSmallScreens = `
    "a"
    "a"
    "a"
    "a"
    "b"
    "b"
    "b"
    "b"
    "c"
    "c"
    "c"
    "c"
    "d"
    "d"
    "d"
    "d"
    "e"
    "e"
    "e"
    "e"
    "f"
    "f"
    "f"
    "f"
`;

const CashFlow = () => {
    const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleExpenseAdded = () => {
        // Trigger a refresh of the data by updating the key
        setRefreshKey(prev => prev + 1);
    };

    return (
        <Box
            width="100%"
            height="100%"
            display="grid"
            gap="1.5rem"
            sx={
                isAboveMediumScreens
                    ? {
                          gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
                          gridTemplateRows: " repeat(2, minmax(60px, 1fr))",
                          gridTemplateAreas: gridTemplateLargeScreens,
                      }
                    : {
                          gridAutoColumns: "1fr",
                          gridAutoRows: "80px",
                          gridTemplateAreas: gridTemplateSmallScreens,
                      }
            }
        >
            <Row1 key={`row1-${refreshKey}`} />
            <Row2 key={`row2-${refreshKey}`} />
            <ExpenseFormModal onExpenseAdded={handleExpenseAdded} />
        </Box>
    );
};

export default CashFlow;