import React, {useEffect, useState} from "react";
import '../../styles/Search.css'
import {Divider, ImageList, ImageListItem, List, Paper, Tooltip, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import AttachmentService from "../../services/attachment.service";
import ChatService from "../../services/chat.service";
import Button from "@material-ui/core/Button";
import UserService from "../../services/user.service";
import TimeMsg from "./time-msg.component";
import ForwardMessage from "./forward-message.component";

const useStyles = theme => ({

    msgNotMy: {
        width: "fit-content",
        height: "fit-content",
        margin: 5,
        padding: theme.spacing(0.5),
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        maxWidth: 400,
        elevation: 2,
        backgroundColor: '#eeeeee',
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
        marginBottom: 10
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

function RecipientMsg(props) {
    const {classes} = props;
    const {msg} = props;
    const {updateStatusMsg} = props
    const {initialsSender} = props
    const {scrollToBottom} = props
    const [images, setImages] = useState([])
    const [files, setFiles] = useState([])
    const [mapInitials, setMapInitials] = useState(new Map())
    useEffect(async () => {
        updateStatusMsg(msg)
        await getFiles()
        scrollToBottom()
    }, [msg]);

    async function getFiles() {
        setImages([])
        setFiles([])
        let imagesPreview = [];
        let filesPreview = [];
        if (msg.images && msg.images.length > 0) {
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

    function getInitialsUser(username) {
        let user
        UserService.getUserByUsername(username).then(async (response) => {
            user = await response.data
        })
        .catch((e) => {
            console.log(e)
        })
        return user.initials
    }

    return (
        <Grid>
            <Paper className={classes.msgNotMy}>
                <Grid className={classes.txt}>
                    <Link to={"/profile/" + msg.senderName} className={classes.link}>
                        {initialsSender !== undefined ? initialsSender : getInitialsUser(msg.senderName)}
                    </Link>
                </Grid>
                <Grid style={{marginBottom: 10}}>
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
            </Paper>
        </Grid>
    );

}

export default withStyles(useStyles)(RecipientMsg)