import React, {useEffect, useState} from "react";
import AuthService from "../../services/auth.service";
import AttachmentService from "../../services/attachment.service";
import Button from "@material-ui/core/Button";
import {Divider, Grid, Paper, Typography, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import Modal from 'react-bootstrap/Modal';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const useStyles = theme => ({
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
        // display: 'flex',
    },
    paper2: {
        margin: theme.spacing(3),
        padding: theme.spacing(3),
    },
    mainGrid: {
        display: 'flex',
        minWidth: 1000,
    },
    grid: {
        margin: theme.spacing(1),
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    },
    grid2: {
        margin: theme.spacing(1),
        alignItems: 'center',
        flexDirection: 'row',
        display: 'flex',
    },
    title: {
        padding: theme.spacing(3),
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
                    <Modal.Title id="contained-modal-title-vcenter">
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
                <Button onClick={() => setModalShow(true)} title="Редактировать">
                    <EditIcon fontSize="medium"/>
                </Button>

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
                <Button title="Удалить" onClick={() => setModalShow(true)}>
                    <DeleteIcon fontSize="medium"/>
                </Button>

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
        <Grid className={classes.mainGrid}>
            <Grid container spacing={3}>
                <Grid item xs/>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <Typography component="h1" className={classes.title} variant="h4">
                            Загруженные файлы
                        </Typography>
                        <Divider/>

                        {userFilesInfo.map(el => (
                            <Grid key={el.id} className={classes.grid2}>
                                <Grid item xs={5}>
                                    <Typography variant={"subtitle1"}>
                                        {getName(el.initialName)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant={"subtitle1"}>
                                        {new Date(el.creationTime).toLocaleDateString()}
                                    </Typography>
                                </Grid>
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
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={4}>
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
                </Grid>
            </Grid>
        </Grid>

    );
}

export default withStyles(useStyles)(ViewAttachmentsComponent)