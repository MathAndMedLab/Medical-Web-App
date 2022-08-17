import React, {useEffect, useState} from "react"
import {Switch, Route, Link, Redirect, NavLink} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

import Home from "./components/main/home.component"
import HomePatient from "./components/main/home-patient.component"
import HomeDoctor from "./components/main/home-doctor.component"
import Profile from "./components/user_profile/profile.component"
import Search from "./components/search/search.component"
import ViewAttachmentsComponent from "./components/attachments/view-attachments.component"
import UploadAttachmentsComponent from "./components/attachments/upload-attachments.component"
import PipelinesComponent from "./components/pipelines/pipelines.component"
import PipelineResultsComponent from "./components/pipelines/pipeline-results.component"
import ViewRecordsComponent from "./components/records/view-records.component"
import CreateRecordComponent from "./components/records/create-record.component"
import RecordThreadComponent from "./components/records/record-thread.component"
import SavePipelineConfigComponent from "./components/pipelines/save-pipeline-config.component"
import TopicComponent from "./components/records/topic.component"
import Register from "./components/signin_signup/register.component"
import Login from "./components/signin_signup/login.component"
import NotExist from "./components/not-exist.component"
import AuthService from "./services/auth.service"
import {
    AppBar,
    Badge,
    CssBaseline,
    Divider, Drawer, Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon, ListItemText, Paper,
    Toolbar, withStyles
} from "@material-ui/core"
import clsx from "clsx"
import MenuIcon from "@material-ui/icons/Menu"
import Typography from "@material-ui/core/Typography"
import NotificationsIcon from "@material-ui/icons/Notifications"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded'
import HomeIcon from '@material-ui/icons/Home'
import BallotIcon from '@material-ui/icons/Ballot'
import ForumIcon from '@material-ui/icons/Forum'
import SearchIcon from '@material-ui/icons/Search'
import MessageIcon from '@material-ui/icons/Message'
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded'
import Chat from "./components/messenger/chat.component"
import SockJS from "sockjs-client"
import {over} from "stompjs"
import UserService from "./services/user.service"
import ChatService from "./services/chat.service"
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@material-ui/core/Button";
import {lightBlue} from "@material-ui/core/colors";
import {Logout, LogoutSharp} from "@mui/icons-material";
import {RemoveRedEye} from "@material-ui/icons";
import {SwipeableDrawer} from "@mui/material";
import NewHomeComponent from "./components/main/newHome.component";

const drawerWidth = 240

const useStyles = theme => ({
    root: {
        display: 'flex',
    },
    drawerPaper: {
        whiteSpace: 'nowrap',
        [theme.breakpoints.down("xs")]: {
            width: 210,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: theme.spacing(26),
        },
        "@media (min-width: 1280px)": {
            width: theme.spacing(32),
        },
        transitions: {
            easing: {
                easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
                easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            },
            duration: {
                enteringScreen: 225,
                leavingScreen: 195,
            },
            backgroundColor: "#808080"

        },
        height: "100%",
        zIndex: theme.zIndex.drawer-100,
    },
    drawerPaperClose: {
        //overflowX: 'scroll',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.leavingScreen,
        }),
        // maxWidth: 60,
        width: theme.spacing(7),
        // [theme.breakpoints.up('sm')]: {
        //     width: theme.spacing(9),
        // },
        height: "100%",
    },
    leftIndent: {
        [theme.breakpoints.down("xs")]: {
            width: 25,
            marginRight: theme.spacing(0)
        },
        width: 60,
        //zIndex: theme.zIndex.drawer+1,
    },
    leftIndentOpen: {
        [theme.breakpoints.down("xs")]: {
            width: 100,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 150
        },
        "@media (min-width: 1280px)": {
            width: 200
        },
        // zIndex: theme.zIndex.drawer+1,

    },
    active: {
        background: '#f4f4f4'
    },
    title: {
        flexGrow: 1,
        margin:'auto',
        color: '#FFFFFF',
        [theme.breakpoints.down("xs")]: {
            width: 100,
        },
        "@media (min-width : 400px)": {
            width: 250,

        },
        "@media (min-width: 1280px)": {
            width: 700,
            //marginRight: "70%",
        },

    },
    appBar: {
        top: 0,
        left: 0,
        minWidth: 600,
        minHeigft: 64,
        maxHeight: 64,
        zIndex: theme.zIndex.drawer+2,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        //marginLeft: drawerWidth,
        //width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    appBarSpacer: theme.mixins.toolbar,
    appBarSpacer2: {
        marginTop: 10,
    },
    menuButton: {
        [theme.breakpoints.down("xs")]: {
            marginRight: 5
        },
        [theme.breakpoints.between("sm","md")]:{
            marginRight: 10
        },
        "@media (min-width: 1280px)" :{
            marginRight: 34
        },
    },
    menuButtonHidden: {
        display: 'none',
    },
    toolbar: {
        paddingRight: "0%",
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '0 8px',
        background: "#3f51b5",
        ...theme.mixins.toolbar,

    },
    content: {
         //width: `calc(100% - ${drawerWidth}px)`,
         //marginLeft: drawerWidth,
    },
    contentClose: {
        // width: '100%',
        //marginLeft: '100px'
    },
    contentOpen : {
        // marginLeft: '250px',
    },
    noticeMsg: {
        backgroundColor: '#FF0040',
        textAlign: 'center',
        color: 'white'
        // width: '100%',
        //marginLeft: '100px'
    },
    regAndLogbuttons: {
        padding: 0,
        margin: 'auto'
    },
    button: {
        flexGrow: 1,
        margin:'auto',
        [theme.breakpoints.down("xs")]:{
            margin: 0,
            padding: theme.spacing(0),
        },
    },
})
let stompClient = null;

function App(props) {


    const LeftMenuOpen = (width) =>{
        React.useEffect(() => {
            const handleResizeWindow = () => setWidth(window.innerWidth);
            // subscribe to window resize event "onComponentDidMount"
            window.addEventListener("resize", handleResizeWindow);
            return () => {
                // unsubscribe "onComponentDestroy"
                window.removeEventListener("resize", handleResizeWindow);
            };
        }, []);
        return width >= 425;
    }

    const {classes} = props
    // const [showModeratorBoard, setShowModeratorBoard] = useState(false)
    // const [showAdminBoard, setShowAdminBoard] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [refresh, setRefresh] = useState({})
    const [width, setWidth] = React.useState(window.innerWidth);
    const [open, setOpen] = useState(LeftMenuOpen(width));

    /**
     * Состояние allMessages имеет вид:
     * key - содержит логин пользователя с кем ведется переписка, value - содержит массив сообщений и переменную,
     * о количестве непрочитанных сообщений с этим пользователем.
     *
     * Состояние usersWithLastMsgReceived имеет вид:
     * key - содержит логин пользователя с кем ведется переписка, value - содержит полную информацию о пользователе
     * с кем ведется переписка и последнее отправленное сообщение с этим пользователем. Необходимо, чтобы отображать список
     * контактов и последнее сообщение с каждым из них.
     *
     * Состояние numberOfUnRead содержит общее количество непрочитанных сообщений.
     *
     * Для лучшего понимания просмотрите console.log() с этими переменными.
     */
    const [allMessages, setAllMessages] = useState(new Map())
    const [usersWithLastMsgReceived, setUsersWithLastMsgReceived] = useState(new Map())
    const [numberOfUnRead, setNumberOfUnRead] = useState(0)

    useEffect(() => {
        const user = AuthService.getCurrentUser()
        if (user) {
            AuthService.checkTokenIsExpired(user.token)
                .then(() => {
                    setCurrentUser(user)
                })
                .catch(error => {
                        logOut()
                    }
                )
            connectToChat()
            getUnreadMessages()
        }
        return () => {
            stompClient.unsubscribe()
        }
    }, [])

    /**
     * Получение всех непрочитанных сообщений, адресованных пользователю.
     */
    function getUnreadMessages() {
        ChatService.getUnreadMessages(AuthService.getCurrentUser().id)
            .then((response) => {
                if (response.data.length > 0) {
                    for (let index = 0; index < response.data.length; index++) {
                        // Проверка есть ли "история переписки" с пользователем от которого имеются непрочитанные
                        // сообщения, если есть, то сообщение добавится к существующим.
                        if (allMessages.get(response.data[index].senderName)) {
                            let list = allMessages.get(response.data[index].senderName).messages
                            list.push(response.data[index])
                            const unRead = allMessages.get(response.data[index].senderName).unRead
                            const valueMap = {unRead: unRead + 1, messages: list}
                            setAllMessages(prev => (prev.set(response.data[index].senderName, valueMap)))
                        } else {
                            let list = []
                            list.push(response.data[index])
                            const valueMap = {unRead: 1, messages: list}
                            setAllMessages(prev => (prev.set(response.data[index].senderName, valueMap)))
                        }
                    }
                    setNumberOfUnRead(response.data.length) // Присвоение состоянию общего кол-ва непрочитанных сообщений.
                }
            })
            .catch((e) => {
                console.log(e)
            })
    }

    /**
     * Подключение к чату через websocket.
     */
    function connectToChat() {
        let Sock = new SockJS('/api/ws')
        stompClient = over(Sock)
        stompClient.debug= null
        stompClient.connect({}, onConnected, onError)
    }

    /**
     * При успешном подключении необходимо подписаться на "канал", куда будут
     * отправляться адресованные пользователю сообщения
     */
    function onConnected() {
        stompClient.subscribe('/topic/' + AuthService.getCurrentUser().username + '/private', onMessageReceived)
    }

    /**
     * Данная функция вызывается при получении сообщения.
     * @param response
     */
    function onMessageReceived(response) {
        let data = JSON.parse(response.body)
        let presenceUserInContacts = false
        let presenceUsername
        for (let username of usersWithLastMsgReceived.keys()) {
            if (username === data.senderName) { // Проверка есть ли пользователь, от которого пришло сообщение в списке контактов.
                presenceUserInContacts = true
                presenceUsername = username
                break
            }
        }
        if (presenceUserInContacts) {
            const userWithLastMessage = usersWithLastMsgReceived.get(presenceUsername)
            userWithLastMessage.second = data
            setUsersWithLastMsgReceived(prev => prev.set(presenceUsername, userWithLastMessage))
        } else { // Если пользователя в списке нет, то необходимо получить данные о нем от сервера.
            UserService.getAllByUsername(data.senderName)
                .then(async (response) => {
                    const user = response.data.shift();
                    if (user.avatar) {
                        const base64Response = await fetch(`data:application/json;base64,${user.avatar}`)
                        const blob = await base64Response.blob()
                        user.avatar = URL.createObjectURL(blob)
                    }
                    let userWithLastMsg = {first: user, second: data}
                    setUsersWithLastMsgReceived(prev => (prev.set(user.username, userWithLastMsg)))
                    setRefresh({})
                })
                .catch((e) => {
                    console.log(e);
                })
        }
        // Проверка есть ли "история переписки" с пользователем от которого пришло сообщение, если есть,
        // то сообщение добавится к существующим.
        if (allMessages.get(data.senderName)) {
            let list = allMessages.get(data.senderName).messages
            const unRead = allMessages.get(data.senderName).unRead
            list.push(data)
            const valueMap = {unRead: unRead + 1, messages: list}
            setAllMessages(prev => (prev.set(data.senderName, valueMap)))
            setNumberOfUnRead(prev => (prev + 1))
        } else {
            let list = []
            list.push(data)
            const valueMap = {unRead: 1, messages: list}
            setAllMessages(prev => (prev.set(data.senderName, valueMap)))
            setNumberOfUnRead(prev => (prev + 1))
            setRefresh({})
        }
    }

    /**
     * Данная функция вызывается в случае не успешного подключения к чату.
     * @param err
     */
    function onError(err) {
        console.log(err)
    }

    function handleDrawerOpen() {
        setOpen(true)
    }

    function handleDrawerClose() {
        setOpen(false)
    }

    function handleDrawerChange() {
        setOpen(!open)
    }

    function logOut() {
        AuthService.logout(AuthService.getCurrentUser().username)
        setCurrentUser(null)
        // this.setState({currentUser: null})
    }

    /*displayPageContent(path) {
        console.log(path)
        this.props.history.push({
            pathname: path,
        })
        window.location.reload()
    }*/

    function getPathForProfile() {
        const currentUser = AuthService.getCurrentUser()
        if (currentUser)
            return "/profile/" + currentUser.username
        else
            return null
    }

    function checkCurrentUser(component) {
        const currentUser = AuthService.getCurrentUser()
        if (currentUser) {
            return component
        } else {
            return <Redirect to="/login"/>
        }
    }

    function minusUnRead(num) {
        setNumberOfUnRead(prev => (prev - num))
    }

    function LeftButtonComponentRender(item){
        if(item.text === 'DICOM Viewer'){
            return  (<ListItemButton
                key={item.text}
                component="a" href={item.href} target={"_blank"}
                title ={item.text}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text}/>
                <ListItemText primary={item.numberMsg}/>
            </ListItemButton>);
        }
        else if (item.text === 'Выход'){
            return (<ListItemButton
                key={item.text}
                component={Link} to={item.path}
                onClick={logOut}
                title={item.text}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text}/>
                <ListItemText primary={item.numberMsg}/>
            </ListItemButton>);
        }
        else{
            return (<ListItemButton
                key={item.text}
                component={Link} to={item.path}
                title ={item.text}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text}/>
                <ListItemText primary={item.numberMsg}/>
            </ListItemButton>);
        }
    }

    const menuItemsForUnregisteredUsers = [
        {
            text: 'Главная',
            icon: <HomeIcon color="secondary"/>,
            path: '/home'
        },
        {
            text: 'Посты',
            icon: <ForumIcon color="secondary"/>,
            path: '/records/view'
        },
    ]
    const menuItemsForRegisteredUsers = [
        {
            text: 'Главная',
            icon: <HomeIcon color="secondary"/>,
            path: '/newHome'
        },
        {
            text: 'Анализ снимков',
            icon: <BallotIcon color="secondary"/>,
            path: '/pipelines/create'
        },
        {
            text: 'Форум',
            icon: <ForumIcon color="secondary"/>,
            path: '/records/view'
        },
        {
            text: 'Поиск',
            icon: <SearchIcon color="secondary"/>,
            path: '/search'
        },
        {
            text: 'Сообщения',
            icon: <MessageIcon color="secondary"/>,
            path: '/msg',
            numberOfUnRead: numberOfUnRead,
            numberMsg: <Paper
                className={classes.noticeMsg}>{
                (numberOfUnRead !== 0 && numberOfUnRead < 999 && numberOfUnRead)
                ||
                (numberOfUnRead !== 0 && numberOfUnRead >= 999 && "999+")}
            </Paper>,
        },
        {
            text: 'DICOM Viewer',
            icon : <RemoveRedEye style={{color: '#f50057'}}/>,
            href: "http://localhost:3000/local",
        },
        {
            text : 'Выход',
            icon : <Logout style={{color: '#f50057'}} />,
            path : '/login',
        },

    ]


    const IconsForNotRegisteredUsers = () =>{
        const [width, setWidth] = React.useState(window.innerWidth);
        const breakpoint_1 = 580;
        React.useEffect(() => {
            const handleResizeWindow = () => setWidth(window.innerWidth);
            // subscribe to window resize event "onComponentDidMount"
            window.addEventListener("resize", handleResizeWindow);
            return () => {
                // unsubscribe "onComponentDestroy"
                window.removeEventListener("resize", handleResizeWindow);
            };
        }, []);
        if(width > breakpoint_1){
            return (
                <Grid container >
                    <Grid item xs/>
                    <Grid item >
                        <ListItemButton
                            sx = {{paddingTop : 0, paddingBottom : 0,'&:hover':{
                                color: "#ffffff",
                            }}}
                            component={Link} to={"/login"}
                        title={"Войти"}
                        >
                            <ListItemText primary={"Войти"} />
                        </ListItemButton>
                    </Grid>
                    <Grid item>
                        <ListItemButton
                            sx = {{paddingTop : 0, paddingBottom : 0,'&:hover':{
                                    color: "#ffffff",
                                }}}
                            component={Link} to={"/register"}
                        title = {"Регистрация"}
                        >
                            <ListItemText primary={"Регистрация"}
                            />
                        </ListItemButton>
                    </Grid>
                </Grid>
            );
        }
        else{
            return (
                <Grid container alignItems={"flex-start"} direction={'column'}>
                    <Grid >
                        <ListItemButton
                            sx = {{paddingTop : 0, paddingBottom : 0,'&:hover':{
                                    color: "#ffffff",
                                }}}
                            component={Link} to={"/login"}
                        >
                            <ListItemText primary={"Войти"}/>
                        </ListItemButton>
                    </Grid>
                    <Grid >
                        <ListItemButton
                            sx = {{paddingTop : 0, paddingBottom : 0,'&:hover':{
                                    color: "#ffffff",
                                }}}
                            component={Link} to={"/register"}>

                            <ListItemText primary={"Регистрация"}/>
                        </ListItemButton>
                    </Grid>
                </Grid>
            );
        }

    }


    const IconsForRegistredUsers = (props) =>{
        const username = props.username;
        const [width, setWidth] = React.useState(window.innerWidth);
        const breakpoint_1 = 588;
        React.useEffect(() => {
            const handleResizeWindow = () => setWidth(window.innerWidth);
            // subscribe to window resize event "onComponentDidMount"
            window.addEventListener("resize", handleResizeWindow);
            return () => {
                // unsubscribe "onComponentDestroy"
                window.removeEventListener("resize", handleResizeWindow);
            };
        }, []);
        if (width > breakpoint_1){
            return (<Grid container>
                <Grid item xs/>
                <Grid item width={'50px'}>
                    <IconButton color="inherit" title={"Уведомления"}>
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                </Grid>
                <Grid item width={'130px'}>
                    <ListItemButton
                        component={Link} to={getPathForProfile()}
                        title={"Профиль"}
                        sx = {{'&:hover': {color : "#ffffff"}}}
                    >
                        <AccountCircleRoundedIcon />
                        <ListItemText primary={username}/>
                    </ListItemButton>
                </Grid>

                {/*<Grid item width={'90px'}>
                    <ListItem
                        button
                        component={Link} to={"/login"}
                        onClick={logOut}>
                        <ListItemText primary={"Выйти"}/>
                    </ListItem>
                </Grid>*/}
            </Grid>);
        }
        else {
            return(
                <Grid container alignItems={"center"} justifyContent={"flex-start"}
                      direction={"row"} >
                    <Grid item width={'25px'} >
                        <IconButton color="inherit" >
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Grid>
                    <Grid container xs={5} direction={"column"} justifyContent={"center"} alignItems={"flex-start"}>
                        <Grid item width={'100px'}>
                            <ListItemButton
                                component={Link} to={getPathForProfile()}
                            >
                                <AccountCircleRoundedIcon сolor = "inherit"/>
                                <ListItemText primary={username}/>
                            </ListItemButton>
                        </Grid>

                        {/*<Grid item width={'100px'} >
                            <ListItemButton
                                sx = {{paddingRight: 0, paddingTop : 0,paddingBottom : 0}}
                                component={Link} to={"/login"}
                                onClick={logOut}>
                                <ListItemText primary={"Выйти"}/>
                            </ListItemButton>
                        </Grid>*/}
                    </Grid>
                </Grid>
            );
        }

    }


    function ContainerBorder(){
        const [width, setWidth] = React.useState(window.innerWidth);
        React.useEffect(() => {
            const handleResizeWindow = () => setWidth(window.innerWidth);
            // subscribe to window resize event "onComponentDidMount"
            window.addEventListener("resize", handleResizeWindow);
            return () => {
                // unsubscribe "onComponentDestroy"
                window.removeEventListener("resize", handleResizeWindow);
            };
        }, []);
        if(width <= 320){
            return "container mt-3 ml-0 pl-0";
        }
        else if(width <= 375 ){
            return "container mt-3 ml-3 pl-0";
        }
        else if(width <= 450){
            return "container mt-3 ml-3";
        }
        else if (width <= 600){
            return "container mt-3 ";
        }
        else if(width <= 768){
            return "container mt-3";
        }
        else if(width <= 1024){
            return "container mt-3 ml-1 pl-0";
        }
        else {
            return "container mt-3";
        }
    }

    function MyDrawer(props){
        const classes = props.classes;
        const open = props.open;
        React.useEffect(() => {
            const handleResizeWindow = () => setWidth(window.innerWidth);
            // subscribe to window resize event "onComponentDidMount"
            window.addEventListener("resize", handleResizeWindow);
            return () => {
                // unsubscribe "onComponentDestroy"
                window.removeEventListener("resize", handleResizeWindow);
            };
        }, []);
        if(width <=425){
        return (
            <Drawer
                height="100%"
                // variant={"persistent"}
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
                onClick={handleDrawerChange}
            >
                {open && (<div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <Typography component="h2" variant={"h5"} noWrap style={{color: "white"}}>Med-Web-App</Typography>
                        <ChevronLeftIcon style={{color: "#ffffff"}}/>
                    </IconButton>
                </div>)}
                {!open && (<div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerOpen}>
                        <Typography component="h2" variant={"h5"} noWrap style={{color: "white"}}>Med-Web-App</Typography>
                        <ChevronLeftIcon style={{color: "#ffffff"}}/>
                    </IconButton>
                </div>)}
                <Divider/>

                <List>
                    {currentUser && (
                        menuItemsForRegisteredUsers.map((item) => (
                           LeftButtonComponentRender(item)
                        )))
                    }
                    {!currentUser && (
                        menuItemsForUnregisteredUsers.map((item) => (
                            <ListItemButton
                                key={item.text}
                                //onClick={() => this.displayPageContent(item.path)}
                                component={Link} to={item.path}
                                title = {item.text}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text}/>

                            </ListItemButton>
                        )))
                    }
                </List>
            </Drawer>

        );
    }
    else{
           return(
               <Drawer
                height="100%"
                variant= "permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
                onClick={handleDrawerChange}
           >
                {open && (<div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>)}
                {!open && (<div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerOpen}>
                        <ChevronRightRoundedIcon/>
                    </IconButton>
                </div>)}
                <Divider/>

                <List>
                    {currentUser && (
                        menuItemsForRegisteredUsers.map((item) => (
                            LeftButtonComponentRender(item)
                        )))
                    }
                    {!currentUser && (
                        menuItemsForUnregisteredUsers.map((item) => (
                            <ListItemButton
                                key={item.text}
                                //onClick={() => this.displayPageContent(item.path)}
                                component={Link} to={item.path}
                                title={item.text}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text}/>
                            </ListItemButton>
                        )))
                    }
                </List>
            </Drawer>);
    }
    }

    function ExitOrNot(text){
        if(text === 'Выход'){
            return logOut;
        }
    }

    function DicomViewerInternetPath(){
        const url = window.location.href
        const num = url.indexOf(":7999")
        return url.slice(0, num + 1) + "3000/local/";
    }

    return (
        <div className={classes.root}>
            <CssBaseline/>

            <AppBar position="fixed" className={clsx(classes.appBar, false && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerChange}
                        className={clsx(classes.menuButton, false && classes.menuButtonHidden)}
                        title={"Меню"}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <ListItemButton component={Link} to={"/newHome"} variant={"text"} className={classes.button} color={"inherit"}
                    disableGutters title={"На главную страницу"}>
                        <Typography component="h1" variant="h6" color="inherit" noWrap
                                className={classes.title}>
                        Medical web app
                    </Typography>
                    </ListItemButton>
                    {currentUser && (
                        <IconsForRegistredUsers username = {currentUser.username}/>
                    )}

                    {!currentUser && (
                        <IconsForNotRegisteredUsers/>
                    )}

                </Toolbar>
            </AppBar>

            <Grid container>
                <Grid item className={clsx(classes.leftIndent, open && classes.leftIndentOpen)}>
                  <MyDrawer open = {open} classes = {classes}/>
                </Grid>
                <Grid item xs className={clsx(classes.content, open && classes.contentOpen)}>
                    <div className={classes.appBarSpacer}/>
                    <div className={classes.appBarSpacer2}/>
                    <div className={ContainerBorder()} style={(open && {
                        justifyContent : "center",
                        marginLeft: 0
                    }) || (!open && {
                        justifyContent:"center"
                    })
                    }>
                        <Switch>
                            <Route exact path={["/","/newHome"]} component={NewHomeComponent}/>
                            <Route exact path="/home/patient" component={HomePatient}/>
                            <Route exact path="/home/doctor" component={HomeDoctor}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path={["/msg", "/msg/:selected"]}>
                                {((AuthService.getCurrentUser())) ?
                                    (<Chat stompClient={stompClient} allMessages={allMessages}
                                           setAllMessages={setAllMessages}
                                           number={numberOfUnRead} minusUnRead={minusUnRead}
                                           usersWithLastMsg={usersWithLastMsgReceived}
                                           setUsersWithLastMsg={setUsersWithLastMsgReceived}
                                    />) : (<Redirect to="/login"/>)}
                            </Route>
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/search">
                                {AuthService.getCurrentUser() ? <Search/> : <Redirect to="/login"/>}
                            </Route>
                            <Route exact path={["/profile/:usernamePath"]}>
                                {AuthService.getCurrentUser() ? <Profile/> : <Redirect to="/login"/>}
                            </Route>
                            <Route exact path="/pipelines/create" component={PipelinesComponent}>
                                {AuthService.getCurrentUser() ? <PipelinesComponent/> : <Redirect to="/login"/>}
                            </Route>
                            <Route exact path="/pipelines/results" component={PipelineResultsComponent}>
                                {AuthService.getCurrentUser() ? <PipelineResultsComponent/> : <Redirect to="/login"/>}
                            </Route>
                            <Route exact path="/pipelines/save" component={SavePipelineConfigComponent}>
                                {AuthService.getCurrentUser() ? <SavePipelineConfigComponent/> :
                                    <Redirect to="/login"/>}
                            </Route>
                            <Route exact path="/files/view" component={ViewAttachmentsComponent}>
                                {AuthService.getCurrentUser() ? <ViewAttachmentsComponent/> : <Redirect to="/login"/>}
                            </Route>
                            <Route exact path="/files/upload" component={UploadAttachmentsComponent}>
                                {AuthService.getCurrentUser() ? <UploadAttachmentsComponent/> : <Redirect to="/login"/>}
                            </Route>
                            <Route exact path="/records/view" component={ViewRecordsComponent}/>
                            <Route exact path="/records/create" component={CreateRecordComponent}/>
                            <Route path="/records/thread/:recordId" component={RecordThreadComponent}/>
                            <Route exact path="/topics/create" component={TopicComponent}>
                                {AuthService.getCurrentUser() ? <TopicComponent/> : <Redirect to="/login"/>}
                            </Route>
                            <Route component={NotExist}/>
                        </Switch>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default withStyles(useStyles)(App)