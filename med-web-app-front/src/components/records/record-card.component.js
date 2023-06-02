import React, {useEffect, useState} from "react";
import AuthService from "../../services/auth.service";
import AttachmentService from "../../services/attachment.service";
import '../../styles/Record.css'
import {Button, Grid, ImageList, Paper, Tooltip, withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {purple} from "@material-ui/core/colors";
import {Link} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "react-bootstrap/Modal";
import RecordService from "../../services/record.service";
import clsx from "clsx"

const useStyles = theme => ({
    palette: {
        primary: {
            // Purple and green play nicely together.
            main: purple[500],
        },
        secondary: {
            // This is green.A700 as hex.
            main: '#11cb5f',
        },
        textPrimary: {
            main: "#1B435D",
        }
    },
    gridCreatorName: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        "& .MuiTypography-root": {
            color: "black",
        },
        fontWeight: '500',
        fontSize: '16px'
    },
    grid: {
        "& .MuiTypography-root": {
            color: "black",
        },
        margin: theme.spacing(1.5, 0, 0, 1),
    },
    ggrid: {
        margin: theme.spacing(0, 0, 0, 1),
        display: 'flex',

    },
    spanStyleBold: {
        margin: theme.spacing(0, 0, 0, 1),
        fontWeight: '450',
        fontSize: '16px'
    },
    spanStyle: {
        fontWeight: '400',
        fontSize: '16px'
    },
    gridContent: {
        margin: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            width: 209,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 620
        },
        "@media (min-width : 1280px)": {
            width: 1000,
        },
    },
    paper: {
        padding: theme.spacing(2),
        //marginLeft: theme.spacing(1),
        // maxWidth: 700,
        borderColor: "#e9e9e9",
        borderRadius: 10,
        /*alignItems:"center",
        display:"flex",*/
        [theme.breakpoints.down("xs")]: {
            width: 270,
        },
        
        "@media (min-width : 451px)": {
            width: 325,
        },
        "@media (min-width : 600px)": {
            width: 375,
        },
        "@media (min-width : 960px)": {
            width: 650,
        },
        "@media (min-width : 1280px)": {
            width: 800,
        },
    },
    imageStyle: {
        [theme.breakpoints.down("xs")]: {
            width: 150,
        },
        
        "@media (min-width : 451px)": {
            width: 205,
        },
        "@media (min-width : 600px)": {
            width: 255,
        },
        "@media (min-width : 960px)": {
            width: 530,
        },
        "@media (min-width : 1280px)": {
            width: 680,
        },
    },
    textStyle:{
        display: 'inline-block', 
        wordWrap: 'break-word',
        [theme.breakpoints.down("xs")]: {
            maxWidth: 220,
        },
        
        "@media (min-width : 451px)": {
            maxWidth: 275,
        },
        "@media (min-width : 600px)": {
            maxWidth: 325,
        },
        "@media (min-width : 960px)": {
            maxWidth: 600,
        },
        "@media (min-width : 1280px)": {
            maxWidth: 750,
        },
    },
    mainGrid: {
        margin: 0,
    },
    tagsColor: {
        color: "#6d6d6d",
    },
    content: {
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        [theme.breakpoints.down("xs")]: {
            width: 240,
        },
        "@media (min-width : 451px)": {
            width: 295,
        },
        "@media (min-width : 600px)": {
            width: 345,
        },
        "@media (min-width : 960px)": {
            width: 620,
        },
        "@media (min-width : 1280px)": {
            width: 770,
        },
    },


    titleStyle: {
        size: 15,
    },
    buttons: {
        width: 300,
        margin: theme.spacing(1),
        backgroundColor: '#f50057',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
    },
    deleteIcon: {
        marginLeft: 3,
        color: '#000000',
        float: "right",
        '&:hover': {
            cursor: "pointer",
        },
    },
    button: {
        width: 200,
        margin: theme.spacing(1),
        backgroundColor: '#f50057',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#ffffff',
        }
    },
})

function RecordCardNew(props) {
    const {classes} = props
    const {record} = props
    const {isPreview} = props
    const {isReply} = props
    const {getRecords} = props
    const creationTime = formatTime()
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser())
    const [filePreviews, setFilePreviews] = useState([])
    const [dicoms, setDicoms] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [refresh, setRefresh] = useState({})

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

    function getContent(content) {
        if (isPreview && content != null && content.length > 1000) {
            return content.substring(0, 1000) + '...';
        }
        return content;
    }

    function formatTime() {
        let timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone)
        const difsTimeZones = getOffsetBetweenTimezonesForDate(new Date(), record.timeZone, timeZone)
        return (new Date(new Date(record.creationTime).getTime() - difsTimeZones))
    }

    function displayRecordThread() {
        props.history.push({
            pathname: '/records/thread/' + record.id,
            state: {recordId: record.id}
        });
        window.location.reload();
    }

    useEffect(() => {
        let preview = [];
        if (record.attachments !== undefined && record.attachments !== null) {
            for (let i = 0; i < record.attachments.length; i++) {
                if (record.attachments[i].initialName.endsWith(".jpg") ||
                    record.attachments[i].initialName.endsWith(".png") ||
                    record.attachments[i].initialName.endsWith(".dcm")) {
                    AttachmentService.getPreviewNew(record.attachments[i].id).then(response => {
                        preview.push({id: record.attachments[i].id, image: URL.createObjectURL(response.data)});
                        setFilePreviews(preview)
                        setRefresh({}) // Данное состояние обновляется для принудительного рендеринга страницы.
                    }).catch(error => {
                        console.log(error);
                    })
                }
            }
        }
    }, [])

    function download(fileId, initialFileName) {
        AttachmentService.downloadAttachment(fileId, initialFileName);
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function openDicomViewer(uid) {
        const url = window.location.href
        const num = url.indexOf(":7999")
        window.open(url.slice(0, num + 1) + "3000/viewer/" + uid, '_blank')
    }

    function deleteFile(id) {
        RecordService.deleteRecord(id).then(() => {
                if (isPreview) {
                    getRecords()
                } else {
                    window.location.href = 'http://localhost:8081/#/records/view'
                }
            }
        )
        setModalShow(false)
    }

    function getDoctorSearchData() {
        if (record.postType !== "Поиск специалиста") {
            return;
        }
        return (
            <span  className={clsx( classes.textStyle)}>
                <span className={clsx(classes.spanStyleBold, classes.textStyle)}>
                    {'Интересуемые специальности: '}
                </span>
                <span className={clsx(classes.spanStyle, classes.textStyle)}>
                    {record.selectedSpecialties}
                </span>
                <br/>
                <span className={clsx(classes.spanStyleBold, classes.textStyle)}>
                    {'Диагнозы: '}
                </span>
                <span className={clsx(classes.spanStyle, classes.textStyle)}>
                    {record.specializedDiagnoses}
                </span>
                <br/>
                <span className={clsx(classes.spanStyleBold, classes.textStyle)}>
                    {'Готов(-а) заплатить: '}
                </span>
                <span className={clsx(classes.spanStyle, classes.textStyle)}>
                 {'до ' + record.maxPrice + ' ₽'}
                </span>
                <br/>
            </span>)
    }

    function DeleteModal() {
        return (
            <Modal show={modalShow} centered='true' aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Подтвердить удаление
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="alert alert-danger">Вы дейтвительно хотите удалить пост?</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setModalShow(false)}>
                        Отмена
                    </Button>
                    <Button onClick={() => deleteFile(record.id)}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Paper className={classes.paper} variant="outlined">
            <Grid container item={true} xs={12} sm direction={"column"} className={classes.mainGrid}>
                <Grid className={clsx(classes.ggrid, classes.textStyle)}>
                    <Grid className={clsx(classes.gridCreatorName)}  title={record.creator.initials}>
                        <Link style={{color: "black" }} to={"/profile/" + record.creator.username}>
                            {record.creator.initials}
                        </Link>
                    </Grid>
                </Grid>
                    <Grid className={clsx(classes.ggrid, classes.textStyle)}>
                        <Typography variant={"subtitle3"}>
                            {
                                (((new Date(creationTime).getHours() < 10 && "0" + new Date(creationTime).getHours())
                                        || (new Date(creationTime).getHours() >= 10 && new Date(creationTime).getHours())) + ":"
                                    + ((new Date(creationTime).getMinutes() < 10 && "0" + new Date(creationTime).getMinutes())
                                        || (new Date(creationTime).getMinutes() >= 10 && new Date(creationTime).getMinutes())
                                    )) + "    " + (
                                    ((new Date(creationTime).getDate() < 10 && "0" + new Date(creationTime).getDate()) ||
                                        (new Date(creationTime).getDate() >= 10 && new Date(creationTime).getDate()))
                                    + "."
                                    + (((new Date(creationTime).getMonth() + 1) < 10 && "0" +
                                        (new Date(creationTime).getMonth() + 1)) || (((new Date(creationTime).getMonth() + 1) >= 10 && (new Date(creationTime).getMonth() + 1))))
                                    + "." + new Date(creationTime).getFullYear()
                                )}
                        </Typography>

                        {(record.creator.username === AuthService.getCurrentUser().username || AuthService.getCurrentUser().username === "admin") &&
                        <DeleteIcon onClick={() => setModalShow(true)} className={classes.deleteIcon}
                        />}
                        <DeleteModal/>
                    </Grid>
                <Grid className={clsx(classes.ggrid, classes.textStyle)}>
                    {record.postType}
                </Grid>
                <Grid className={classes.grid}>
                    {isPreview ? (
                        <Typography variant="h6" title={record.title} className={clsx(classes.content, classes.textStyle)}>{/*gutterBottom*/}
                            <Link style={{color: "black"}}   to={"/records/thread/" + record.id}>
                                {record.title}
                            </Link>
                        </Typography>
                    ) : (
                        <Typography variant="h6" className={clsx(classes.content, classes.textStyle)}>
                            {record.title}
                        </Typography>)
                    }
                </Grid>
                <Grid className={classes.gridContent}>
                    <Typography variant="body1" className={clsx(classes.content, classes.textStyle)}>{/*gutterBottom*/}
                        {getContent(record.content)}
                    </Typography>
                </Grid>
                <Grid className={classes.grid} container direction={"row"} spacing={1}>
                    {record.topics && record.topics.map(el => (
                        <Grid item key={el.id} color={"#616161"}>
                            <Typography className={clsx(classes.tagsColor, classes.textStyle)}>
                                {el.name}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                {getDoctorSearchData()}
                <br/>
                {/*<div id={containerId} />*/}
                {!isPreview && filePreviews.length > 0 &&
                <Grid container justifyContent="center" style={{gap: 10}}>
                    {filePreviews.map((el, index) => (
                        <Grid item >
                            {
                                record.attachments[index].uid ?
                                    <Tooltip title="Открыть в DICOM Viewer">
                                        <img onClick={() => openDicomViewer(record.attachments[index].uid)}
                                             className={classes.imageStyle} key={el.id} alt="" src={el.image}
                                             style={{cursor: 'pointer'}}
                                        >
                                        </img>
                                    </Tooltip>
                                    :
                                    <img
                                       className={classes.imageStyle} key={el.id} alt="" src={el.image}
                                    >
                                    </img>
                            }
                        </Grid>
                    ))}
                </Grid>
                }
                {!isPreview && record.attachments.map(el => (
                    // <img key={el.id} alt="" className="col-sm-6 top-buffer-10" src={el.image} />
                    <Grid container direction="column" alignItems="flex-start" key={el.id} >
                        {/*<div className="col-sm-5">{el.initialName}</div>*/}
                            <button
                                style={{ borderStyle: "none", marginTop: "8px"}}
                                className="btn-sm btn-primary color-white"
                                onClick={() => download(el.id, el.initialName)}>
                                <i className="fa fa-download"> Скачать {el.initialName}</i>
                            </button>
                    </Grid>
                ))}
                {isPreview &&
                    <span>
                        <span className={classes.spanStyleBold}>
                            {'Комментариев: '}
                        </span>
                        <span className={classes.spanStyle}>
                            {record.numberOfReplies}
                        </span>
                        <br/>
                        <span className={classes.spanStyleBold}>
                            <Link style={{color: "black"}} to={"/records/thread/" + record.id}>
                                {'Перейти к обсуждению:'} <span className="fa fa-comments"></span>
                            </Link>
                        </span>
                    </span>
                }
                {(currentUser.roles[0] === "Врач") && (record.creator.id !== currentUser.id) &&
                    <Link to={"/msg/" + record.creator.username} style={{textDecoration: 'none'}}>
                        <Button className={classes.button} title={"Страница тэгов"}>
                            Откликнуться
                        </Button>
                    </Link>
                }
            </Grid>
        </Paper>
    );
}

export default withStyles(useStyles)(RecordCardNew)