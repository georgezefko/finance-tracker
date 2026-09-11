import { Box } from "@mui/material";
import { styled } from "@mui/system";

const DashboardBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.light,
    borderRadius: "1rem",
    boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, 0.8)",
    // Grid items default to min-width:auto, so a wide child (the DataGrids use
    // fixed column widths totalling ~450px) stretches its track and scrolls the
    // whole page sideways on a phone. Let the card shrink and scroll internally.
    minWidth: 0,
}));

export default DashboardBox;