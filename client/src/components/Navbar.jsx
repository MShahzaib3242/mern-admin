import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    LightModeOutlined,
    DarkModeOutlined,
    Menu as MenuIcon,
    Search, 
    SettingsOutlined,
    ArrowDropDownOutlined 
} from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
import { useDispatch } from 'react-redux';
import { setMode, setLogout } from 'state';
import UserImage from "components/UserImage";

import { 
    AppBar,
    MenuItem,
    useTheme, 
    Toolbar, 
    IconButton, 
    InputBase,
    Button,
    Box,
    Typography,
    Menu,
    } from '@mui/material';

    import { useNavigate } from 'react-router-dom';


const Navbar = ({
    isSidebarOpen,
    setIsSidebarOpen
}) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const user = useSelector((state) => state.persistedReducer.user);

    const [anchorEl, setAnchorEl] = useState(null);
    const isOpen = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const navigate = useNavigate();

  return (
        <AppBar
            sx= {{
                position: "static",
                background: "none",
                boxShadow: "none",
            }}
            >
            <Toolbar sx={{justifyContent: "space-between"}}>
                {/* Left Side */}
                <FlexBetween>
                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <FlexBetween 
                        backgroundColor={theme.palette.background.alt}
                        borderRadius="9px"
                        gap="3rem"
                        p="0.1rem 1.5rem"
                        >
                            <InputBase placeholder="Search..." />
                            <IconButton>
                                <Search />
                            </IconButton>

                    </FlexBetween>
                </FlexBetween>
                
                {/* RIGHT SIDE */}
                <FlexBetween gap="1.5rem">
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === 'dark' ? (
                            <DarkModeOutlined sx={{ fontSize: "25px"}} />
                        ) : (
                            <LightModeOutlined sx={{ fontSize: "25px"}} />
                        )}
                    </IconButton>
                    <IconButton
                    onClick={() => {
                        navigate(`/profile`); 
                    }}
                    >
                        <SettingsOutlined />
                    </IconButton>

                    <FlexBetween>
                        <Button
                            onClick={handleClick} 
                            sx={{
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center", 
                                textTransform: "none", 
                                gap: "1rem"
                                }}
                        >
                        <UserImage image={user.picturePath} height="32px" />
                            
                            <Box textAlign="left">
                                <Typography
                                    fontWeight="bold"
                                    fontSize="0.85rem"
                                    sx={{ color: theme.palette.secondary[100] }}
                                >
                                    {user.name}
                                </Typography>
                                <Typography
                                    fontSize="0.75rem"
                                    sx={{ color: theme.palette.secondary[200] }}
                                >
                                    {user.role}
                                </Typography>
                            </Box>
                            <ArrowDropDownOutlined
                                sx={{color: theme.palette.secondary[300], fontSize: "25px"}}    
                            />
                        
                        </Button>
                        <Menu 
                            anchorEl={anchorEl} 
                            open={isOpen} 
                            onClose={handleClose} 
                            anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                        >
                            <MenuItem onClick={() => dispatch(setLogout())}>
                                Log Out
                            </MenuItem>
                        </Menu>
                    </FlexBetween>
                </FlexBetween>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;