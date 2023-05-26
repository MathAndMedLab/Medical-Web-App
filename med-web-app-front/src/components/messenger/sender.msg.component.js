import React, {useEffect, useRef, useState} from "react";
import '../../styles/Search.css'
import {
    Collapse,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    ImageList,
    ImageListItem, List,
    Paper, Tooltip,
    withStyles
} from "@material-ui/core";
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import AuthService from "../../services/auth.service";
import ChatService from "../../services/chat.service"
import Button from "@material-ui/core/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import AttachmentService from "../../services/attachment.service";
import TimeMsg from "./time-msg.component";
import ForwardMessage from "./forward-message.component";

const useStyles = theme => ({

    msgMy: {
        width: "fit-content",
        height: "fit-content",
        margin: 5,
        marginLeft: "auto",
        backgroundColor: '#a1e9ff',
        padding: theme.spacing(0.5),
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        maxWidth: 400,
        '@media (max-width: 475px)': {
            maxWidth: 300
        },
        '@media (max-width: 375px)': {
            maxWidth: 250
        }
    },
    txt: {
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 10,
    },
    time: {
        color: '#888888',
        fontSize: 12,
        marginTop: theme.spacing(0.5),
        textAlign: "right"
    },
    link: {
        color: "black",
    },
    collapsed: {
        marginTop: -3,
        marginLeft: 3,
        color: '#888888',
        float: "right",
        '&:hover': {
            cursor: "pointer",
        }
    },
    paperDelete: {
        '&:hover': {
            cursor: "pointer",
            textDecoration: 'underline'
        },
    },
    button: {
        backgroundColor: '#f50057',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
    },
    listForward: {
        display: 'flex',
        flexDirection: 'column',
        width: 392,
        '@media (max-width: 475px)': {
            maxWidth: 292
        },
        '@media (max-width: 375px)': {
            maxWidth: 242
        }
    }
});

function SenderMsg(props) {
    const {classes} = props
    const {msg} = props
    const {scrollToBottom} = props
    const {deleteMsgClient} = props
    const [images, setImages] = useState([])
    const [files, setFiles] = useState([])
    const [checked, setChecked] = useState(false)
    const [showPaper, setShowPaper] = useState(false)
    const [paperX, setPaperX] = useState(false)
    const [paperY, setPaperY] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const KeyboardArrowDownIconRef = useRef();
    useEffect(async () => {
        await getFiles()
        // processTime()
        scrollToBottom()
    }, [msg]);

    async function getFiles() {
        setImages([])
        setFiles([])
        let imagesPreview = [];
        let filesPreview = [];
        if (msg.attachmentsBlobForImageClient && msg.attachmentsBlobForImageClient.length > 0) {
            for (let i = 0; i < msg.attachmentsBlobForImageClient.length; i++) {
                if(msg.attachmentsBlobForImageClient[i].image){
                    imagesPreview.push({
                        image: msg.attachmentsBlobForImageClient[i].image,
                        uid: msg.attachmentsBlobForImageClient[i].uid,
                    });
                } else {
                    if (msg.attachmentsBlobForImageClient[i].name.endsWith(".jpg") ||
                        msg.attachmentsBlobForImageClient[i].name.endsWith(".png")
                    ) {
                        console.log(msg.attachmentsBlobForImageClient[i])
                        imagesPreview.push({
                            image: URL.createObjectURL(msg.attachmentsBlobForImageClient[i])
                        })
                    } else if (msg.attachmentsBlobForImageClient[i].name.endsWith(".dcm")) {
                        filesPreview.push({
                            initialName: msg.attachmentsBlobForImageClient[i].name,
                            uid: msg.attachmentsBlobForImageClient[i].uid
                        })
                    } else {
                        filesPreview.push({
                            initialName: msg.attachmentsBlobForImageClient[i].name
                        })
                    }
                }
            }
        } else if (msg.images && msg.images.length > 0) {
            for (let i = 0; i < msg.images.length; i++) {
                const base64Data = msg.images[i]
                if (msg.uidFilesDicom[i]) {
                    imagesPreview.push({
                        image: `data:application/json;base64,${base64Data}`,
                        uid: msg.uidFilesDicom[i]
                    })
                } else {
                    imagesPreview.push({
                        image: `data:application/json;base64,${base64Data}`,
                    })
                }
            }
        } else if (msg.attachments && msg.attachments.length > 0) {
            for (let i = 0; i < msg.attachments.length; i++) {
                if (!(msg.attachments[i].initialName.endsWith(".jpg") ||
                    msg.attachments[i].initialName.endsWith(".png") ||
                    msg.attachments[i].initialName.endsWith(".dcm"))
                ) {
                    filesPreview.push(
                        msg.attachments[i]
                    )
                }
            }
        }
        setImages(imagesPreview)
        setFiles(filesPreview)
    }

    function agreeToDelete() {
        if (msg.id) {
            ChatService.deleteMsg(msg)
        } else {
            ChatService.deleteMsgByTimeAndChatId(msg.sendDate, msg.senderName, msg.recipientName)
        }
        deleteMsgClient(msg)
        setOpenDialog(false)
        setChecked(false)
    }

    function disagreeToDelete() {
        setChecked(false)
        setOpenDialog(false)
    }

    function deleteMsg() {
        setOpenDialog(true)
    }

    function handleClick(e) {
        console.log(msg)
        if (!showPaper) {
            setPaperX(KeyboardArrowDownIconRef.current.getBoundingClientRect().x - 165)
            setPaperY(KeyboardArrowDownIconRef.current.getBoundingClientRect().y + 20)
            setShowPaper(true)
        } else {
            setShowPaper(false)
        }
    }

    function openDicomViewer(event, uid) {
        event.stopPropagation()
        const url = window.location.href
        const num = url.indexOf(":7999")
        window.open(url.slice(0, num + 1) + "3000/viewer/" + uid, '_blank')
    }

    function download(file) {
        if (file.id) {
            AttachmentService.downloadAttachment(file.id, file.initialName);
        } else {
            ChatService.downloadAttachmentByMsgSendDate(msg.sendDate, msg.senderName, msg.recipientName, file.initialName)
        }
    }

    return (
        <Grid>
            <Paper className={classes.msgMy} onMouseOver={() => setChecked(true)}
                   onMouseLeave={() => setChecked(false)}>
                <Grid>
                    <Grid style={{display: "flex"}}>
                        <Grid className={classes.txt}>
                            <Link to={"/profile/" + msg.senderName} className={classes.link}>
                                {AuthService.getCurrentUser().initials}
                            </Link>
                        </Grid>
                        <Grid>
                            <Collapse in={checked} title={"Удалить"}>
                                {/*<KeyboardArrowDownIcon onClick={(e => handleClick(e))} ref={KeyboardArrowDownIconRef}*/}
                                {/*                       className={classes.collapsed}/>*/}
                                <DeleteIcon onClick={(e => deleteMsg(e))} ref={KeyboardArrowDownIconRef}
                                            className={classes.collapsed}
                                />
                            </Collapse>
                            <Dialog
                                open={openDialog}
                                onClose={disagreeToDelete}
                            >
                                <DialogContent>
                                    <DialogContentText style={{fontSize: 20, color: "black"}}>
                                        Вы уверены, что хотите удалить сообщение?
                                        <br/>
                                    </DialogContentText>
                                    <DialogActions>
                                        <Button
                                            className={classes.button}
                                            onClick={disagreeToDelete}
                                        title = {"Нет"}>
                                            Нет
                                        </Button>
                                        <Button className={classes.button}
                                                onClick={agreeToDelete}
                                        title={"Да"}>
                                            Да
                                        </Button>
                                    </DialogActions>
                                </DialogContent>
                            </Dialog>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Grid>{msg.content}</Grid>
                        {images &&
                        <Grid>
                            <ImageList cols={1} rowHeight={200} gap={3}>
                                {images.map((image, index) =>
                                    <ImageListItem key={index}>
                                        {image.uid ?
                                            <Tooltip title="Открыть в DICOM Viewer">
                                                <img onClick={(event) => openDicomViewer(event, image.uid)}
                                                     src={image.image}
                                                     alt={"Перезагрузите страницу!"}
                                                     loading="lazy"
                                                     style={{cursor: 'pointer'}}
                                                >
                                                </img>
                                            </Tooltip>
                                            :
                                            <img
                                                src={image.image}
                                                alt={"Перезагрузите страницу!"}
                                                loading="lazy"
                                            />
                                        }
                                    </ImageListItem>
                                )}
                            </ImageList>
                        </Grid>
                        }
                        {files &&
                        <Grid>
                            {files.map((file, index) =>
                                <Grid key={index}>
                                    {file.uid ?
                                        <Button
                                            key={index}
                                            onClick={() => openDicomViewer(file.uid)}>
                                            <i className="fa fa-folder-open"> Открыть {file.initialName}</i>
                                        </Button>
                                        :
                                        <Button
                                            key={index}
                                            onClick={() => download(file)}>
                                            <i className="fa fa-download"> Скачать {file.initialName}</i>
                                        </Button>
                                    }
                                </Grid>
                            )}
                        </Grid>
                        }
                    </Grid>
                    <Grid>
                        {msg.forwardedMessages.length !== 0 &&
                            <List className={classes.listForward}>
                                <ForwardMessage forwardMessages={msg.forwardedMessages}/>
                            </List>
                        }
                    </Grid>
                    <Grid
                        className={classes.time}>
                        <TimeMsg timeZone={msg.timeZone} sendDate={msg.sendDate}/>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );

}

export default withStyles(useStyles)(SenderMsg)