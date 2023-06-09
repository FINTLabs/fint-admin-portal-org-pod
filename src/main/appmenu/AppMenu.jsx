import React, {useEffect, useState} from "react";
import createStyles from '@mui/styles/createStyles';
import classNames from "classnames";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuItems from "./MenuItems";
import Routes from "../routes/Routes";
import { Box, useTheme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import {useDispatch} from "react-redux";
import MeApi from "../../data/api/MeApi";
import FintLogo from "../../images/fint-by-vigo-white.svg";

const drawerWidth = 240;

const useStyles = makeStyles((theme) =>
    createStyles({
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        menuButton: {
            marginLeft: 12,
            marginRight: 36
        },
        hide: {
            display: "none"
        },
        drawerPaper: {
            position: "relative",
            whiteSpace: "nowrap",
            width: drawerWidth,
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        drawerPaperClose: {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9)
            }
        },
        toolbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 8px",
            ...theme.mixins.toolbar
        },
        content: {
            width: "100%",
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: 24,
            minHeight: "100vh",
            marginTop: 56,
            [theme.breakpoints.up("sm")]: {
                height: "calc(100% - 64px)",
                marginTop: 64
            }
        },
        logo: {
            width: 86,
            marginRight: theme.spacing(4),
            marginBottom: theme.spacing()
        },
        flex: {
            flex: 1
        },
        flexName: {
            flex: 1,
            textAlign: "end",
            marginBottom: "2px"
        },
    }));

const AppMenu = () => {

    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const [me, setMe] = useState();
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const dispatch = useDispatch();

    useEffect(() => {
        MeApi.getMe().then(me => {
            console.log(me);
            setMe(me);
        });
    }, [dispatch]);

    const handleDrawerClose = () => {
        setOpen(false);
    };


    return (
        <Box display="flex" position="relative" width={1} height={1}>
            <AppBar
                position="absolute"
                className={classNames(classes.appBar, open && classes.appBarShift)}
            >
                <Toolbar disableGutters={!open}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={classNames(classes.menuButton, open && classes.hide)}
                        size="large">
                        <MenuIcon/>
                    </IconButton>
                    <img src={FintLogo} alt="logo" className={classes.logo}
                         onClick={() => window.location = "/"}/>
                    <Typography variant="h6" color="inherit" noWrap className={classes.flex}>
                        Admin Portal
                    </Typography>
                    <Typography style={{position: 'absolute', right: '2%'}} variant="subtitle1"
                                color="inherit" noWrap>
                        {me && me.fullName}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose} size="large">
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <MenuItems/>
            </Drawer>
            <main className={classes.content}>
                <Routes/>
            </main>
        </Box>
    );

}

export default AppMenu;
