import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box } from "@mui/material";

export default function AppFooter() {
    return (
        <Box
            sx={{
                // backgroundColor: (theme) =>
                //     theme.palette.mode === "light"
                //         ? theme.palette.grey[200]
                //         : theme.palette.grey[800],
                p: 6,
                marginTop: 10
            }}
            component="footer"
        >
            <Container maxWidth="sm">
                <Typography variant="body2" color="text.secondary" align="center">
                    {"Copyright © "}
                    <Link color="inherit" href="#">
                        AulabGamerHub
                    </Link>{" "}
                    {new Date().getFullYear()}
                    {"."}
                </Typography>
            </Container>
        </Box>
    );
}
