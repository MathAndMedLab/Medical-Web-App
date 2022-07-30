import {Card, Divider, List, Paper, TextField, Typography, withStyles} from "@material-ui/core"
import {Link, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react"
import UserService from "../../services/user.service"
import Grid from "@material-ui/core/Grid"
import AuthService from "../../services/auth.service"
import Button from "@material-ui/core/Button"
import ListItemButton from '@mui/material/ListItemButton';
import UserCardMessage from "./user-card-msg.component"
import ChatService from "../../services/chat.service"
import RecipientMsg from "./recipient.msg.component"
import SenderMsg from "./sender.msg.component"
import Avatar from "@material-ui/core/Avatar";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import DicomAnonymizerService from "../../services/dicom-anonymizer.service";
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';


const useStyles = theme => ({
    root: {
        width: 510,
        marginLeft: 6,
        marginRight: 6,
        "& .MuiFormLabel-root": {
            margin: 0,
            color: "black"
        }
    },
    inputSearchContacts: {
        width: 305,
        margin: 6,
        marginRight: 6,
        marginTop: 8,
        "& .MuiFormLabel-root": {
            margin: 0,
            color: "black"
        }
    },
    inputSearchMsg: {
        width: 650,
        marginTop: theme.spacing(-2),
        marginBottom: theme.spacing(1),
        "& .MuiFormLabel-root": {
            margin: 0,
            color: "black"
        }
    },
    paper: {
        marginTop: theme.spacing(3),
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(-7),
        color: "black",
        overflowY: "auto",
        height: 623,
    },
    paper2: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
        color: "black",
        minHeight: 600,
        width: 700
    },
    mainGrid: {
        display: 'flex',
        minWidth: 1000,
        marginTop: theme.spacing(-2),
    },
    button: {
        width: 220,
        '&:active': {
            backgroundColor: '#bdff59',
        }
    },
    messageGrid: {
        width: 650,
        height: 507,
        overflowY: "auto",
        marginBottom: theme.spacing(1.5),
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
    noticeMsg: {
        backgroundColor: '#FF0040',
        textAlign: 'center',
        color: 'white',
        width: 25
    },
    itemButton: {
        padding: 0,
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
    flex: {
        display: 'flex',
    },
    lastMsgTimeContent: {
        color: '#888888',
        textAlign: "right"
    },
    lastMsgTextContent: {
        color: '#888888',
    },
    gridFullWidth: {
        width: '100%'
    },
    iconInput: {
        width: "100%",
        height: 56,
    }
})

function Chat(props) {
    const {classes} = props
    const {stompClient} = props
    const {minusUnRead} = props
    const {usersWithLastMsg} = props
    const {setUsersWithLastMsg} = props
    const {allMessages} = props
    const {setAllMessages} = props
    const {selected} = useParams()
    const [processedUnreadMessages, setProcessedUnreadMessages] = useState([])
    const [content, setContent] = useState("")
    const [contentPresence, setContentPresence] = useState(false)
    const [contentCorrect, setContentCorrect] = useState("")

    const [searchContent, setSearchContent] = useState("")
    const [searchContentPresence, setSearchContentPresence] = useState(false)
    const [searchContentCorrect, setSearchContentCorrect] = useState("")

    const [searchContacts, setSearchContacts] = useState("")
    const [searchContactsPresence, setSearchContactsPresence] = useState(false)
    const [searchContactsCorrect, setSearchContactsCorrect] = useState("")

    const [selectedUser, setSelectedUser] = useState(null)
    const [refresh, setRefresh] = useState({})
    const [selectedFiles, setSelectedFiles] = useState(null)
    const messagesEndRef = useRef(null)
    const fileInput = useRef(null)
    useEffect(() => {
        getContacts();
    }, [])

    function updateContacts() {
        UserService.pushContacts(AuthService.getCurrentUser().username, selected)
            .then(async (response) => {
                let user = response.data
                if (user.avatar) {
                    const base64Response = await fetch(`data:application/json;base64,${user.avatar}`)
                    const blob = await base64Response.blob()
                    user.avatar = URL.createObjectURL(blob)
                }
                // let userWithLastMsg = {first: user, second: null}
                // setUsersWithLastMsg(prev => prev.set(user.username, userWithLastMsg))
                // selectUser(user)
            })
            .catch((e) => {
                console.log(e)
            })
    }

    function selectNotInContactsUser() {
        UserService.getUserByUsername(selected)
            .then(async (response) => {
                let user = response.data
                selectUser(user)
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

    function deleteMsgClient(msg) {
        let newMsgArray;
        if (msg.id) {
            newMsgArray = allMessages.get(selectedUser.username).messages.filter(value => value.id !== msg.id)
        } else {
            newMsgArray = allMessages.get(selectedUser.username).messages.filter(value => value.sendDate !== msg.sendDate)
        }
        const valueMap = {unRead: 0, messages: newMsgArray}
        let lastMsg = null;
        if (newMsgArray.length > 0) {
            lastMsg = newMsgArray[newMsgArray.length - 1]
        }
        setAllMessages(prev => prev.set(selectedUser.username, valueMap))
        setUsersWithLastMsg(prev => prev.set(selectedUser.username, {
            first: selectedUser,
            second: lastMsg
        }))
        setRefresh({})
    }

    function getContacts() {
        UserService.getContacts(AuthService.getCurrentUser().username)
            .then((response) => {
                const userWithLastMsgArray = response.data.contactWithLastMsg
                userWithLastMsgArray.map(async user => {
                    if (user.first.avatar) {
                        const base64Response = await fetch(`data:application/json;base64,${user.first.avatar}`)
                        const blob = await base64Response.blob()
                        user.first.avatar = URL.createObjectURL(blob)
                    }
                    setUsersWithLastMsg(prev => prev.set(user.first.username, user))
                    setRefresh({})
                })
                const user = userWithLastMsgArray.find(user => user.first.username === selected)
                if (selected && !user) {
                    // updateContacts();
                    selectNotInContactsUser()
                } else if (selected && user) {
                    selectUser(user.first)
                }
                // This state update is artificial, for forced rendering contacts list.
                setRefresh({})
            })
            .catch((e) => {
                console.log(e)
            })
    }

    function onChangeMessageContent(e) {
        let str = e.target.value
        str = str.replace(/ {2,}/g, ' ').trim()
        str = str.replace(/[\n\r ]{3,}/g, '\n\r\n\r')
        if (str.charCodeAt(0) > 32) {
            setContent(e.target.value)
            setContentCorrect(str)
            setContentPresence(true)
        } else {
            setContent(e.target.value)
            setContentCorrect(str)
            setContentPresence(false)
        }
    }

    function onChangeSearchContent(e) {
        let str = e.target.value
        str = str.replace(/ {2,}/g, ' ').trim()
        str = str.replace(/[\n\r ]{3,}/g, '\n\r\n\r')
        if (str.charCodeAt(0) > 32) {
            setSearchContent(e.target.value)
            setSearchContentCorrect(str)
            setSearchContentPresence(true)
        } else {
            setSearchContent(e.target.value)
            setSearchContentCorrect(str)
            setSearchContentPresence(false)
        }
    }

    function onChangeSearchContacts(e) {
        let str = e.target.value
        str = str.replace(/ {2,}/g, ' ').trim()
        str = str.replace(/[\n\r ]{3,}/g, '\n\r\n\r')
        if (str.charCodeAt(0) > 32) {
            setSearchContacts(e.target.value)
            setSearchContactsCorrect(str)
            setSearchContactsPresence(true)
        } else {
            setSearchContacts(e.target.value)
            setSearchContactsCorrect(str)
            setSearchContactsPresence(false)
        }
    }

    function checkKey(key) {
        if (key.key === "Enter" && key.shiftKey === false && selectedUser && contentPresence) {
            sendMessage()
        }
    }

    async function sendMessage() {
        if (stompClient) {
            let fileNameAndStringBase64 = []
            let pairFileNameBase64
            let uid = null
            if (selectedFiles) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    if (selectedFiles[i].name.endsWith(".dcm")) {

                        var dicomContAndUID = await DicomAnonymizerService.anonymizeInstance(selectedFiles[i]);
                        var anonymizedDicomBlobArrayBuff = dicomContAndUID.dicom;
                        uid = dicomContAndUID.UID;
                        const blobDicom = new Blob([anonymizedDicomBlobArrayBuff])
                        let readerPromise = new Promise((resolve, reject) => {
                            let reader = new FileReader();
                            reader.onload = () => {
                                resolve(reader.result);
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(blobDicom);
                        })
                        const fileStringBase64 = await readerPromise;
                        selectedFiles[i] = {name: selectedFiles[i].name, uid: uid}
                        pairFileNameBase64 = {fileName: selectedFiles[i].name, fileContent: fileStringBase64}
                    } else {
                        let readerPromise = new Promise((resolve, reject) => {
                            let reader = new FileReader();
                            reader.onload = () => {
                                resolve(reader.result);
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(selectedFiles[i]);
                        })
                        const fileStringBase64 = await readerPromise;
                        pairFileNameBase64 = {fileName: selectedFiles[i].name, fileContent: fileStringBase64}
                    }
                    fileNameAndStringBase64.push(pairFileNameBase64)
                }
            }
            const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
            const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
            const message = {
                content: contentCorrect,
                recipientId: selectedUser.id,
                recipientName: selectedUser.username,
                senderId: AuthService.getCurrentUser().id,
                senderName: AuthService.getCurrentUser().username,
                attachmentsBlobForImageClient: selectedFiles,
                localFiles: fileNameAndStringBase64,
                sendDate: localISOTime,
                timeZone: timeZone,
                uid: uid
            }
            var isFirstMessage = true;
            if (allMessages.get(selectedUser.username)) {
                isFirstMessage = false;
                let msg = allMessages.get(selectedUser.username).messages
                msg.push(message)
                const valueMap = {unRead: 0, messages: msg}
                setAllMessages(prev => (prev.set(selectedUser.username, valueMap)))
            } else {
                let msg = []
                msg.push(message)
                const valueMap = {unRead: 0, messages: msg}
                setAllMessages(prev => (prev.set(selectedUser.username, valueMap)))
            }
            setUsersWithLastMsg(prev => prev.set(selectedUser.username, {first: selectedUser, second: message}))
            stompClient.send("/app/send/" + selectedUser.username, {}, JSON.stringify(message))
            setSelectedFiles(null)
            setContent("")
            setContentCorrect("")
            setContentPresence(false)
            if (isFirstMessage)
                updateContacts();
        }
    }

    function selectUser(user) {
        setSelectedUser(user)
        ChatService.getMessages(AuthService.getCurrentUser().username, user.username)
            .then((response) => {
                if (response.data.length > 0) {
                    const valueMap = {unRead: 0, messages: response.data}
                    setAllMessages(prev => (prev.set(user.username, valueMap)))
                    setRefresh({})
                    goToBottom()
                }
            })
            .catch((e) => {
                console.log(e)
            })
        setRefresh({})
    }

    function selectFile() {
        fileInput.current.click()
    }

    function getDayOfWeek(yesterday1, messageTime, days) {
        yesterday1.setDate(yesterday1.getDate() - 1)
        if (yesterday1.getDate() === messageTime.getDate() && yesterday1.getMonth() === messageTime.getMonth()) {
            return days [messageTime.getDay()]
        } else {
            return false
        }
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

    function detectTimeInCurrentTimeZone(time, zone) {
        let messageTime = new Date(time)
        let timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone)
        const difsTimeZones = getOffsetBetweenTimezonesForDate(new Date(), zone, timeZone)
        return (new Date(new Date(messageTime).getTime() - difsTimeZones))
    }

    function processTimeSend(timeMsg) {
        let today = new Date()
        let messageTime = new Date(timeMsg)
        if (today.toDateString() === messageTime.toDateString()) {
            return (((messageTime.getHours() < 10 && "0" + messageTime.getHours()) || messageTime.getHours() >= 10 && messageTime.getHours()) + ":"
                + ((messageTime.getMinutes() < 10 && "0" + messageTime.getMinutes())
                    || (messageTime.getMinutes() >= 10 && messageTime.getMinutes())
                ))
        } else if (today.getFullYear() === messageTime.getFullYear()) {
            let yesterday1 = new Date(today)
            yesterday1.setDate(yesterday1.getDate() - 1)
            if (yesterday1.getDate() === messageTime.getDate()) {
                return "Вчера"
            }
            const days = ["ВC", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"]
            for (let i = 0; i < 5; i++) {
                const dayOfWeek = getDayOfWeek(yesterday1, messageTime, days)
                if (dayOfWeek) {
                    return dayOfWeek
                }
            }
        }
        return (
            ((messageTime.getDate() < 10 && "0" + messageTime.getDate()) || (messageTime.getDate() >= 10 && messageTime.getDate()))
            + "."
            + (((messageTime.getMonth() + 1) < 10 && "0" + (messageTime.getMonth() + 1)) || (((messageTime.getMonth() + 1) >= 10 && (messageTime.getMonth() + 1))))
            + "." + messageTime.getFullYear()
        )

    }

    function sortContacts() {
        let sortedContacts = [...usersWithLastMsg.values()]
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
            .filter((userAndLastMsg, index) => {
                const nameAndSurname = userAndLastMsg.first.initials.split(" ")
                return (nameAndSurname[0] + " " + nameAndSurname[1]).includes(searchContacts)
            })
            .map((userAndLastMsg, index) => (
                <Grid key={index}>
                    <Link onClick={() => selectUser(userAndLastMsg.first)}
                          to={"/msg/" + userAndLastMsg.first.username}
                          style={{textDecoration: 'none'}}>
                        <ListItemButton
                            value={userAndLastMsg.first}
                            selected={selectedUser && selectedUser.username === userAndLastMsg.first.username}
                            title={userAndLastMsg.first.lastname + " " + userAndLastMsg.first.firstname}
                        >
                            <Grid className={classes.flex} xs={12} item>
                                <Grid xs={2} item>
                                    <Avatar className={classes.avatar} src={userAndLastMsg.first.avatar}>
                                        <PhotoCameraOutlinedIcon/>
                                    </Avatar>
                                </Grid>
                                <Grid xs={10} item>
                                    <Grid className={classes.gridFullWidth}>
                                        <Grid className={classes.flex} xs={12} item>
                                            <Grid xs={9} item>
                                                <UserCardMessage user={userAndLastMsg.first}
                                                />
                                            </Grid>
                                            <Grid xs={3} item>
                                                <Grid className={classes.lastMsgTimeContent}>
                                                    {
                                                        userAndLastMsg.sendDateInCurrentTimeZone && processTimeSend(userAndLastMsg.sendDateInCurrentTimeZone)
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid className={classes.flex} xs={12} item>
                                        <Grid xs={10} item
                                              className={classes.lastMsgTextContent}>{
                                            (userAndLastMsg.second && userAndLastMsg.second.content && userAndLastMsg.second.content.length < 25 && userAndLastMsg.second.content.length > 0 && userAndLastMsg.second.content)
                                            || (userAndLastMsg.second && userAndLastMsg.second.content && userAndLastMsg.second.content.length > 25 && userAndLastMsg.second.content.slice(0, 25) + "...")
                                            || (userAndLastMsg.second && userAndLastMsg.second.content !== null &&
                                                <Typography style={{fontSize: 14, color: '#227ba2'}}>Файл</Typography>)
                                        }
                                        </Grid>
                                        {allMessages.get(userAndLastMsg.first.username) && (allMessages.get(userAndLastMsg.first.username).unRead > 0)
                                        && <Grid>
                                            <Paper
                                                className={classes.noticeMsg}>{allMessages.get(userAndLastMsg.first.username).unRead}
                                            </Paper>
                                        </Grid>}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ListItemButton>
                        <Divider/>
                    </Link>
                </Grid>
            )))
    }

    function updateStatusMsg() {
        //Сюда заходить очень часто во время отображения сообщений, надо бы оптимизировать
        const dataMsg = allMessages.get(selectedUser.username)
        if (dataMsg && dataMsg.unRead > 0) {
            let unreadArr = dataMsg.messages.filter(msg => msg.statusMessage === "UNREAD" && msg.senderName === selectedUser.username && !processedUnreadMessages.includes(msg.id))
            if (unreadArr.length > 0) {
                unreadArr.map(msg => setProcessedUnreadMessages(prevState => (prevState.concat([msg.id]))))
                ChatService.updateStatusUnreadMessages(unreadArr).then()
            }
            minusUnRead(dataMsg.unRead)
            dataMsg.unRead = 0
            setAllMessages(prev => (prev.set(selectedUser.username, dataMsg)))
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
        if (selectedUser) {
            return !(contentPresence || selectedFiles);

        }
        return true
    }

    function uploadFiles(e) {
        const MAX_NUM_FILES = 6
        const MAX_SIZE_FILES = 52428800
        let err_files = false
        let files = Array.from(e.target.files)
        if (files.length > MAX_NUM_FILES) {
            files.splice(MAX_NUM_FILES)
            err_files = true
        }
        let removedCount = 0
        const length = files.length
        for (let i = 0; i < length; i++) {
            if (files[i - removedCount].size > MAX_SIZE_FILES) {
                files.splice(i - removedCount, 1)
                removedCount++
                err_files = true
            }
        }
        if (err_files) {
            alert("Кол-во <= 6, размер <= 50МБ")
        }
        if (files.length === 0) {
            files = null
        }
        setSelectedFiles(files)
    }

    return (
        <Grid xs={12} item className={classes.mainGrid}>
            <Grid xs={3} item>
                <Card className={classes.paper}>
                    <TextField
                        fullWidth
                        className={classes.inputSearchContacts}
                        minRows={1}
                        maxRows={6}
                        variant="outlined"
                        size="small"
                        id="searchContacts"
                        label="Поиск по контактам..."
                        name="searchContacts"
                        autoComplete="off"
                        value={searchContacts}
                        onChange={(searchContacts) => onChangeSearchContacts(searchContacts)}
                    />
                    <List className={classes.itemButton}>
                        {usersWithLastMsg && sortContacts()}
                    </List>
                </Card>
            </Grid>

            <Grid xs={9} item>
                <Card className={classes.paper2}>
                    {selectedUser &&
                    <Grid>
                        <Grid container>
                            {/*<Grid xs={2}><UserCardMessage user={selectedUser}/></Grid>*/}
                            <Grid >
                                <TextField size="small"
                                           fullWidth
                                           className={classes.inputSearchMsg}
                                           variant="outlined"
                                           id="searchContent"
                                           label="Поиск по сообщениям..."
                                           name="searchContent"
                                           autoComplete="off"
                                           value={searchContent}
                                           onChange={(searchContent) => onChangeSearchContent(searchContent)}
                                />
                            </Grid>
                        </Grid>
                        <Paper

                            className={classes.messageGrid}>

                            <Grid>

                                {selectedUser && (allMessages.get(selectedUser.username)) && ([...allMessages.get(selectedUser.username).messages].filter((msg) => msg.content.includes(searchContent)).map((msg, index) => (

                                    ((((msg.senderName !== selectedUser.username) || (msg.senderName === msg.recipientName)) &&
                                        (
                                            <SenderMsg msg={msg} key={index} scrollToBottom={scrollToBottom}
                                                       deleteMsgClient={deleteMsgClient}/>
                                        )) || (((msg.senderName === selectedUser.username) &&
                                            (
                                                <RecipientMsg msg={msg} key={index}
                                                              initialsSender={selectedUser.initials}
                                                              updateStatusMsg={updateStatusMsg}
                                                              scrollToBottom={scrollToBottom}
                                                />
                                            ))
                                    ))

                                )))
                                }
                            </Grid>
                            <div ref={messagesEndRef}/>
                        </Paper>

                        <Grid container>
                            <Grid>
                                <input type="file" style={{"display": "none"}} ref={fileInput} multiple
                                       onChange={(e) => uploadFiles(e)}/>
                                <Button className={classes.iconInput}
                                        variant="contained"
                                        color="primary"
                                        onClick={selectFile}
                                        disabled={(!selectedUser)}
                                        title={"Прикрепить файл"}
                                >
                                    <AttachFileIcon/>

                                </Button>
                            </Grid>
                            <Grid>
                                <TextField
                                    className={classes.root}
                                    multiline
                                    minRows={1}
                                    maxRows={6}
                                    variant="outlined"
                                    id="content"
                                    label="Напишите сообщение..."
                                    name="content"
                                    autoComplete="off"
                                    value={content}
                                    onChange={(content) => onChangeMessageContent(content)}
                                    onKeyPress={(key) => checkKey(key)}
                                />
                            </Grid>
                            <Grid>
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
                            <Grid>
                                {selectedFiles && createFilesArray().map((file) => (file.name))}
                            </Grid>
                        </Grid>
                    </Grid>}
                </Card>
            </Grid>

        </Grid>

    )
}

export default withStyles(useStyles)(Chat)