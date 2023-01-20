import React from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme
 } from "@mui/material";
import {
    SettingsOutlined,
    ChevronLeft,
    ChevronRightOutlined,
    HomeOutlined,
    ShoppingCartOutlined,
    Groups2Outlined,
    ReceiptLongOutlined,
    PublicOutlined,
    PointOfSaleOutlined,
    TodayOutlined,
    CalendarMonthOutlined,
    AdminPanelSettingsOutlined,
    TrendingUpOutlined,
    PieChartOutlined
 } from "@mui/icons-material";

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';
import UserImage from "components/UserImage";


const navItems = [
    {
        text: "Dashboard",
        icon: <HomeOutlined />
    },
    {
        text: "Client Facing",
        icon: null,
    },
    {
        text: "Products",
        icon: <ShoppingCartOutlined />
    },
    {
        text: "Customers",
        icon: <Groups2Outlined />
    },
    {
        text: "Transactions",
        icon: <ReceiptLongOutlined />
    },
    {
        text: "Geography",
        icon: <PublicOutlined />
    },
    {
        text: "Sales",
        icon: null
    },
    {
        text: "Overview",
        icon: <PointOfSaleOutlined />
    },
    {
        text: "Daily",
        icon: <TodayOutlined />
    },
    {
        text: "Monthly",
        icon: <CalendarMonthOutlined />
    },
    {
        text: "Breakdown",
        icon: <PieChartOutlined />
    },
    {
        text: "Management",
        icon: null
    },
    {
        text: "Users",
        icon: <AdminPanelSettingsOutlined />
    },
    {
        text: "Performance",
        icon: <TrendingUpOutlined />
    },
]

const Sidebar = ({
    drawerWidth,
    isSidebarOpen,
    setIsSidebarOpen,
    isNonMobile,
}) => {
    const { pathname } = useLocation();
    const [active, setActive] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();

    const user = useSelector((state) => state.persistedReducer.user);

    useEffect(() => {
        setActive(pathname.substring(1));
    }, [pathname])

  return (
    <Box component="nav">
        {isSidebarOpen && (
            <Drawer
                open={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                variant="persistent"
                anchor="left"
                sx={{
                    width: drawerWidth,
                    "& .MuiDrawer-paper": {
                        color: theme.palette.secondary[200],
                        backgroundColor: theme.palette.background.alt,
                        boxSizing: "border-box",
                        borderWidth: isNonMobile ? 0 : "2px",
                        width: drawerWidth
                    }
                }}
            >
                <Box width="100%">
                    <Box m="1.5rem 2rem 2rem 3rem">
                        <FlexBetween color={theme.palette.secondary.main}>
                            <Box display="flex" alignItems="center" gap="0.5rem">
                                <Typography variant="h4" fontWeight="bold">
                                    M. SHAHZAIB
                                </Typography>
                                {!isNonMobile && (
                                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                        <ChevronLeft />
                                    </IconButton>
                                )}
                            </Box>
                        </FlexBetween>
                    </Box>
                    <List>
                        {navItems.map(({ text, icon }) => {
                            if(!icon) {
                                return (
                                    <Typography key={text} sx={{m: "2.25rem 0 1rem 3rem"}} >
                                        {text}
                                    </Typography>
                                )
                            }
                            const lcText = text.toLocaleLowerCase();

                            return (
                                <ListItem key={text} disablePadding>
                                    <ListItemButton 
                                        onClick={() => {
                                            navigate(`/${lcText}`); 
                                            setActive(lcText);
                                        }}
                                        sx = {{
                                            backgroundColor: active === lcText ? theme.palette.secondary[300] : "transparent",
                                            color: active === lcText 
                                            ? theme.palette.primary[600] 
                                            : theme.palette.secondary[100]
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                ml: "2rem",
                                                color: active === lcText 
                                                ? theme.palette.primary[600] 
                                                : theme.palette.secondary[200]
                                            }}
                                        >
                                            {icon}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                        { active === lcText && (
                                            <ChevronRightOutlined sx={{ ml: "auto"}} />
                                        )}
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
                <Box >
                    <Divider />
                    <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
                        
                        <UserImage image={user.picturePath} height="40px" width="40px" />
                        <Box textAlign="left">
                            <Typography
                                fontWeight="bold"
                                fontSize="0.9rem"
                                sx={{ color: theme.palette.secondary[100] }}
                            >
                                {user.name}
                            </Typography>
                            <Typography
                                fontSize="0.8rem"
                                sx={{ color: theme.palette.secondary[200] }}
                            >
                                {user.role}
                            </Typography>
                        </Box>
                        <SettingsOutlined sx={{ color: theme.palette.secondary[300], fontSize: "25px"}} />
                    
                    </FlexBetween>
                </Box>
            </Drawer>
        )}
    </Box>
  )
}

export default Sidebar