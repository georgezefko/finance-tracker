import { Typography, Box, useTheme } from "@mui/material";
import React from "react";
import FlexBetween from "./FlexBetween";

type Props = {
    title: string;
    sideText: string;
    icon?: React.ReactNode;
    subtitle?: string;
};

const BoxHeader: React.FC<Props> = ({ icon, title, subtitle, sideText }) => {
    const { palette } = useTheme();
    const secondary500 = palette.secondary as any; // Type assertion here

    return (
        <FlexBetween color={palette.grey[400]} margin="0.5rem 1rem">
            <Box>
                {icon}
                <Typography variant="h4" mb="0.1rem" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{title}</Typography>
                {subtitle && <Typography variant="h6" sx={{ fontSize: '1rem' }}>{subtitle}</Typography>}
            </Box>
            <Typography variant="h6" fontWeight="700" color={secondary500[500]}>
                {sideText}
            </Typography>
        </FlexBetween>
    );
};

export default BoxHeader;
