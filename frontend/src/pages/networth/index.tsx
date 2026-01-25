import { Box, useMediaQuery } from "@mui/material";
import Row1 from "./Row1";
import Row2 from "./Row2";
import YearSelector from "../../components/YearSelector";
import ExpenseFormModal from "../../components/ExpenseFormModal";
import { useState } from "react";

const gridTemplateLargeScreens = `
  "a b"
  "c d"
`;

const gridTemplateSmallScreens = `
  "a"
  "b"
  "c"
  "d"
`;

const NetWorth = () => {
    const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleExpenseAdded = () => {
        // Trigger a refresh of the data by updating the key
        setRefreshKey(prev => prev + 1);
    };
    const handleNetworthChanged = () => {
        setRefreshKey((prev) => prev + 1);
    }
    return (
    <Box width="100%" height="100%" display="flex" flexDirection="column" gap="1rem">
        <Box
            width="100%"
            height="100%"
            display="grid"
            gap="1.5rem"
            sx={
                isAboveMediumScreens
                ? {
                    gridTemplateColumns: "repeat(2, minmax(370px, 1fr))",
                    gridTemplateRows: "repeat(2, minmax(300px, 1fr))",
                    gridTemplateAreas: gridTemplateLargeScreens,
                    }
                : {
                    gridAutoColumns: "1fr",
                    gridAutoRows: "320px",
                    gridTemplateAreas: `
                        "a"
                        "b"
                        "c"
                        "d"
                    `,
                    }
            }
            >
            <Row1 key={`row1-${refreshKey}`} />
            <Row2 key={`row2-${refreshKey}`} />
            <ExpenseFormModal mode="networth" onExpenseAdded={handleExpenseAdded} />
        </Box>
    </Box>
    );
};

export default NetWorth;