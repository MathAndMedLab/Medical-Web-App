import React, {useEffect, useState} from "react";
import '../../styles/Search.css'
import {ImageList, ImageListItem, Paper, Tooltip, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import AttachmentService from "../../services/attachment.service";
import ChatService from "../../services/chat.service";
import Button from "@material-ui/core/Button";

const useStyles = theme => ({

    msgNotMy: {
        width: "fit-content",
        height: "fit-content",
        margin: 20,
        padding: theme.spacing(0.5),
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        maxWidth: 400,
        elevation: 2,
        backgroundColor: '#eeeeee'
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
    const [timeMsgCurrentTimeZone, setTimeMsgCurrentTimeZone] = useState([])
    useEffect(async () => {
        updateStatusMsg(msg)
        await getFiles()
        processTime()
        scrollToBottom()
    }, [msg]);

    function processTime() {
        let timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone)
        const difsTimeZones = getOffsetBetweenTimezonesForDate(new Date(), msg.timeZone, timeZone)
        setTimeMsgCurrentTimeZone(new Date(new Date(msg.sendDate).getTime() - difsTimeZones))
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

    function openDicomViewer(uid) {
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
            <Paper className={classes.msgNotMy}>
                <Grid className={classes.txt}>
                    <Link to={"/profile/" + msg.senderName} className={classes.link}>
                        {initialsSender}
                    </Link>
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
                                            <img onClick={() => openDicomViewer(image.uid)}
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
                <Grid
                    className={classes.time}>
                    {
                        (((new Date(timeMsgCurrentTimeZone).getHours() < 10 && "0" + new Date(timeMsgCurrentTimeZone).getHours())
                                || (new Date(timeMsgCurrentTimeZone).getHours() >= 10 && new Date(timeMsgCurrentTimeZone).getHours())) + ":"
                            + ((new Date(timeMsgCurrentTimeZone).getMinutes() < 10 && "0" + new Date(timeMsgCurrentTimeZone).getMinutes())
                                || (new Date(timeMsgCurrentTimeZone).getMinutes() >= 10 && new Date(timeMsgCurrentTimeZone).getMinutes())
                            )) + "    " + (
                            ((new Date(timeMsgCurrentTimeZone).getDate() < 10 && "0" + new Date(timeMsgCurrentTimeZone).getDate()) || (new Date(timeMsgCurrentTimeZone).getDate() >= 10 && new Date(timeMsgCurrentTimeZone).getDate()))
                            + "."
                            + (((new Date(timeMsgCurrentTimeZone).getMonth() + 1) < 10 && "0" + (new Date(timeMsgCurrentTimeZone).getMonth() + 1)) || (((new Date(timeMsgCurrentTimeZone).getMonth() + 1) >= 10 && (new Date(timeMsgCurrentTimeZone).getMonth() + 1))))
                            + "." + new Date(timeMsgCurrentTimeZone).getFullYear()
                        )
                    }
                </Grid>
            </Paper>
        </Grid>
    );

}

export default withStyles(useStyles)(RecipientMsg)