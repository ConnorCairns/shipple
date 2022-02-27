import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Divider, Drawer, IconButton, ListItemButton, Toolbar, Typography, List, ListItemIcon, Box, Container, Grid, Paper, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MapIcon from '@mui/icons-material/Map';
import AddIcon from '@mui/icons-material/Add';
import { ListItemText } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 210;

const CustomAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    })
}));

const CustomDrawer = styled(Drawer, {
    shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        position: 'relative',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(!open && {
            overflowX: "hidden",
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            })
        })
    }
}))

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()

    return (
        <>
            <CustomAppBar position="absolute" open={open}>
                <Toolbar>
                    <IconButton onClick={() => setOpen(!open)} size="large" edge="start" color="inherit" sx={{ mr: 2, ...(open && { display: 'none' }) }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" color="inherit" variant="h6">
                        SHIPPLE
                    </Typography>
                </Toolbar>
            </CustomAppBar>
            <CustomDrawer variant="permanent" open={open}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
                    <IconButton onClick={() => setOpen(!open)} >
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List>
                    <ListItemButton key={"Dashboard"} onClick={() => navigate("/")}>
                        <ListItemIcon >
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    <ListItemButton key={"Create Bar Crawl"} onClick={() => navigate("/crawl")}>
                        <ListItemIcon >
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary="Create Bar Crawl" />
                    </ListItemButton>
                </List>
            </CustomDrawer >
        </>
    )
}

export default Navbar