import React, { useEffect, useState } from "react"
import { Switch, Route, Link, Redirect, NavLink } from "react-router-dom"
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
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded'
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded';
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
import ProfileEditComponent from "./components/user_profile/profile-edit.component";
import { useLocation } from "react-router-dom";
import Hidden from '@material-ui/core/Hidden';
import background from "./components/main/backgroundHome.jpg";

const drawerWidth = 240

const useStyles = theme => ({
    root: {
        display: 'flex',
        overflowX: 'hidden',
    },
    rootHome: {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        height: '100vh',
    },
    drawerPaper: {
        position: "fixed",
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
        zIndex: theme.zIndex.drawer - 100,
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        height: "100%",
    },
    leftIndent: {
        [theme.breakpoints.down("xs")]: {
            width: 100,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 150
        },
        "@media (min-width: 1280px)": {
            width: 200,
        },
        zIndex: theme.zIndex.drawer+1,
    },

    active: {
        background: '#f4f4f4'
    },
    title: {
        flexGrow: 1,
        margin: 'auto',
        color: '#FFFFFF',
        [theme.breakpoints.down("xs")]: {
            width: 100,
        },
        "@media (min-width : 400px)": {
            width: 250,
        },
        "@media (min-width : 960px)": {
            width: 220,

        },
        "@media (min-width: 1280px)": {
            width: 200,
            //marginRight: "70%",
        },
    },
    appBar: {
        top: 0,
        left: 0,
        minWidth: 30,
        minHeight: 64,
        maxHeight: 64,
        zIndex: theme.zIndex.drawer + 2,
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
            marginRight: 10
        },
        [theme.breakpoints.only("sm")]:{
            marginRight: 20
        },
        [theme.breakpoints.only("md")]:{
            marginRight: 27
        },
        "@media (min-width: 1280px)" :{
            marginRight: 34
        },
    },
    menuButtonHidden: {
        display: 'none',
    },
    toolbar: {
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(0.5),
            marginLeft: theme.spacing(1),
        },
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
        "@media (min-width : 600px)": {
            marginLeft: theme.spacing(7),
        },
    },
    innerContent: {
    },
    contentClose: {
        width: '100%',
        marginLeft: '100px'
    },
    contentOpen : {
        width: '100%',
        marginLeft: '250px',
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
        margin: 'auto',
        [theme.breakpoints.down("xs")]: {
            margin: 0,
            padding: theme.spacing(0),
        },
    },
    homeButton: {
        flexGrow: 1,
        margin:'auto',
    },
    
})
let stompClient = null;




function App(props) {
    const location = useLocation();
    const {classes} = props
    // const [showModeratorBoard, setShowModeratorBoard] = useState(false)
    // const [showAdminBoard, setShowAdminBoard] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [refresh, setRefresh] = useState({})
    const [width, setWidth] = React.useState(window.innerWidth);
    const [open, setOpen] = useState(false);
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
    const [chatsWithLastMsgReceived, setChatsWithLastMsgReceived] = useState(new Map())
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

    useEffect(() => {
        if (location.pathname == "/login")
        {
            setCurrentUser(null)
        }
    }, [location.pathname])

  

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
                            list.push({msg: response.data[index], checked: false})
                            const unRead = allMessages.get(response.data[index].senderName).unRead
                            const valueMap = { unRead: unRead + 1, messages: list }
                            setAllMessages(prev => (prev.set(response.data[index].senderName, valueMap)))
                        } else {
                            let list = []
                            list.push({msg: response.data[index], checked: false})
                            const valueMap = { unRead: 1, messages: list }
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
        stompClient.debug = null
        stompClient.connect({}, onConnected, onError)
    }

    /**
     * При успешном подключении необходимо подписаться на "канал", куда будут
     * отправляться адресованные пользователю сообщения
     */
    function onConnected() {
        stompClient.subscribe('/topic/' + AuthService.getCurrentUser().username + '/private', onMessageReceived)
        stompClient.subscribe('/topic/' +
            AuthService.getCurrentUser().username +
            '/private-group-chat', onMessageReceivedGroupChat)
    }

    function checkHistoryChat(data, chatId) {
        console.log(data)
        if (allMessages.get(chatId)) {
            let list = allMessages.get(chatId).messages
            const unRead = allMessages.get(chatId).unRead
            list.push({msg: data, checked: false})
            const valueMap = { unRead: unRead + 1, messages: list }
            setAllMessages(prev => (prev.set(chatId, valueMap)))
            setNumberOfUnRead(prev => (prev + 1))
        } else {
            let list = []
            list.push({msg: data, checked: false})
            const valueMap = { unRead: 1, messages: list }
            setAllMessages(prev => (prev.set(chatId, valueMap)))
            setNumberOfUnRead(prev => (prev + 1))
            setRefresh({})
        }
    }

    function onMessageReceivedGroupChat (response) {
        let data = JSON.parse(response.body)
        let chatMembership = false
        let chat
        for (let chatId of chatsWithLastMsgReceived.keys()) {
            if (chatId === data.chatId) { // Проверка есть ли пользователь, в чате от которого пришло сообщение.
                chatMembership = true
                chat = chatId
                break
            }
        }

        if (chatMembership) {
            const chatsWithLastMsg = chatsWithLastMsgReceived.get(chat)
            chatsWithLastMsg.second = data
            setChatsWithLastMsgReceived(prev => prev.set(chat, chatsWithLastMsg))
        } else { // Если пользователя в списке нет, то необходимо получить данные о нем от сервера.
            ChatService.getGroupChat(data.chatId)
                .then(async (response) => {
                    const chatRoom = response.data.shift()
                    if (chatRoom.avatar) {
                        const base64Response = await fetch(`data:application/json;base64,${chatRoom.avatar}`)
                        const blob = await base64Response.blob()
                        chatRoom.avatar = URL.createObjectURL(blob)
                    }
                    let chatsWithLastMsg = { first: chatRoom, second: data }
                    setChatsWithLastMsgReceived(prev => (prev.set(chatRoom.chatId, chatsWithLastMsg)))
                    setRefresh({})
                })
                .catch((e) => {
                    console.log(e);
                })
        }
        // Проверка есть ли "история переписки" с пользователем от которого пришло сообщение, если есть,
        // то сообщение добавится к существующим.
        checkHistoryChat(data, data.chatId)
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
                    const user = response.data.shift()
                    if (user.avatar) {
                        const base64Response = await fetch(`data:application/json;base64,${user.avatar}`)
                        const blob = await base64Response.blob()
                        user.avatar = URL.createObjectURL(blob)
                    }
                    let userWithLastMsg = { first: user, second: data }
                    setUsersWithLastMsgReceived(prev => (prev.set(user.username, userWithLastMsg)))
                    setRefresh({})
                })
                .catch((e) => {
                    console.log(e);
                })
        }
        // Проверка есть ли "история переписки" с пользователем от которого пришло сообщение, если есть,
        // то сообщение добавится к существующим.
        checkHistoryChat(data, data.senderName)
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
    }
    
    document.addEventListener('click', function() {
        handleDrawerClose();
    });

    window.addEventListener('resize', (e) => {
        setWidth(window.innerWidth);
    });
    
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
            return <Redirect to="/login" />
        }
    }

    function isLogIn() {
        const currentUser = AuthService.getCurrentUser()
        if (currentUser) {
            AuthService.checkTokenIsExpired(currentUser.token)
                .then(() => {
                    return true
                })
                .catch(error => {
                        setCurrentUser(null)
                        return false
                    }
                )
        } 
        else {
            setCurrentUser(null)
            return false
        }
    }

    function minusUnRead(num) {
        setNumberOfUnRead(prev => (prev - num))
    }

    function LeftButtonComponentRender(item) {
        if (item.text === 'DICOM Viewer') {
            return (<ListItemButton
                key={item.text}
                component="a" href={item.href} target={"_blank"}
                title={item.text}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                <ListItemText primary={item.numberMsg} />
            </ListItemButton>);
        }
        else {
            return (<ListItemButton
                key={item.text}
                component={Link} to={item.path}
                title={item.text}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                <ListItemText primary={item.numberMsg} />
            </ListItemButton>);
        }
    }

    const menuItemsForUnregisteredUsers = [
        {
            text: 'Главная',
            icon: <HomeIcon style={{ color: '#f50057' }}/>,
            path: '/newHome'
        },
        {
            text: 'Посты',
            icon: <ForumIcon style={{ color: '#f50057' }} />,
            path: '/records/view'
        },
    ]
    const menuItemsForRegisteredUsers = [
        {
            text: 'Главная',
            icon: <HomeIcon style={{ color: '#f50057' }} />,
            path: '/newHome'
        },
        {
            text: 'Анализ снимков',
            icon: <BallotIcon style={{ color: '#f50057' }} />,
            path: '/pipelines/create'
        },
        {
            text: 'Форум',
            icon: <ForumIcon style={{ color: '#f50057' }} />,
            path: '/records/view'
        },
        {
            text: 'Сообщения',
            icon: <MailOutlineIcon style={{ color: '#f50057' }} />,
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
            icon: <RemoveRedEye style={{ color: '#f50057' }} />,
            href: "http://localhost:3000/local",
        },
    ]


    const IconsForNotRegisteredUsers = () =>{
        return (
            <Grid container >
                <Grid item xs />
                <Grid item >
                    <ListItemButton
                        sx={{
                            paddingTop: 0, paddingBottom: 0, '&:hover': {
                                color: "#ffffff",
                            }
                        }}
                        component={Link} to={"/login"}
                        title={"Войти"}
                    >
                        <ListItemText primary={"Войти"} />
                    </ListItemButton>
                </Grid>
                <Grid item>
                    <ListItemButton
                        sx={{
                            paddingTop: 0, paddingBottom: 0, '&:hover': {
                                color: "#ffffff",
                            }
                        }}
                        component={Link} to={"/register"}
                        title={"Регистрация"}
                    >
                        <ListItemText primary={"Регистрация"}
                        />
                    </ListItemButton>
                </Grid>
            </Grid>
        );
    }


    const IconsForRegistredUsers = (props) => {
        const username = props.username;
        const breakpoint_1 = 588;
        if (width > breakpoint_1){
            return (<Grid container>
                <Grid item xs />
                <Grid item width={'50px'}>
                    <Link to={'/search'}>
                        <IconButton 
                            title={"Поиск"}
                            >
                                <SearchIcon style={{color: "#fff" }}/>
                        </IconButton>
                    </Link>
                </Grid>
                <Grid item width={'50px'}>
                    <IconButton color="inherit" title={"Уведомления"}>
                        <Badge badgeContent={3} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                </Grid>
                <Hidden smDown>
                    <Grid item width={'130px'}>
                        <ListItemButton
                            component={Link} to={getPathForProfile()}
                            title={"Профиль"}
                            sx={{ '&:hover': { color: "#ffffff" } }}
                        >
                            <AccountCircleRoundedIcon />
                            <ListItemText primary={username} />
                        </ListItemButton>
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    <Grid item width={'50px'}>
                        <Link to={getPathForProfile()}>
                            <IconButton 
                                title={"Профиль"}
                                >
                                    <AccountCircleRoundedIcon style={{color: "#fff" }}/>
                            </IconButton>
                        </Link>
                    </Grid>
                </Hidden>
                
            </Grid>);
        }
        else {
            return(
                <Grid container alignItems={"flex-end"} justifyContent={"flex-end"}
                      direction={"row"} >
                    <Grid item width={'25px'}>
                        <Link to={'/search'}>
                            <IconButton 
                                title={"Поиск"}
                                >
                                    <SearchIcon style={{color: "#fff" }}/>
                            </IconButton>
                        </Link>
                    </Grid>
                    <Grid item width={'25px'} >
                        <IconButton color="inherit" >
                            <Badge badgeContent={4} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                    </Grid>
                    <Hidden smDown>
                        <Grid item width={'100px'}>
                            <ListItemButton
                                component={Link} to={getPathForProfile()}
                            >
                                <AccountCircleRoundedIcon сolor = "inherit"/>
                                <Hidden smDown>
                                    <ListItemText primary={username} />
                                </Hidden>
                            </ListItemButton>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        <Grid item width={'25px'}>
                            <Link to={getPathForProfile()}>
                                <IconButton 
                                    title={"Профиль"}
                                    >
                                        <AccountCircleRoundedIcon style={{color: "#fff" }}/>
                                </IconButton>
                            </Link>
                        </Grid>
                    </Hidden>
                </Grid>
            );
        }

    }


    function ContainerBorder(){
        return "container mt-3";
    }


    function MyDrawer(props){
        const classes = props.classes;
        const open = props.open;
        
        if(width < 600){
            return (
                <Drawer
                    height="100%"
                    variant={"persistent"}
                    classes={{
                        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                    }}
                    open={open}
                    onClick={handleDrawerChange}
                >
                    {open && (<div className={classes.toolbarIcon}>
                        <IconButton onClick={handleDrawerClose}>
                            <Typography component="h2" variant={"h5"} noWrap style={{ color: "white" }}>Med-Web-App</Typography>
                            <ChevronLeftIcon style={{ color: "#ffffff" }} />
                        </IconButton>
                    </div>)}
                    {!open && (<div className={classes.toolbarIcon}>
                        <IconButton onClick={handleDrawerOpen}>
                            <Typography component="h2" variant={"h5"} noWrap style={{ color: "white" }}>Med-Web-App</Typography>
                            <ChevronLeftIcon style={{ color: "#ffffff" }} />
                        </IconButton>
                    </div>)}
                    <Divider />

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
                                    component={Link} to={item.path}
                                    title={item.text}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />

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
                anchor="left"
                variant= "permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
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

    function ExitOrNot(text) {
        if (text === 'Выход') {
            return logOut;
        }
    }

    function DicomViewerInternetPath() {
        const url = window.location.href
        const num = url.indexOf(":7999")
        return url.slice(0, num + 1) + "3000/local/";
    }

    function IsHomePage() {
        return (window.location.href.split('/')[4] === "newHome" || window.location.href.split('/')[4] === "")
    }


    return (
        <div className={clsx(classes.root, (window.location.href.split('/')[4] === "newHome" || window.location.href.split('/')[4] === "") && classes.rootHome)}>
            <CssBaseline />

            <AppBar position="fixed" className={clsx(classes.appBar, false && classes.appBarShift)}>
                <Toolbar className={classes.toolbar} >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick= {e => e.stopPropagation() || handleDrawerChange()}
                        className={clsx(classes.menuButton, false && classes.menuButtonHidden)}
                        title={"Меню"}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Hidden only="xs">
                        <ListItemButton  component={Link} to={"/newHome"} variant={"text"} className={classes.button} color={"inherit"}
                disableGutters title={"На главную страницу"}>
                            <Typography component="h1" variant="h6" color="inherit" noWrap
                                    className={classes.title}>
                                    Medical web app
                            </Typography>
                        </ListItemButton>
                    </Hidden>
                    <Hidden smUp>
                        <Link to={'/newHome'} >
                            <IconButton 
                                title={"На главную страницу"}
                                size="large"
                                className={classes.homeButton}
                                >
                                    <MedicationRoundedIcon style={{color: "#fff" }}/>
                            </IconButton>
                        </Link>
                    </Hidden>
                    
                    {currentUser && (
                        <IconsForRegistredUsers username={currentUser.username} />
                    )}

                    {!currentUser && (
                        <IconsForNotRegisteredUsers />
                    )}

                </Toolbar>
            </AppBar>
            <div >
                 <MyDrawer open = {open} classes = {classes} id="menu_bar" className={clsx(classes.leftIndent)}/>
            </div>
            <Grid container className={classes.content}>
                <Grid item xs className={(IsHomePage()) && clsx(ContainerBorder())}>
                    <div className={classes.appBarSpacer}/>
                    <div className={classes.appBarSpacer2}/>
                    <div className={(!IsHomePage()) &&clsx(ContainerBorder())} >
                        <Switch>
                            <Route exact path={["/","/newHome"]} >
                                <NewHomeComponent />
                            </Route>
                            <Route exact path="/home/patient" component={HomePatient}/>
                            <Route exact path="/home/doctor" component={HomeDoctor}/>
                            <Route exact path="/login" component={Login} />
                            <Route exact path={["/msg", "/msg/:selected"]}>
                                {((AuthService.getCurrentUser())) ?
                                    (<Chat stompClient={stompClient} allMessages={allMessages}
                                           setAllMessages={setAllMessages}
                                           number={numberOfUnRead} minusUnRead={minusUnRead}
                                           usersWithLastMsg={usersWithLastMsgReceived}
                                           setUsersWithLastMsg={setUsersWithLastMsgReceived}
                                           chatsWithLastMsg={chatsWithLastMsgReceived}
                                           setChatsWithLastMsg={setChatsWithLastMsgReceived}
                                    />) : (<Redirect to="/login" />)}
                            </Route>
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/search">
                                {AuthService.getCurrentUser() ? <Search /> : <Redirect to="/login" />}
                            </Route>
                            <Route exact path={["/profile/:usernamePath"]}>
                                {AuthService.getCurrentUser() ? <Profile /> : <Redirect to="/login" />}
                            </Route>
                            <Route exact path="/pipelines/create" component={PipelinesComponent}>
                                {AuthService.getCurrentUser() ? <PipelinesComponent /> : <Redirect to="/login" />}
                            </Route>
                            <Route exact path="/pipelines/results" component={PipelineResultsComponent}>
                                {AuthService.getCurrentUser() ? <PipelineResultsComponent /> : <Redirect to="/login" />}
                            </Route>
                            <Route exact path="/pipelines/save" component={SavePipelineConfigComponent}>
                                {AuthService.getCurrentUser() ? <SavePipelineConfigComponent /> :
                                    <Redirect to="/login" />}
                            </Route>
                            <Route exact path="/files/view" component={ViewAttachmentsComponent}>
                                {AuthService.getCurrentUser() ? <ViewAttachmentsComponent /> : <Redirect to="/login" />}
                            </Route>
                            <Route exact path="/files/upload" component={UploadAttachmentsComponent}>
                                {AuthService.getCurrentUser() ? <UploadAttachmentsComponent /> : <Redirect to="/login" />}
                            </Route>
                            <Route exact path="/records/view" component={ViewRecordsComponent} />
                            <Route exact path="/records/create" component={CreateRecordComponent}>
                                <CreateRecordComponent open={open}/>
                            </Route>
                            <Route path="/records/thread/:recordId" component={RecordThreadComponent} >
                                <RecordThreadComponent open={open} recordId={window.location.href.split('/')[6]}/>
                            </Route>
                            <Route exact path="/topics/create" component={TopicComponent}>
                                {AuthService.getCurrentUser() ? <TopicComponent open = {open} /> : <Redirect to="/login" />}
                            </Route>
                            <Route exact path="/edit" component={ProfileEditComponent}>
                                {AuthService.getCurrentUser() ? <ProfileEditComponent/> : <Redirect to="/login" />}
                            </Route>
                            <Route component={NotExist} />
                        </Switch>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default withStyles(useStyles)(App)