import React, {useEffect, useState} from "react";
import AuthService from "../../services/auth.service";
import AttachmentService from "../../services/attachment.service";
import Button from "@material-ui/core/Button";
import {Divider, Grid, Hidden, Paper, Typography, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import Modal from 'react-bootstrap/Modal';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ButtonDrawer from "../ButtonDrawer";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ViewListIcon from '@material-ui/icons/ViewList';
import {IconButton} from "@material-ui/core"

const useStyles = theme => ({
    listIcon: {
        marginTop: theme.spacing(3),
    },
    button: {
        width: 200,
        margin: theme.spacing(1),
        backgroundColor: '#f50057',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
    },
    paper: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(1),
        textAlign: "center",
        // display: 'flex',
    },
    paper2: {
        margin: theme.spacing(3),
        padding: theme.spacing(3),
    },
    mainGrid: {
        display: 'flex',
        [theme.breakpoints.only("xs")]: {
            gap: 10
        },
        [theme.breakpoints.only("sm")]: {
            gap: 10
        },
        [theme.breakpoints.only("md")]: {
            gap: 3
        },
       
        "@media (min-width: 1280px)": {
            gap: 50
        },
    },
    grid: {
        margin: theme.spacing(1),
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    },
    grid2: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        display: 'flex',
        gap: 10
    },
    grid3: {
        [theme.breakpoints.only("xs")]: {
            gap: 10
        },
        [theme.breakpoints.only("sm")]: {
            gap: 50
        },
        [theme.breakpoints.only("md")]: {
            gap: 75
        },
       
        "@media (min-width: 1280px)": {
            gap: 100
        },
    },
  
    title: {
        padding: theme.spacing(3),
        textAlign: "center",
        color: "black", 
        [theme.breakpoints.down("xs")]: {
            width: '200px',
            fontSize: theme.spacing(2.75)
        },
        [theme.breakpoints.only("sm")]:{
            width: '370px',
            fontSize: theme.spacing(4)
        },
        [theme.breakpoints.up("md")]:{
            width: '450px',
            fontSize: theme.spacing(5)
        },
      
        display: 'inline-block', 
        wordWrap: 'break-word',
       
    },
    download: {
        backgroundColor: '#f50057',
    },
    textField: {
        "& .MuiFormLabel-root": {
            margin: 0,
        }
    }
})

function ViewAttachmentsComponent(props) {
    const {classes} = props
    const user = AuthService.getCurrentUser();
    const [currentUser, setCurrentUser] = useState(user)
    const [userFilesInfo, setUserFilesInfo] = useState([])
    const links = ["/profile/" + AuthService.getCurrentUser().username, "/files/upload"];
    const icons = [<AccountBoxIcon style={{ color: '#f50057' }}/>, <FileDownloadIcon style={{ color: '#f50057' }}/>]

    const titles = ['Профиль', 'Загрузить файл']
    const positions = ['right']
    const icon = <ViewListIcon style={{ color: '#f50057' }} fontSize={"large"}/>



    useEffect(() => {
        AttachmentService.getAttachmentsForUser(currentUser.username).then((response) => {
            setUserFilesInfo(response.data)
        })
    }, [])

    const renameFile = (id, onHide, inputField) => {
        AttachmentService.renameAttachment(id, inputField).then(() => {
            onHide()
            AttachmentService.getAttachmentsForUser(currentUser.username).then((response) => {
                setUserFilesInfo(response.data)
            })
        })
    }

    const deleteFile = async (id, onHide) => {
        AttachmentService.deleteAttachment(id).then(() => {
            onHide()
            AttachmentService.getAttachmentsForUser(currentUser.username).then((response) => {
                setUserFilesInfo(response.data)
            })
        })
    }

    function EditModal(props) {
        const [inputField, setInputFields] = React.useState('');
        return (
            <Modal {...props} centered='true' dialogClassName="modal-90w"
                   aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter" style={{ display: 'inline-block',  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                            Переименовать {props.name}{props.currentFileType}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="show-grid">
                    <Grid>
                        <TextField
                            required
                            size="full"
                            margin="normal"
                            name="Новое имя"
                            fullWidth='true'
                            label="Новое имя"
                            variant="outlined"
                            defaultValue={props.name}
                            val
                            className={classes.textField}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">{props.currentFileType}</InputAdornment>,
                            }}
                            onChange={(changedText) => setInputFields(changedText.target.value + props.currentFileType)}/>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Отмена</Button>
                    <Button onClick={() => renameFile(props.id, props.onHide, inputField)}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    function Edit(props) {


        const [modalShow, setModalShow] = React.useState(false);


        return (
            <>
                <IconButton style={{color : "#000"}} onClick={() => setModalShow(true)} title="Редактировать">
                    <EditIcon fontSize="medium"/>
                </IconButton>

                <EditModal currentFileType={props.currentFileType} id={props.id} name={props.name} show={modalShow}
                           onHide={() => setModalShow(false)}/>
            </>
        );
    }

    function DeleteModal(props) {
        return (
            <Modal {...props} centered='true' aria-labelledby="contained-modal-title-vcenter">

                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Подтвердить удаление
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="alert alert-danger">Вы дейтвительно хотите удалить файл {props.name}?</div>
                </Modal.Body>
                <Modal.Footer>

                    <Button onClick={props.onHide}>
                        Отмена
                    </Button>
                    <Button onClick={() => deleteFile(props.id, props.onHide)}>
                        Удалить
                    </Button>
                </Modal.Footer>

            </Modal>
        );
    }

    function Delete(props) {

        const [modalShow, setModalShow] = React.useState(false);

        return (
            <>
                <IconButton style={{color : "#000"}} title="Удалить" onClick={() => setModalShow(true)}>
                    <DeleteIcon fontSize="medium"/>
                </IconButton>

                <DeleteModal id={props.id} name={props.name} show={modalShow} onHide={() => setModalShow(false)}/>
            </>
        );
    }

    function download(fileId, initialFileName) {
        AttachmentService.downloadAttachment(fileId, initialFileName);
    }

    function getName(name) {
        if (name.length > 20) {
            return name.substring(0, 20) + '...';
        }
        return name;
    }

    function getOnlyName(name) {
        return name.replace(/\.[^/.]+$/, "");
    }

    function getOnlyType(name) {
        var re = /(?:\.([^.]+))?$/;
        return re.exec(name)[0];
    }
    

    return (
        <Grid container className={classes.mainGrid} justifyContent="center" >
            <Grid item xs={9} md={8} lg={6}>
                <Paper className={classes.paper}>
                    <span className={classes.title} >
                        Загруженные файлы
                    </span>
                    {userFilesInfo.length != 0 ? <Divider/> : <> </>}

                    {userFilesInfo.map((el, index) => (
                        <>
                            <Grid direction="column" container key={el.id} className={classes.grid2} justifyContent="center">
                                <Grid container item xs={12} justifyContent="center" className={classes.grid3}>
                                    <Typography variant={"subtitle1"}>
                                        {getName(el.initialName)}
                                    </Typography>
                                    <Typography variant={"subtitle1"}>
                                        {new Date(el.creationTime).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid container item xs={12} justifyContent="center" className={classes.grid3}>
                                    <Button
                                        variant="contained"
                                        onClick={() => download(el.id, el.initialName)}
                                        color="primary"
                                        className={classes.download}
                                    >
                                        Скачать
                                    </Button>
                                    <Edit id={el.id} name={getOnlyName(el.initialName)}
                                        currentFileType={getOnlyType(el.initialName)} classes={classes}/>
                                    <Delete id={el.id} name={getName(el.initialName)}/>
                                </Grid>
                            </Grid>
                            {index + 1 != userFilesInfo.length ? <Divider/> : <> </>}
                        </>
                        
                    ))}
                </Paper>
            </Grid>
            <Grid item>
                <Hidden lgUp >
                    <div className={classes.listIcon}>
                        <ButtonDrawer links={links} icons={icons} titles={titles} positions={positions} icon={icon}/>
                    </div>
                </Hidden>
                <Hidden mdDown>
                    <Paper className={classes.paper2}>
                        <Grid className={classes.grid}>

                            <Link to={"/profile/" + AuthService.getCurrentUser().username}
                                style={{textDecoration: 'none'}}>
                                <Button className={classes.button}>
                                    Профиль
                                </Button>
                            </Link>
                            <Link to={"/files/upload"} style={{textDecoration: 'none'}}>
                                <Button className={classes.button}>
                                    Загрузить файл
                                </Button>
                            </Link>
                        </Grid>
                    </Paper>
                </Hidden>
            </Grid>
                
        </Grid>

    );
}

export default withStyles(useStyles)(ViewAttachmentsComponent)