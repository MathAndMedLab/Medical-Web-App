import {
    Card,
    Divider,
    IconButton,
    InputBase,
    List,
    ListItem,
    Paper,
    TextField,
    Typography,
    withStyles,
    makeStyles, Badge
} from "@material-ui/core"
import {Link, useParams} from "react-router-dom"
import React, {useEffect, useRef, useState} from "react"
import UserService from "../../services/user.service"
import Grid from "@material-ui/core/Grid"
import AuthService from "../../services/auth.service"
import AttachmentService from "../../services/attachment.service"
import Button from "@material-ui/core/Button"
import ListItemButton from "@mui/material/ListItemButton"
import UserCardMessage from "./user-card-msg.component"
import ChatService from "../../services/chat.service"
import RecipientMsg from "./recipient.msg.component"
import SenderMsg from "./sender.msg.component"
import Avatar from "@material-ui/core/Avatar"
import AttachFileIcon from "@mui/icons-material/AttachFile"
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import SendIcon from "@mui/icons-material/Send"
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CancelIcon from '@mui/icons-material/Cancel'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import Dropdown from "react-bootstrap/Dropdown"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import DropdownButton from "react-bootstrap/DropdownButton"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import Input from "@material-ui/core/Input"
import Chip from "@material-ui/core/Chip"
import FormControl from "@material-ui/core/FormControl"
import Container from "@material-ui/core/Container"
import InputLabel from "@material-ui/core/InputLabel"
import Modal from "react-bootstrap/Modal"
import Upload from "./upload-files.component"
import Checkbox from "@mui/material/Checkbox"
import ChatCardMsg from "./chat-card-msg.component"
import NotificationMsg from "./notification-msg.component"

/**
 * Стили для компонентов mui и react.
 */
const useStyles = theme => ({
    root: {
        marginLeft: 6,
        marginRight: 6,
        backgroundColor:"#fff",
        "& .MuiFormLabel-root": {
            margin: 0,
            color: "black"
        }
    },
    inputSearchContacts: {
        "& .MuiFormLabel-root": {
            margin: 0,
            color: "black"
        }
    },
    inputSearchMsg: {
        "& .MuiFormLabel-root": {
            margin: 0,
            color: "black"
        }
    },
    groupChat: {
        margin: 3,
        right: 0
    },
    paper: {
        color: "black",
        minWidth: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
    },
    paper2: {
        color: "black",
        minWidth: "300px",
    },
    paper3: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    layout: {
        width: "auto",
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 400,
            marginLeft: "auto",
            marginRight: "auto",
        },
    },
    mainGrid: {

    },
    messengerCard: {
      minWidth: 301,
      width: "100%",
      borderRadius: 10,
      height: "calc(100vh - 94px)",
      overflowY: 'auto',
      "@media (max-height: 600px)": {
          minHeight: 505
      },
    },
    button: {
        '&:active': {
            backgroundColor: '#bdff59',
        }
    },
    msgMy: {
        width: "fit-content",
        height: "fit-content",
        margin: 20,
        marginLeft: "auto",
        backgroundColor: '#a1e9ff',
        padding: theme.spacing(0.5),
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        maxWidth: 400,
    },
    msgNotMy: {
        width: "fit-content",
        height: "fit-content",
        margin: 20,
        padding: theme.spacing(0.5),
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        maxWidth: 400,
        elevation: 2
    },
    txt: {
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 10
    },
    itemButton: {
        padding: 0,
        overflowY: "auto",
        '&::-webkit-scrollbar': {
            width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
        },
        "@media (max-height: 600px)": {
            minHeight: 446
        },
        "@media (max-width: 1200px)": {
            minWidth: 301
        },
    },
    itemButtonGroupChat: {
        padding: 0,
        overflowY: "auto",
        '&::-webkit-scrollbar': {
            width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
        },
    },
    divider: {
        width: 3,
        borderRadius: 10,
        height: 45,
        backgroundColor: "#7e7e7e"
    },
    usersGrid: {
        height: 440,
        overflowY: "auto",
        marginBottom: theme.spacing(1.5),
    },
    active: {
        backgroundColor: '#FF0040',
    },
    avatar: {
        width: 45,
        height: 45,
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(-1),
    },
    avatarForCreateChat: {
        width: 45,
        height: 45,
        margin: theme.spacing(1),
        cursor: "pointer"
    },
    avatarManageGroupChat: {
        width: 100,
        height: 100,
        margin: theme.spacing(1),
        cursor: "pointer"
    },
    flex: {
        display: 'flex',
    },
    lastMsgTextContent: {
        color: '#888888',
    },
    gridFullWidth: {
        width: '100%'
    },
    gridAlignCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonChat: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: "70px",
    },
    iconInput: {
        backgroundColor: "#3f51b5",
        borderRadius: '5px',
        height: 56,
        width: "auto",
    },
    searchIcon: {
    },
    rootSelect: {
        "& .MuiFormLabel-root": {
            margin: 0,
        },
    },
    formControl: {
        "& .MuiFormLabel-root": {
            margin: 0,
        },
        width: "100%",
    },
    chips: {
        display: "flex",
        flexWrap: "wrap",
    },
    chip: {
        margin: 2,
    },
    chipsGroupChat: {
        display: "flex",
        justifyContent: "left",
        flexWrap: "nowrap",
        listStyle: "none",
        height: 50,
        overflowX: "auto",
        '&::-webkit-scrollbar': {
            width: '0.3em',
            height: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
        }
    },
    clearIcon: {
        color: "#000000",
        height: 20,
        width: 20,
        '&:hover': {
            color: "#707070",
        },
    },
    gridText: {
        color: "black",
        fontSize: 15,
        fontWeight: 450,
        alignItems: "left"
    },
    cancelIcon: {
        color: '#464646',
        width: 25,
        height: 25,
        marginRight: 10,
        marginTop: 10,
        cursor: 'pointer',
        '&:hover': {
            color: '#a4a4a4'
        }
    }
})

function Chat(props) {
    const {stompClient} = props
    const {minusUnRead} = props
    const {usersWithLastMsg} = props
    const {setUsersWithLastMsg} = props
    const {chatsWithLastMsg} = props
    const {setChatsWithLastMsg} = props
    const {allMessages} = props
    const {setAllMessages} = props
    const {classes} = props
    const {selected} = useParams() // Для selected устанавливается строка с логином, полученным из url. Например medwebapp.ru/msg/SELECTED_USERNAME
    const [processedUnreadMessages, setProcessedUnreadMessages] = useState([])
    const [content, setContent] = useState("")
    const [contentPresence, setContentPresence] = useState(false)
    const [contentCorrect, setContentCorrect] = useState("")

    const [searchContent, setSearchContent] = useState("")
    const [searchMessageButton, setSearchMessageButton] = useState(false)
    const [searchContacts, setSearchContacts] = useState("")
    const [searchChats, setSearchChats] = useState("")

    const [menuGroupChat, setMenuGroupChat] = useState(false)
    const [forwardChat, setForwardChat] = useState(false)
    const [manageGroupChat, setManageGroupChat] = useState(false)
    const [forwardMessages, setForwardMessages] = useState([])
    const [groupContacts, setGroupContacts] = useState([])
    const [searchContactsGroup, setSearchContactsGroup] = useState("")
    const [nameGroupChat, setNameGroupChat] = useState("")
    const [avatarGroupChat, setAvatarGroupChat] = useState(null)
    const [mapInitials, setMapInitials] = useState(new Map())

    const [selectedChat, setSelectedChat] = useState(null)
    const [allFiles, setAllFiles] = useState(null)
    const [selectFiles, setSelectFiles] = useState([])
    const [refresh, setRefresh] = useState({})
    const [selectedFiles, setSelectedFiles] = useState(null)
    const messagesEndRef = useRef(null)
    const fileInput = useRef(null)
    const avatarGroupChatInput = useRef(null)
    const [modalUpload, setModalUpload] = useState(false)
    const currentUser = AuthService.getCurrentUser().username
    useEffect(() => {
        getFiles();
        getContacts();
        escapeChat();
    }, [])

    function escapeChat () {
        window.addEventListener("keydown", handler, true);
        return () => window.removeEventListener("keydown", handler, true);
    }

    function handler (event) {
        if (event.keyCode === 27) {
            deactivateChat()
        }
    }

    function deactivateChat() {
        setSelectedChat(null)
        let href = document.location.href.toString()
        if (href.slice(-4) !== "/msg") {
            document.location.href = href.substring(0, href.lastIndexOf('/'))
        }
    }

    /**
     * Функция добавляет выбранного пользователя в контакты.
     */
    function updateContacts() {
        UserService.pushContacts(AuthService.getCurrentUser().username, selected)
            .then(async (response) => {
                let user = response.data
                user.avatar && (user.avatar = await getAvatar(user.avatar))
            })
            .catch((e) => {
                console.log(e)
            })
    }

    /**
     * Функция выбирает пользователя, которого нет в контактах, чтобы ему написать.
     */
    function selectNotInContactsUser() {
        UserService.getUserByUsername(selected)
            .then(async (response) => {
                let user = response.data
                selectChat(user)
            })
            .catch((e) => {
                console.log(e)
            })
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
    }

    const goToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "auto"})
    }

    /**
     * Удаление сообщения из MAP на клиенте, чтобы лишний раз не
     * делать запросы на сервер для обновления данных и получения сообщений.
     * @param msg
     */
    function deleteMsgClient(msg) {
        let newMsgArray;
        if (msg.id) {
            newMsgArray = allMessages.get(selectedChat.username).messages.filter(value => value.msg.id !== msg.id)
        } else {
            newMsgArray = allMessages.get(selectedChat.username).messages.filter(value => value.msg.sendDate !== msg.sendDate)
        }
        const valueMap = {unRead: 0, messages: newMsgArray}
        let lastMsg = null;
        if (newMsgArray.length > 0) {
            lastMsg = newMsgArray[newMsgArray.length - 1]
        }
        setAllMessages(prev => prev.set(selectedChat.username, valueMap))
        setUsersWithLastMsg(prev => prev.set(selectedChat.username, {
            first: selectedChat,
            second: lastMsg
        }))
        setRefresh({})
    }

    async function getAvatar(avatar) {
        const base64Response = await fetch(`data:application/json;base64,${avatar}`)
        const blob = await base64Response.blob()
        return URL.createObjectURL(blob)
    }

    /**
     * Получение списка контактов для текущего
     * пользователя из базы данных
     */
    function getContacts() {
        UserService.getContacts(AuthService.getCurrentUser().username)
            .then((response) => {
                const userWithLastMsgArray = response.data.contactWithLastMsg
                const chatsWithLastMsgArray = response.data.chatRoomWitLastMsg // wit
                userWithLastMsgArray.map(async user => {
                    user.first.avatar && (user.first.avatar = await getAvatar(user.first.avatar))
                    setUsersWithLastMsg(prev => prev.set(user.first.username, user))
                    setMapInitials(prev => prev.set(user.first.username, user.first.initials))
                    setRefresh({})
                })
                chatsWithLastMsgArray.map(async chat => {
                    chat.first.avatar && (chat.first.avatar = await getAvatar(chat.first.avatar))
                    chat.first.members.map(async member => {
                        member.avatar && (member.avatar = await getAvatar(member.avatar))
                    })
                    setChatsWithLastMsg(prev => prev.set(chat.first.chatId, chat))
                    setRefresh({})
                })
                const user = userWithLastMsgArray.find(user => user.first.username === selected)
                const chatRoom = chatsWithLastMsgArray.find(chat =>
                    chat.first.chatId ===
                    (!isNaN(selected.slice(1) - 1) ? chatsWithLastMsgArray[(+selected.slice(1)) - 1].first.chatId : -1))
                // Проверка есть ли выбранный пользователь в списке контактов, иначе он будет добавлен.
                if (selected && chatRoom) {
                    selectChat(chatRoom.first)
                } else {
                    if (selected && !user) {
                        selectNotInContactsUser()
                    } else if (selected && user) {
                        selectChat(user.first)
                    }
                }

                // Данное состояние обновляется для принудительного рендеринга страниц
                setRefresh({})
            })
            .catch((e) => {
                console.log(e)
            })
    }

    function onChangeSearchContactsContent(e, type) {
        let str = e.target.value
        str = str.replace(/ {2,}/g, ' ').trim()
        str = str.replace(/[\n\r ]{3,}/g, '\n\r\n\r')
        switch (type) {
            case 'message':
                setContent(e.target.value)
                setContentCorrect(str)
                setContentPresence(str.charCodeAt(0) > 32)
                break
            case 'contacts':
                setSearchContacts(e.target.value)
                break
            case 'content':
                setSearchContent(e.target.value)
                break
            case 'group':
                setSearchContactsGroup(e.target.value)
                break
            case 'forward':
                setSearchChats(e.target.value)
                break
            default:
                break
        }
    }

    function checkKey(key) {
        if (key.key === "Enter" && key.shiftKey === false && selectedChat && contentPresence) {
            sendMessage()
            setContent("")
            setContentCorrect("")
            setContentPresence(false)
        }
    }

    function getMessageHistory(chat, message, isFirstMessage) {
        let isFirst = isFirstMessage
        if (allMessages.get(chat)) {
            isFirst = false
            let msg = allMessages.get(chat).messages
            msg.push({msg: message, checked: false})
            const valueMap = {unRead: 0, messages: msg}
            setAllMessages(prev => (prev.set(chat, valueMap)))
        } else {
            if (message.chatId !== null) {
                isFirst = false
            }
            let msg = []
            msg.push({msg: message, checked: false})
            const valueMap = {unRead: 0, messages: msg}
            setAllMessages(prev => (prev.set(chat, valueMap)))
        }
        return isFirst
    }

    /**
     * Функция отправляет сообщение пользователю.
     */
    async function sendMessage() {
        if (stompClient) {
            let fileNameAndStringBase64 = []
            let pairFileNameBase64
            let uid = null
            if (selectFiles.length === 0) {
                if (selectedFiles) {
                    for (let i = 0; i < selectedFiles.length; i++) {
                        if (selectedFiles[i].name.endsWith(".dcm")) {
                            const fileBase64 = await Upload.uploadFiles(selectedFiles[i], true)
                            uid = fileBase64.uid
                            selectedFiles[i] = {name: fileBase64.name, uid: fileBase64.uid}
                            pairFileNameBase64 = {fileName: fileBase64.name, fileContent: fileBase64.image}
                        } else {
                            const fileBase64 = await Upload.uploadFiles(selectedFiles[i], false)
                            pairFileNameBase64 = {fileName: fileBase64.name, fileContent: fileBase64.image}
                        }
                        fileNameAndStringBase64.push(pairFileNameBase64)
                    }
                }
            } else {
                for (let i = 0; i < selectedFiles.length; i++) {
                    if (selectedFiles[i].name.endsWith(".jpg") ||
                        selectedFiles[i].name.endsWith(".png") ||
                        selectedFiles[i].name.endsWith(".dcm")) {
                            let response = await AttachmentService.getPreviewNew(selectedFiles[i].id).then(response => {
                                return response.data
                            }).catch(error => {
                                console.log(error)
                            })
                            const fileBase64 = await Upload.uploadFiles(response, false)
                            uid = selectFiles[i].uid
                            selectedFiles[i] = {name: fileBase64.name, image: fileBase64.image, uid: selectedFiles[i].uid}
                            pairFileNameBase64 = {fileName: selectedFiles[i].name, fileContent: selectedFiles[i].image};
                    }
                }
                fileNameAndStringBase64.push(pairFileNameBase64);
            }
            const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
            const message = {
                chatId: null,
                content: contentCorrect,
                type: "CHAT",
                recipientId: null,
                recipientName: null,
                senderId: AuthService.getCurrentUser().id,
                senderName: AuthService.getCurrentUser().username,
                attachmentsBlobForImageClient: selectedFiles,
                // Переменная используется для быстрой отрисовки отправленных изображений,
                // чтобы не делать лишних запросов к базе данных.
                files: fileNameAndStringBase64,
                forwardedMessages: forwardMessages,
                sendDate: localISOTime,
                timeZone: timeZone,
                uid: uid
            }
            let isFirstMessage = true;

            // Проверка есть ли "история переписки" с выбранным пользователем, если есть,
            // то сообщение добавится к существующим.
            if (selectedChat.username === undefined) {
                message.chatId = selectedChat.chatId
                isFirstMessage = getMessageHistory(selectedChat.chatId, message, isFirstMessage)
                setChatsWithLastMsg(prev => prev.set(selectedChat.chatId, {first: selectedChat, second: message}))
                let messageOnSend = Object.assign({}, message)
                messageOnSend.forwardedMessages = [...forwardMessages].map(message => {return message.id})
                stompClient.send("/app/send/group-chat/" + selectedChat.chatId, {}, JSON.stringify(messageOnSend))
            } else {
                message.recipientId = selectedChat.id
                message.recipientName = selectedChat.username
                isFirstMessage = getMessageHistory(selectedChat.username, message, isFirstMessage)
                setUsersWithLastMsg(prev => prev.set(selectedChat.username, {first: selectedChat, second: message}))
                let messageOnSend = Object.assign({}, message)
                messageOnSend.forwardedMessages = [...forwardMessages].map(message => {return message.id})
                stompClient.send("/app/send/" + selectedChat.username, {}, JSON.stringify(messageOnSend))
            }


            setSelectFiles([]);
            setSelectedFiles(null)
            setContent("")
            setContentCorrect("")
            setContentPresence(false)
            setForwardMessages([])

            // Если это первое сообщение, необходимо добавить пользователя в список контактов.
            if (isFirstMessage)
                updateContacts();
        }
    }

    /**
     * Функция принимает в качестве аргумента пользователя и
     * получает из базы данных сообщения с данным пользователем
     * @param chat
     */
    function selectChat(chat) {
        setSelectedChat(chat)
        if (chat.username !== undefined) {
            ChatService.getMessages(AuthService.getCurrentUser().username, chat.username)
                .then((response) => {
                    if (response.data.length > 0) {
                        let list = []
                        for (let i = 0; i < response.data.length; i++) {
                            list.push({msg: response.data[i], checked: false})
                        }
                        const valueMap = {unRead: 0, messages: list}
                        setAllMessages(prev => (prev.set(chat.username, valueMap)))
                        setRefresh({}) // Данное состояние обновляется для принудительного рендеринга страницы.
                        goToBottom()
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        } else {
            ChatService.getChatRoomMessages(chat.chatId)
                .then((response) => {
                    if (response.data.length > 0) {
                        let list = []
                        for (let i = 0; i < response.data.length; i++) {
                            list.push({msg: response.data[i], checked: false})
                        }
                        const valueMap = {unRead: 0, messages: list}
                        setAllMessages(prev => (prev.set(chat.chatId, valueMap)))
                        setRefresh({}) // Данное состояние обновляется для принудительного рендеринга страницы.
                        goToBottom()
                    }
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        forwardChat === false && setForwardMessages([])
        setRefresh({}) // Данное состояние обновляется для принудительного рендеринга страницы.
    }

    function selectFile() {
        fileInput.current.click()
    }

    /**
     * Функция находит время отправки сообщения для
     * часового пояса, в котором находится пользователь.
     * @param time
     * @param zone
     * @returns {Date}
     */
    function detectTimeInCurrentTimeZone(time, zone) {
        let messageTime = new Date(time)
        let timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone)
        const difsTimeZones = getOffsetBetweenTimezonesForDate(new Date(), zone, timeZone)
        return (new Date(new Date(messageTime).getTime() - difsTimeZones))
    }

    function getOffsetBetweenTimezonesForDate(date, timezone1, timezone2) {
        const timezone1Date = convertDateToAnotherTimeZone(date, timezone1);
        const timezone2Date = convertDateToAnotherTimeZone(date, timezone2);
        return timezone1Date.getTime() - timezone2Date.getTime();
    }

    function convertDateToAnotherTimeZone(date, timezone) {
        const dateString = date.toLocaleString('en-US', {
            timeZone: timezone
        });
        return new Date(dateString);
    }


    function chatsArrayId(chatId) {
        let chats = [...chatsWithLastMsg.values()]
        for (let i = 0; i < chats.length; i++) {
            if (chats[i].first.chatId === chatId) {
                return "c" + ++i
            }
        }
        return ""
    }

    /**
     * Функция сортирует пользователей в списке контактов по последне отправленному сообщению.
     * @returns {HTML}
     */
    function sortContacts() {
        let sortedContacts = [...chatsWithLastMsg.values(), ...usersWithLastMsg.values()]
        for (let i = 0; i < sortedContacts.length; i++) {
            if (sortedContacts[i].second !== null && sortedContacts[i].second.sendDate !== null && sortedContacts[i].second.timeZone !== null) {
                let timeInCurrentTimeZoneArray = detectTimeInCurrentTimeZone(sortedContacts[i].second.sendDate, sortedContacts[i].second.timeZone)
                sortedContacts[i] = {...sortedContacts[i], sendDateInCurrentTimeZone: timeInCurrentTimeZoneArray}
            }
        }
        sortedContacts.sort(function (a, b) {
            if (a.sendDateInCurrentTimeZone !== null && b.sendDateInCurrentTimeZone !== null) {
                const aTime = new Date(a.sendDateInCurrentTimeZone)
                const bTime = new Date(b.sendDateInCurrentTimeZone)
                if (aTime > bTime) {
                    return -1
                }
                if (aTime < bTime) {
                    return 1
                }
                return 0
            }
            return 0
        })
        return (sortedContacts
            .filter((chatAndLastMsg) => {
                if (chatAndLastMsg.first.chatName === undefined) {
                    const nameAndSurname = chatAndLastMsg.first.initials.split(" ")
                    return (nameAndSurname[0] + " " + nameAndSurname[1]).includes(searchContacts)
                } else {
                    return (chatAndLastMsg.first.chatName).includes(searchContacts)
                }
            })
            .map((chatAndLastMsg, index) => (
                <Grid key={index}>
                    {chatAndLastMsg.first.username !== undefined ? (
                        <Link onClick={() => selectChat(chatAndLastMsg.first)}
                              to={"/msg/" + chatAndLastMsg.first.username}
                              style={{textDecoration: 'none'}}>
                            <ListItemButton
                                value={chatAndLastMsg.first}
                                selected={selectedChat && selectedChat.username === chatAndLastMsg.first.username}
                                title={chatAndLastMsg.first.lastname + " " + chatAndLastMsg.first.firstname}
                            >
                                <ChatCardMsg allMessages={allMessages}
                                             chatAndLastMsg={chatAndLastMsg}
                                             getInitials={getInitialsBySenderInGroupChat}
                                             currentUser={currentUser}/>
                            </ListItemButton>
                            <Divider/>
                        </Link>
                    ) : (
                        <Link onClick={() => selectChat(chatAndLastMsg.first)}
                              to={"/msg/" + chatsArrayId(chatAndLastMsg.first.chatId)}
                              style={{textDecoration: 'none'}}>
                            <ListItemButton
                                value={chatAndLastMsg.first}
                                selected={selectedChat && selectedChat.chatId === chatAndLastMsg.first.chatId}
                                title={chatAndLastMsg.first.chatName}
                            >
                                {console.log(chatAndLastMsg)}
                                {console.log(selectedChat)}
                                <ChatCardMsg allMessages={allMessages}
                                             chatAndLastMsg={chatAndLastMsg}
                                             getInitials={getInitialsBySenderInGroupChat}
                                             currentUser={currentUser}/>
                            </ListItemButton>
                            <Divider/>
                        </Link>
                    )}
                </Grid>
            )))
    }

    const handleToggle = (contacts, value) => {
        value.checked = !value.checked
        setGroupContacts(contacts)
        setRefresh({})
    };

    function contactsGroupChat() {
        let sortedContacts = groupContacts
        if (menuGroupChat) {
            if (sortedContacts[0].checked === undefined && sortedContacts.length !== 0) {
                for (let i = 0; i < sortedContacts.length; i++) {
                    sortedContacts[i] = {...sortedContacts[i], checked: false}
                }
            }
            return (sortedContacts.length !== 0 ? (sortedContacts
                .filter((user) => {
                    const nameAndSurname = user.first.initials.split(" ")
                    return (nameAndSurname[0] + " " + nameAndSurname[1]).includes(searchContactsGroup)
                })
                .map((user, index) => (
                    <Grid key={index}>
                        <ListItemButton
                            value={user.first}
                            onClick={() => handleToggle(sortedContacts, user)}
                            title={user.first.lastname + " " + user.first.firstname}
                        >
                            <Grid className={classes.flex} xs={12} item>
                                <Grid xs={1} item style={{ minWidth: 60 }}>
                                    <Avatar className={classes.avatar} src={user.first.avatar}>
                                        <PhotoCameraOutlinedIcon/>
                                    </Avatar>
                                </Grid>
                                <Grid xs item>
                                    <Grid className={classes.gridFullWidth}>
                                        <Grid className={classes.flex} xs={12} item>
                                            <Grid xs item style={{ display: "flex", alignItems: "center" }}>
                                                <UserCardMessage user={user.first}/>
                                            </Grid>
                                            <Grid xs={1} className={classes.gridAlignCenter} item style={{ minWidth: 60 }}>
                                                <Checkbox
                                                    checked={user.checked}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{ 'aria-label': `checkbox-list-secondary-label-${user}` }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ListItemButton>
                        <Divider/>
                    </Grid>
                ))) : (
                <Grid item xs={12}>
                     <ListItem>
                         Нет добавленных контактов
                     </ListItem>
                </Grid>))
        }
    }

    function selectChatForwardMessage(chat) {
        selectChat(chat)
        setForwardChat(false)
    }

    function sortContactsForwardMessages() {
        let sortedContacts = [...chatsWithLastMsg.values(), ...usersWithLastMsg.values()]
        for (let i = 0; i < sortedContacts.length; i++) {
            if (sortedContacts[i].second !== null && sortedContacts[i].second.sendDate !== null && sortedContacts[i].second.timeZone !== null) {
                let timeInCurrentTimeZoneArray = detectTimeInCurrentTimeZone(sortedContacts[i].second.sendDate, sortedContacts[i].second.timeZone)
                sortedContacts[i] = {...sortedContacts[i], sendDateInCurrentTimeZone: timeInCurrentTimeZoneArray}
            }
        }
        sortedContacts.sort(function (a, b) {
            if (a.sendDateInCurrentTimeZone !== null && b.sendDateInCurrentTimeZone !== null) {
                const aTime = new Date(a.sendDateInCurrentTimeZone)
                const bTime = new Date(b.sendDateInCurrentTimeZone)
                if (aTime > bTime) {
                    return -1
                }
                if (aTime < bTime) {
                    return 1
                }
                return 0
            }
            return 0
        })
        return (sortedContacts
            .filter((chatAndLastMsg) => {
                if (chatAndLastMsg.first.chatName === undefined) {
                    const nameAndSurname = chatAndLastMsg.first.initials.split(" ")
                    return (nameAndSurname[0] + " " + nameAndSurname[1]).includes(searchChats)
                } else {
                    return (chatAndLastMsg.first.chatName).includes(searchChats)
                }
            })
            .map((chatAndLastMsg, index) => (
                <Grid key={index} xs={12} style={{ width: '100%' }}>
                    {chatAndLastMsg.first.username !== undefined ? (
                        <Link onClick={() => selectChatForwardMessage(chatAndLastMsg.first)}
                              to={"/msg/" + chatAndLastMsg.first.username}
                              style={{textDecoration: 'none'}}>
                            <ListItemButton
                                value={chatAndLastMsg.first}
                                title={chatAndLastMsg.first.lastname + " " + chatAndLastMsg.first.firstname}
                            >
                                <Grid className={classes.flex} xs={12} item direction="row" style={{ display: "flex", alignItems: "center" }}>
                                    <Grid xs={1} item style={{ minWidth: 60 }}>
                                        <Avatar className={classes.avatar} src={chatAndLastMsg.first.avatar}>
                                            <PhotoCameraOutlinedIcon/>
                                        </Avatar>
                                    </Grid>
                                    <Grid xs item>
                                        <Grid className={classes.gridFullWidth}>
                                            <Grid className={classes.flex} xs={12} item>
                                                <Grid xs item>
                                                    <UserCardMessage user={chatAndLastMsg.first}/>
                                                </Grid>
                                                <Grid xs={1} className={classes.gridAlignCenter} item style={{ minWidth: 60 }}>
                                                    <ArrowForwardIosIcon style={{ color: "#000" }}/>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ListItemButton>
                            <Divider/>
                        </Link>
                    ) : (
                        <Link onClick={() => selectChatForwardMessage(chatAndLastMsg.first)}
                              to={"/msg/" + chatsArrayId(chatAndLastMsg.first.chatId)}
                              style={{textDecoration: 'none'}}>
                            <ListItemButton
                                value={chatAndLastMsg.first}
                                title={chatAndLastMsg.first.chatName}
                            >
                                <Grid className={classes.flex} xs={12} item direction="row" style={{ display: "flex", alignItems: "center" }}>
                                    <Grid xs={1} item style={{ minWidth: 60 }}>
                                        <Avatar className={classes.avatar} src={chatAndLastMsg.first.avatar}>
                                            <PhotoCameraOutlinedIcon/>
                                        </Avatar>
                                    </Grid>
                                    <Grid xs item>
                                        <Grid className={classes.gridFullWidth}>
                                            <Grid className={classes.flex} xs={12} item>
                                                <Grid xs item>
                                                    <Grid item className={classes.gridText}>{chatAndLastMsg.first.chatName}</Grid>
                                                </Grid>
                                                <Grid xs={1} className={classes.gridAlignCenter} item style={{ minWidth: 60 }}>
                                                    <ArrowForwardIosIcon style={{ color: "#000" }}/>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ListItemButton>
                            <Divider/>
                        </Link>
                    )}
                </Grid>
            )))
    }

    /**
     * Функция проверяет есть ли непрочитанные сообщения с выбранным пользователем, если есть,
     * то на сервере статус этих сообщений изменится на READ.
     *
     * P.S. Вызывается каждый раз при отображении полученного сообщения (recipient.msg.component), надо бы оптимизировать.
     */
    function updateStatusMsg() {
        const dataMsg = allMessages.get(selectedChat.username)
        if (dataMsg && dataMsg.unRead > 0) {
            let unreadArr = dataMsg.messages.filter(msg => msg.statusMessage === "UNREAD" && msg.senderName === selectedChat.username && !processedUnreadMessages.includes(msg.id))
            if (unreadArr.length > 0) {
                unreadArr.map(msg => setProcessedUnreadMessages(prevState => (prevState.concat([msg.id]))))
                ChatService.updateStatusUnreadMessages(unreadArr).then()
            }

            // Отнять количество сообщений, которое мы прочитали. Необходимо для того,
            // чтобы на клиенте обновить уведомление о количестве непрочитанных сообщений.
            minusUnRead(dataMsg.unRead)
            dataMsg.unRead = 0
            setAllMessages(prev => (prev.set(selectedChat.username, dataMsg)))
        }
    }

    function createFilesArray() {
        let filesArray = []
        for (let i = 0; i < selectedFiles.length; i++) {
            filesArray.push(selectedFiles[i])
        }
        return filesArray
    }

    function disableButton() {
        if (selectedChat) {
            return !(contentPresence || selectedFiles)
        }
        return true
    }

    /**
     * Функция проверяет выбранные файлы на ограничения:
     * кол-во файлов <= 6, размер <= 50МБ.
     * @param files
     */
    function uploadFiles(files) {
        const MAX_NUM_FILES = 6
        const MAX_SIZE_FILES = 52428800
        let err_files = false
        let filesArray = Array.from(files.target.files)
        if (filesArray.length > MAX_NUM_FILES) {
            filesArray.splice(MAX_NUM_FILES)
            err_files = true
        }
        let removedCount = 0
        const length = filesArray.length
        for (let i = 0; i < length; i++) {
            if (filesArray[i - removedCount].size > MAX_SIZE_FILES) {
                filesArray.splice(i - removedCount, 1)
                removedCount++
                err_files = true
            }
        }
        if (err_files) {
            alert("Кол-во <= 6, размер <= 50МБ")
        }
        if (filesArray.length === 0) {
            filesArray = null
        }
        setSelectedFiles(filesArray)
    }

    function getFiles() {
        AttachmentService.getAttachmentsForUser(
        AuthService.getCurrentUser().username
        ).then(
        (response) => {
            let filteredDicomsForSelect = response.data.map((el) => {
                return { id: el.id, name: el.initialName, uid: el.uid };
            });
            setAllFiles(filteredDicomsForSelect)
        },
        (error) => {
            console.log(error);
        })
    }

    /**
     * Функция проверяет выбранные файлы на ограничение:
     * кол-во файлов <= 6.
     * @param files
     */
    function handleFiles(files) {
        let filesArray = [...files.target.value]
        
        if (filesArray.length > 6) {
            alert("Кол-во файлов должно быть <= 6.")
            filesArray.splice(filesArray.length - 1, 1)
        }
        if (filesArray.length === 0) {
            setSelectFiles([])
            setSelectedFiles(null)
        } else {
            setSelectFiles(filesArray)
            setSelectedFiles(filesArray)
        }
    }

    /**
     * Функция закрывает модальное окно
     */
    function acceptButton() {
        setModalUpload(false);
    }

    const ITEM_HEIGHT = 48
    const ITEM_PADDING_TOP = 8
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    }

    /**
     * Функция открывает модальное окно выбора файлов для загрузки
     */
    function handleOpenUpload() {
        setModalUpload(true)
    }

    /**
     * Функция закрывает модальное окно и обнуляет выбранные файлы для загрузки
     */
    function handleCloseUpload() {
        setSelectFiles([])
        setSelectedFiles(null)
        setModalUpload(false)
    }

    /**
     * Функция открывает модальное окно
     */
    function handleOpenGroupChat() {
        setGroupContacts([...usersWithLastMsg.values()])
        setMenuGroupChat(true)
    }

    /**
     * Функция закрывает модальное окно и обнуляет выбранные файлы
     */
    function handleCloseGroupChat() {
        setNameGroupChat("")
        setGroupContacts([...usersWithLastMsg.values()])
        avatarGroupChatInput.current.value = null
        setAvatarGroupChat(null)
        setMenuGroupChat(false)
        setRefresh({})
    }

    /**
     * Функция удаляет прикрепленные файлы к сообщению
     * @param index 
     */
    function delSelectedFiles(index) {
        let files = [...selectedFiles]
        files.splice(index, 1)
        if(files.length === 0) {
            setSelectFiles([])
            setSelectedFiles(null)
        } else {
            setSelectedFiles(files)
        }
    }

    function handleDeleteChip(data) {
        data.checked = false
        setRefresh({})
    }

    async function createChat() {
        let contacts = []
        let contactsCreateGroup = [...groupContacts].filter((contact) => contact.checked === true)
        contacts.push({userId: AuthService.getCurrentUser().id, memberName: AuthService.getCurrentUser().username})
        for (let contact of contactsCreateGroup) {
            contacts.push({userId: contact.first.id, memberName: contact.first.username})
        }
        let fileStringBase64 = null
        if (avatarGroupChat) {
            let readerPromise = new Promise((resolve, reject) => {
                let reader = new FileReader()
                reader.onload = () => {
                    resolve(reader.result)
                }
                reader.onerror = reject
                reader.readAsDataURL(avatarGroupChat)
            })

            // Для отправления файлов по websocket, необходимо перевести их в строку base64.
            fileStringBase64 = await readerPromise
        }


        const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
        const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        await ChatService.createGroupChat(nameGroupChat, contacts, currentUser, AuthService.getCurrentUser().id,
            fileStringBase64, localISOTime, timeZone).then(() => {
            getContacts()
        })
        handleCloseGroupChat()
    }

    function getInitialsBySenderInGroupChat(username) {
        let initials
        if (mapInitials.get(username) !== undefined) {
            initials = mapInitials.get(username)
        } else {
            UserService.getUserByUsername(username).then(async (response) => {
                let user = await response.data
                user && setMapInitials(prev => prev.set(username, user.initials))
            })
                .catch((e) => {
                    console.log(e)
                })
            initials = mapInitials.get(username) !== undefined ? mapInitials.get(username) : "user unknown"
        }
        return initials
    }

    function handleCloseSearchMessage() {
        setSearchMessageButton(false)
        setSearchContent("")
    }

    function countUsersGroupChatCreate() {
        return [...groupContacts]
            .filter((data) => {
                return data.checked
            })
    }

    function disableCreateChat() {
        let countUsers = countUsersGroupChatCreate().length
        return (nameGroupChat.length === 0 || countUsers < 1)
    }

    function handleAvatar() {
        avatarGroupChatInput.current.click()
    }

    function uploadAvatar(event) {
        setAvatarGroupChat(event.target.files[0])
    }

    const style = makeStyles(() => ({
        itemButtonGroupChat: {
            height: `calc(100vh - 271px - ${countUsersGroupChatCreate().length !== 0 ? 50 : 0}px)`,
            overflowY: "auto",
            '@media (max-height: 600px)': {
                height: `calc(328px - ${countUsersGroupChatCreate().length !== 0 ? 50 : 0}px)`,
            },
        },
        selectedFiles: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            marginLeft: 15,
            overflow: 'hidden',
            marginTop: `calc(${selectedFiles ? 10 : 0}px)`,
            height: `calc(${27 * (selectedFiles ? selectedFiles.length : 0)}px)`,

        },
        messageGrid: {
            width: "auto",
            minWidth: "300px",
            overflowY: "auto",
            height: `calc(100vh - 154px - 113px - ${selectedFiles ? 27 * selectedFiles.length + 10 : 0}px
            - ${forwardMessages.length > 0 && forwardChat === false ? 55 : 0}px)`,
            '&::-webkit-scrollbar': {
                width: '0.4em'
            },
            '&::-webkit-scrollbar-track': {
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.1)',
                outline: '1px solid slategrey'
            },
            "@media (max-height: 600px)": {
                minHeight: `calc(332px - ${selectedFiles ? 27 * selectedFiles.length + 10 : 0}px 
                - ${forwardMessages.length > 0 && forwardChat === false ? 55 : 0}px)`,
            },
        },

    }))

    const classStyle = style()

    function chatsPanel(width) {
        return (!menuGroupChat ? (
            <Grid xs={width} item className={classes.paper}>
                <Grid>
                    <Paper
                        component="form"
                        square
                        style={{ padding: '2px 3px',}}
                        className={classes.gridAlignCenter}>
                        <Grid xs={1} item style={{ minWidth: '60px',}}
                              className={classes.gridAlignCenter}>
                            <SearchIcon
                                className={classes.searchIcon}/>
                        </Grid>
                        <Grid xs item>
                            <InputBase
                                fullWidth
                                placeholder="Поиск по контактам..."
                                inputProps={{ 'aria-label': 'Поиск по контактам...' }}
                                autoComplete="off"
                                name="searchContacts"
                                minRows={1}
                                maxRows={6}
                                value={searchContacts}
                                onChange={(searchContacts) =>
                                    onChangeSearchContactsContent(searchContacts, 'contacts')}/>
                        </Grid>
                        <Grid xs={1} item style={{ minWidth: '60px',}}
                              className={classes.gridAlignCenter}>
                            <IconButton
                                className={classes.groupChat}
                                color="inherit"
                                title={"Групповой чат"}
                                onClick={() => handleOpenGroupChat()}>
                                <AddCircleOutlineIcon variant="contained"/>
                            </IconButton>
                        </Grid>
                    </Paper>
                    <Divider/>
                </Grid>
                <Grid>
                    <Paper square>
                        <List className={classes.itemButton} style={{ height: `calc(100vh - 153px)`, overflowY: "auto" }}>
                            {usersWithLastMsg && sortContacts()}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        ) : (
            <Grid xs={width} item className={classes.paper}>
                <Grid container item xs={12} >
                    <Grid item xs={1} className={classes.gridAlignCenter} style={{ minWidth: "60px" }}>
                        <input type="file" style={{"display": "none"}} ref={avatarGroupChatInput}
                               accept="image/*"
                               onChange={(e) => uploadAvatar(e)}
                        />
                        <Avatar className={classes.avatarForCreateChat}
                                src={avatarGroupChat && URL.createObjectURL(avatarGroupChat)}
                                onClick={() => handleAvatar()}>
                            <PhotoCameraOutlinedIcon style={{fontSize: 20}}/>
                        </Avatar>
                    </Grid>
                    <Grid item xs className={classes.gridAlignCenter}>
                        <InputBase
                            style={{ padding: 5, margin: 1 }}
                            fullWidth
                            placeholder="Введите название чата"
                            inputProps={{ 'aria-label': 'Поиск по контактам...' }}
                            autoComplete="off"
                            name="group-chat-name"
                            value={nameGroupChat}
                            onChange={(nameGroupChat) => setNameGroupChat(nameGroupChat.target.value)}
                        />
                        <Divider/>
                    </Grid>
                </Grid>
                <Divider/>
                <Grid
                    style={{ padding: 5, margin: 1 }}
                    component="form">
                    {[...groupContacts]
                        .filter((data) => {
                            return data.checked
                        }).length !== 0 &&
                        <Grid className={classes.chipsGroupChat} >
                            {countUsersGroupChatCreate()
                                .map((data, index) => {
                                    return (
                                        <Chip
                                            key={index}
                                            avatar={<Avatar src={data.first.avatar}>
                                                <PhotoCameraOutlinedIcon/>
                                            </Avatar>}
                                            label={data.first.username}
                                            style={{ margin: 4 }}
                                            onDelete={() => handleDeleteChip(data)}/>)
                                })}
                        </Grid>
                    }
                    <InputBase
                        style={{ margin: 5 }}
                        placeholder="Поиск по контактам..."
                        inputProps={{ 'aria-label': 'Поиск по контактам...' }}
                        autoComplete="off"
                        name="searchContactsGroup"
                        minRows={1}
                        maxRows={6}
                        value={searchContactsGroup}
                        onChange={(searchContactsGroup) =>
                            onChangeSearchContactsContent(searchContactsGroup, 'group')}/>
                </Grid>
                <Divider/>
                <Paper square>
                    <List className={classStyle.itemButtonGroupChat}>
                        {groupContacts && menuGroupChat && contactsGroupChat()}
                        {/* Бага с нулем юзеров*/}
                    </List>
                </Paper>
                <Paper style={{ backgroundColor:"#fafbfc" }} square>
                    <Grid  style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", height: 60 }} >
                        <Button onClick={() => createChat()} disabled={disableCreateChat()}> Создать </Button>
                        <Button onClick={() => handleCloseGroupChat()}> Отмена </Button>
                    </Grid>
                </Paper>
            </Grid>
        ))
    }

    function selectMessage(chat, index) {
        if (!window.getSelection().toString()){
            let messages = allMessages.get(chat).messages
            messages[index].checked = !messages[index].checked
            setRefresh({})
        }
    }

    function listItemButtonChat() {
        if (selectedChat) {
            return (selectedChat && selectedChat.username !== undefined ?
                ((allMessages.get(selectedChat.username)) &&
                    ([...allMessages.get(selectedChat.username).messages]
                        .filter((message) => message.msg.content.includes(searchContent))
                        .map((message, index) => (
                            ((message.msg.senderName !== selectedChat.username &&
                                    message.msg.type === "CHAT" &&
                                    (<ListItem selected={message.checked}
                                                     onClick={() => selectMessage(selectedChat.username, index)}
                                                     style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                        <SenderMsg msg={message.msg}
                                                   key={index}
                                                   scrollToBottom={scrollToBottom}
                                                   deleteMsgClient={deleteMsgClient}/>
                                    </ListItem>)) ||
                                ((message.msg.senderName === selectedChat.username &&
                                        message.msg.type === "CHAT" &&
                                        (<ListItem selected={message.checked}
                                                         onClick={() => selectMessage(selectedChat.username, index)}
                                                         style={{ width: '100%' }}>
                                            <RecipientMsg msg={message.msg} key={index}
                                                          initialsSender={selectedChat.initials}
                                                          updateStatusMsg={updateStatusMsg}
                                                          scrollToBottom={scrollToBottom}/>
                                        </ListItem>))
                                ))
                        )))) :
                (allMessages.get(selectedChat.chatId)) &&
                ([...allMessages.get(selectedChat.chatId).messages]
                    .filter((message) => message.msg.content.includes(searchContent))
                    .map((message, index) => (
                        ((message.msg.senderName === currentUser &&
                                message.msg.type === "CHAT" &&
                                (<ListItem selected={message.checked}
                                                 onClick={() => selectMessage(selectedChat.chatId, index)}
                                                 style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                                    <SenderMsg msg={message.msg}
                                               key={index}
                                               scrollToBottom={scrollToBottom}
                                               deleteMsgClient={deleteMsgClient}/>
                                </ListItem>)) ||
                            ((message.msg.senderName !== currentUser &&
                                    message.msg.type === "CHAT" &&
                                    (<ListItem selected={message.checked}
                                                     onClick={() => selectMessage(selectedChat.chatId, index)}>
                                        <RecipientMsg msg={message.msg} key={index}
                                                      initialsSender={selectedChat.members.filter(member => {
                                                          return member.username === message.msg.senderName
                                                      }).map(member => {return member.initials})[0]}
                                                      updateStatusMsg={updateStatusMsg}
                                                      scrollToBottom={scrollToBottom}/>
                                    </ListItem>))
                            ) || (
                                message.msg.type !== "CHAT" &&
                                (<NotificationMsg msg={message.msg} key={index}
                                                  initialsSender={selectedChat.members.filter(member => {
                                                      return member.username === message.msg.senderName
                                                  }).map(member => {return member.initials})[0]}
                                                  scrollToBottom={scrollToBottom}/>)
                            ))
                    ))))
        }
    }

    let activeChat = selectedChat && selectedChat.username !== undefined

    function clearSelectedMessage(chat) {
        let messages = allMessages.get(chat).messages
        for (let i = 0; i < messages.length; i++) {
            messages[i].checked = false
        }
        setRefresh({})
    }

    function statusBarChat() {
        let currentChat = activeChat ? selectedChat.username : selectedChat.chatId

        function countSelected(chat) {
            return ([...allMessages.get(chat).messages].filter(message => {
                return message.checked === true
            }).length)
        }
        function countSelectedMessage(chat) {
            return (<Grid onClick={() => clearSelectedMessage(chat)} style={{ display: 'flex', alignItems: 'center' }}>
                {"Сообщений: " }
                {countSelected(chat)}
                <ClearIcon className={classes.clearIcon}/>
            </Grid>)
        }

        function chooseMessages() {
            let forwardedMessages = [...allMessages.get(currentChat).messages].filter(message => {
                return message.checked === true
            }).map(message => {
                return message.msg
            })
            setForwardMessages(forwardedMessages)
            clearSelectedMessage(currentChat)
        }

        function chooseChatToForward() {
            chooseMessages()
            setForwardChat(true)
        }



        return (
            <Grid xs item container>
                <Paper style={{ width: "100%", height: "58px" }} className={classes.gridAlignCenter} square>
                    {
                        (activeChat ?
                            allMessages.get(selectedChat.username) && (countSelected(selectedChat.username) > 0) :
                            allMessages.get(selectedChat.chatId) && (countSelected(selectedChat.chatId) > 0)) ? (
                            <Grid xs item className={classes.gridAlignCenter} display="flex">
                                <Grid xs={2} item style={{ marginLeft: 20, minWidth: 150, cursor: 'pointer' }}>
                                    {activeChat ? (countSelectedMessage(selectedChat.username)) : (countSelectedMessage(selectedChat.chatId))}
                                </Grid>
                                <Grid xs item/>
                                <Grid xs={3} item style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20, minWidth: 80 }}>
                                    {countSelected(currentChat) === 1 &&
                                        <Button onClick={() => chooseMessages()}>
                                            Ответить
                                        </Button>
                                    }

                                    <Button onClick={() => chooseChatToForward()}>
                                        Переслать
                                    </Button>
                                </Grid>
                            </Grid>
                        ) : (
                            searchMessageButton ?
                                (<Grid xs item className={classes.gridAlignCenter} display="flex">
                                    <Grid xs={1} item className={classes.gridAlignCenter} style={{ display: "flex", minWidth: "60px" }}>
                                        <IconButton>
                                            <SearchIcon/>
                                        </IconButton>
                                    </Grid>
                                    <Grid xs item display="flex" >
                                        <InputBase size="small"
                                                   fullWidth
                                                   className={classes.inputSearchMsg}
                                                   square
                                                   id="searchContent"
                                                   placeholder="Поиск по сообщениям..."
                                                   inputProps={{ 'aria-label': 'Поиск по сообщениям...' }}
                                                   name="searchContent"
                                                   autoComplete="off"
                                                   value={searchContent}
                                                   onChange={(searchContent) =>
                                                       onChangeSearchContactsContent(searchContent, 'content')}
                                        />
                                    </Grid>
                                    <Grid xs={2} item style={{ display: "flex", justifyContent: "flex-end", minWidth: "80px", marginRight: "15px"}}>
                                        <Button onClick={() => handleCloseSearchMessage()} style={{ display: "flex", alignItems: "flex-end" }}> Отмена </Button>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid xs item className={classes.gridAlignCenter} display="flex" >
                                    {window.innerWidth < 992 &&
                                        <Grid xs={1} item className={classes.gridAlignCenter} style={{ display: "flex", minWidth: "60px" }}>
                                            <IconButton
                                                color="inherit"
                                                title={"Назад к чатам"}
                                                onClick={() => deactivateChat()}>
                                                <ArrowBackIcon/>
                                            </IconButton>
                                        </Grid>
                                    }
                                    <Modal
                                        show={manageGroupChat}
                                        centered="true"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        style={{ minWidth: 300 }}
                                        onHide={() => setManageGroupChat(false)}
                                    >
                                        <Modal.Header style={{ backgroundColor:"#fafbfc" }}>
                                            <Modal.Title id="contained-modal-title-vcenter">
                                                Информация
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body style={{ padding: 0 }}>
                                            <Grid xs item>
                                                <Grid xs item>
                                                    <Badge
                                                        overlap="circular"
                                                        anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'right',
                                                        }}
                                                        badgeContent={<CancelIcon
                                                            className={classes.cancelIcon}/>}
                                                    >
                                                        <Avatar className={classes.avatarManageGroupChat} src={selectedChat.avatar}>
                                                            <PhotoCameraOutlinedIcon/>
                                                        </Avatar>
                                                    </Badge>
                                                </Grid>
                                                <List className={classes.itemButtonGroupChat} fullWidth
                                                      style={{ height: '50vh', }}>
                                                    {selectedChat.members !== undefined && selectedChat.members.map(member => {
                                                        return (<ListItem
                                                            value={member}
                                                            title={member.lastname + " " + member.firstname}
                                                            divider
                                                        >
                                                            <Grid className={classes.flex} xs={12} item direction="row" style={{ display: "flex", alignItems: "center" }}>
                                                                <Grid xs={1} item style={{ minWidth: 60 }}>
                                                                    <Avatar className={classes.avatar} src={member.avatar}>
                                                                        <PhotoCameraOutlinedIcon/>
                                                                    </Avatar>
                                                                </Grid>
                                                                <Grid xs item>
                                                                    <Grid className={classes.gridFullWidth}>
                                                                        <Grid className={classes.flex} xs={12} item>
                                                                            <Grid xs item>
                                                                                <UserCardMessage user={member}/>
                                                                            </Grid>
                                                                            {selectedChat.creatorName !== currentUser ?
                                                                                currentUser === member.username &&
                                                                                (<Grid xs={1} className={classes.gridAlignCenter} item style={{ minWidth: 60 }}>
                                                                                    <ClearIcon style={{ color: "#000" }}/>
                                                                                </Grid> )
                                                                                :
                                                                                selectedChat.creatorName === currentUser &&
                                                                                selectedChat.creatorName === member.username ?
                                                                                    <Grid xs={2} className={classes.gridAlignCenter} item
                                                                                          style={{ minWidth: 120,
                                                                                              color: '#8f8f8f',
                                                                                              fontSize: 12 }}>
                                                                                        {"Создатель чата"}
                                                                                    </Grid>
                                                                                    :
                                                                                    <Grid xs={1} className={classes.gridAlignCenter} item style={{ minWidth: 60 }}>
                                                                                        <ClearIcon style={{ color: "#000" }}/>
                                                                                    </Grid>
                                                                            }
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </ListItem>)
                                                    })}
                                                </List>
                                            </Grid>
                                        </Modal.Body>
                                    </Modal>
                                    <Grid xs item style={{ display: "flex", marginLeft: 15 }}>
                                        {selectedChat && selectedChat.username !== undefined ?
                                            <Link to={"/profile/" + selectedChat.username}>
                                                <Typography style={{fontSize: 15, fontWeight: "bold", color: '#000'}}>
                                                    {selectedChat.initials}
                                                </Typography>
                                            </Link>
                                            :
                                            <Typography
                                                style={{fontSize: 15, fontWeight: "bold", color: '#000', cursor: 'pointer' }}
                                                onClick={() => setManageGroupChat(true)}>
                                                {selectedChat.chatName}
                                            </Typography>}
                                    </Grid>
                                    <Grid xs={1} item className={classes.gridAlignCenter} style={{ display: "flex", minWidth: "60px" }}>
                                        <IconButton
                                            color="inherit"
                                            title={"Поиск по сообщениям"}
                                            onClick={() => setSearchMessageButton(true)}>
                                            <SearchIcon/>
                                        </IconButton>
                                    </Grid>
                                    <Grid xs={1} item className={classes.gridAlignCenter} style={{ minWidth: 60 }}>
                                        {selectedChat && selectedChat.username !== undefined ?
                                            <Link to={"/profile/" + selectedChat.username}>
                                                <Avatar className={classes.avatar} src={selectedChat.avatar}>
                                                    <PhotoCameraOutlinedIcon/>
                                                </Avatar>
                                            </Link>
                                            :
                                            <Avatar className={classes.avatar}
                                                    src={selectedChat.avatar}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => setManageGroupChat(true)}>
                                                <PhotoCameraOutlinedIcon/>
                                            </Avatar>
                                        }
                                    </Grid>
                                </Grid>
                            )
                        )
                    }
                </Paper>
            </Grid>
        )
    }

    function cancelForwardMessage() {
        setForwardMessages([])
        setForwardChat(false)
    }

    return (
        <Card className={classes.messengerCard}>
            <Grid xs={12} item container className={classes.mainGrid} spacing={0}>
                {!selectedChat && window.innerWidth < 992 ?
                    chatsPanel(12) :
                    window.innerWidth > 991 &&  chatsPanel(4)
                }
                <Divider orientation="vertical" flexItem />
                <Grid xs item className={classes.paper2}>
                    {selectedChat &&
                        <Grid xs={12} container item display="flex" direction="column">
                            <Modal
                                show={forwardChat}
                                centered="true"
                                aria-labelledby="contained-modal-title-vcenter"
                                onHide={() => cancelForwardMessage()}
                            >
                                <Modal.Header style={{ backgroundColor:"#fafbfc" }}>
                                    <Modal.Title id="contained-modal-title-vcenter">
                                        Выберите чат
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body style={{ padding: 0 }}>
                                    <Grid xs item>
                                        <Paper
                                            component="form"
                                            square
                                            style={{ padding: '10px 0px',}}
                                            className={classes.gridAlignCenter}>
                                            <Grid xs={1} item style={{ minWidth: 60, }}
                                                  className={classes.gridAlignCenter}>
                                                <SearchIcon
                                                    className={classes.searchIcon}/>
                                            </Grid>
                                            <Grid item xs className={classes.gridAlignCenter}>
                                                <InputBase size="small"
                                                           fullWidth
                                                           className={classes.inputSearchMsg}
                                                           square
                                                           id="searchChats"
                                                           placeholder="Поиск по чатам..."
                                                           inputProps={{ 'aria-label': 'Поиск по чатам...' }}
                                                           name="searchChats"
                                                           autoComplete="off"
                                                           value={searchChats}
                                                           onChange={(searchChats) =>
                                                               onChangeSearchContactsContent(searchChats, 'forward')}
                                                />
                                                <Divider/>
                                            </Grid>
                                        </Paper>
                                        <List className={classes.itemButtonGroupChat} fullWidth style={{ height: '50vh', }}>
                                            {forwardMessages && sortContactsForwardMessages()}
                                        </List>
                                    </Grid>
                                </Modal.Body>
                            </Modal>
                            {statusBarChat()}
                            <Divider/>
                            <Paper className={classStyle.messageGrid} square>
                                <Grid>
                                    <List>
                                        {listItemButtonChat()}
                                    </List>
                                </Grid>
                                <div ref={messagesEndRef}/>
                            </Paper>
                            <Divider/>
                            <Paper style={{ backgroundColor:"#fafbfc" }} square>
                                <Grid className={classStyle.selectedFiles} xs={12} item>
                                    {selectedFiles && createFilesArray().map((file, i) =>
                                        <Grid xs item key={i}>
                                            <span>{file.name.length > 30 ? file.name.slice(0, 30) + "..." : file.name} {"\n"}</span>
                                            <span is="button"
                                                  style={{cursor: "pointer", '&:hover': {color: "#fff",},}}
                                                  onClick={() => delSelectedFiles(i)}><HighlightOffIcon/></span>
                                        </Grid>
                                    )}
                                </Grid>
                                {forwardMessages.length > 0 && forwardChat === false &&
                                    <Grid xs item fullWidth style={{ display: "flex", alignItems: 'center', height: 45, marginTop: 10}}>
                                        <Grid xs={1} item style={{ marginLeft: 10, maxWidth: 3, marginRight: 10 }}>
                                            <Divider orientation="vertical" className={classes.divider}/>
                                        </Grid>
                                        <Grid xs item style={{ fontWeight: 'bold' }}>{"Пересланных сообщений: " + forwardMessages.length}</Grid>
                                        <Grid xs={1} item style={{ display: "flex", minWidth: 60, justifyContent: 'flex-end', marginRight: 10 }}>
                                            <IconButton onClick={() => setForwardMessages([])}>
                                                <ClearIcon/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                }
                                <Grid container
                                      className={classes.gridAlignCenter}
                                      style={{ height: `calc(113px)`, marginLeft: 6}}>
                                    <Grid xs={1} item className={classes.buttonChat}>
                                        <DropdownButton
                                            as={ButtonGroup}
                                            key="up"
                                            className={classes.iconInput}
                                            variant="contained"
                                            color="primary"
                                            id="dropdown-button-drop-up"
                                            drop="up"
                                            disabled={!selectedChat}
                                            title={<AttachFileIcon style={{color: "#fff"}}/>}
                                        >
                                            <Dropdown.Item
                                                as="button"
                                                variant="contained"
                                                onClick={selectFile}
                                                disabled={!selectedChat}
                                                title={"Прикрепить файл"}
                                            >
                                                <input
                                                    type="file"
                                                    style={{ display: "none" }}
                                                    ref={fileInput}
                                                    multiple
                                                    onChange={(e) => uploadFiles(e)}
                                                />
                                                С устройства
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                title={"Прикрепить файл"}
                                            >
                                        <span
                                            is="button"
                                            variant="contained"
                                            onClick={handleOpenUpload}>
                                            Из профиля
                                        </span>
                                                    <Modal
                                                        show={modalUpload}
                                                        centered="true"
                                                        aria-labelledby="contained-modal-title-vcenter"
                                                        onHide={handleCloseUpload}
                                                    >
                                                        <Modal.Header style={{ backgroundColor:"#fafbfc" }}>
                                                            <Modal.Title id="contained-modal-title-vcenter">
                                                                Выберите изображения из профиля
                                                            </Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <Container component="main">
                                                                <main className={classes.layout}>
                                                                    <FormControl className={classes.formControl}>
                                                                        <InputLabel id="selected-files">Прикрепить файлы</InputLabel>
                                                                        <Select
                                                                            className={classes.rootSelect}
                                                                            multiple
                                                                            labelId="selected-files"
                                                                            value={selectFiles}
                                                                            title={"Прикрепить файлы"}
                                                                            onChange={handleFiles}
                                                                            input={<Input id="select-multiple-chip-for-files"/>}
                                                                            renderValue={(selected) => (
                                                                                <div className={classes.chips}>
                                                                                    {selected.map((value) => (
                                                                                        <Chip
                                                                                            key={value.id}
                                                                                            label={value.name}
                                                                                            className={classes.chip}
                                                                                        />
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                            MenuProps={MenuProps}
                                                                        >
                                                                            {allFiles.map((x) => (
                                                                                <MenuItem key={x.id} value={x} id={x.id}>
                                                                                    {x.name}
                                                                                </MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>
                                                                </main>
                                                            </Container>
                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button onClick={() => acceptButton()}>Принять</Button>
                                                            <Button onClick={() => handleCloseUpload()}>Отменить</Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                </Dropdown.Item>
                                            </DropdownButton>
                                        </Grid>
                                        <Grid xs item className={classes.gridAlignCenter}>
                                            <TextField
                                                className={classes.root}
                                                multiline
                                                minRows={1}
                                                maxRows={3}
                                                variant="outlined"
                                                fullWidth
                                                id="content"
                                                label="Напишите сообщение..."
                                                name="content"
                                                autoComplete="off"
                                                value={content}
                                                onChange={(content) => onChangeSearchContactsContent(content, 'message')}
                                                onKeyPress={(key) => checkKey(key)}
                                            />
                                        </Grid>
                                        <Grid xs={1} item className={classes.buttonChat} style={{ marginRight: 10, }}>
                                            <Button
                                                className={classes.iconInput}
                                                variant="contained"
                                                color="primary"
                                                onClick={sendMessage}
                                                disabled={disableButton()}
                                                title={"Отправить"}
                                            >
                                                <SendIcon/>
                                            </Button>
                                        </Grid>
                                </Grid>
                            </Paper>
                        </Grid>}
                </Grid>
            </Grid>
        </Card>
    )
}

export default withStyles(useStyles)(Chat)