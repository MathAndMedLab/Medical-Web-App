import React, {Component} from "react";
import AuthService from "../../services/auth.service";
import AttachmentService from "../../services/attachment.service";
import DicomAnonymizerService from "../../services/dicom-anonymizer.service"
import Button from "@material-ui/core/Button";
import {Card, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {Link} from "react-router-dom";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ViewListIcon from '@material-ui/icons/ViewList';
import FolderIcon from '@mui/icons-material/Folder';
import ButtonDrawer from "../ButtonDrawer";
import {Hidden} from "@material-ui/core";
import clsx from "clsx";
import Modal from 'react-bootstrap/Modal';

const useStyles = theme => ({
    listIcon: {
        marginTop: theme.spacing(3),
    },
    paper: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(1),
        color: "black",
    },
    paper2: {
        margin: theme.spacing(3),
        padding: theme.spacing(3),
        color: "black",
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
    avatar: {
        width: 130,
        height: 130,
        marginBottom: theme.spacing(3),
        marginRight: theme.spacing(4),
        marginLeft: theme.spacing(4),
    },
    button: {
        width: 200,
        margin: theme.spacing(1),
        backgroundColor: '#f50057',
        color: '#fff',
        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
    },
    buttonUpload: {
        marginTop: theme.spacing(5),
        backgroundColor: '#f50057',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        },
        '&:disabled': {
            backgroundColor: '#819ca9',
        },
    },
    infoTab: {
    },
    grid: {
        textAlign: "center",
        marginTop: theme.spacing(1),
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    },
    gridData: {
        marginLeft: theme.spacing(8),
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    },
    gridInPaper: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        padding: theme.spacing(1),
        color: "black",
        display: 'flex',
    },
    paperGrey: {
        margin: theme.spacing(3, 5, 3, 5),
        padding: theme.spacing(2),
        height: "40vh",
        borderRadius: 20,
        backgroundColor: "#eeeeee",
    },
    gridContent: {
        height: "100%",
        textAlign: "center",
        display: 'flex',
        fontSize: '18px',
        
        flexDirection: 'column',
        borderRadius: 20,
        border: "dashed gray 3px",
        alignItems: 'center',
        justifyContent: 'center',
    },
    gridInput: {
        padding: theme.spacing(2, 5, 2, 5),
        borderRadius: 15,
        cursor: 'pointer',
        backgroundColor: '#f50057',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        },
    },
    dropZone: {
        height: '100%',
        width: '100%',
    },
    fileCell: {
        textAlign: "center", 
        display: 'inline-block',
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
      
        "@media (min-width: 0px)": {
            maxWidth: "50px"
        },
        "@media (min-width: 315px)": {
            maxWidth: "100px"
        },
        "@media (min-width: 360px)": {
            maxWidth: "135px"
        },
        "@media (min-width: 410px)": {
            maxWidth: "175px"
        },
        "@media (min-width: 450px)": {
            maxWidth: "225px"
        },
        "@media (min-width: 530px)": {
            maxWidth: "275px"
        },
        "@media (min-width: 600px)": {
            maxWidth: "125px"
        },
        "@media (min-width: 960px)": {
            maxWidth: "200px"
        },
       
        "@media (min-width: 1280px)": {
            maxWidth: "275px"
        },
    },
    alertMessage: {
        [theme.breakpoints.down("xs")]: {
            width: '150px',
        },
        [theme.breakpoints.only("sm")]:{
            width: '300px',
        },
        [theme.breakpoints.only("md")]:{
            width: '425px',
        },
        "@media (min-width: 1280px)" :{
            width: '475px',
        },
        display: 'inline-block', 
        wordWrap: 'break-word',
    },
    buttonModal: {
        backgroundColor: '#f50057',
        marginRight: "auto",
        marginLeft: "auto",
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        },
        '&:disabled': {
            backgroundColor: '#819ca9',
        },
    },
})

class UploadAttachmentsComponent extends Component {
    constructor(props) {
        super(props);

        this.selectFiles = this.selectFiles.bind(this);
        this.handleFiles = this.handleFiles.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.upload = this.upload.bind(this);
        this.dragEnterHandler = this.dragEnterHandler.bind(this);
        this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.deleteElement = this.deleteElement.bind(this);
        this.fileInput = React.createRef();

        const user = AuthService.getCurrentUser();
        const links = ["/profile/" + user.username, "/files/view"];
        const icons = [<AccountBoxIcon style={{ color: '#f50057' }}/>, <FolderIcon style={{ color: '#f50057' }}/>]
        const titles = ['Профиль', 'Мои файлы']
        const positions = ['right']
        const icon = <ViewListIcon style={{ color: '#f50057' }} fontSize={"large"}/>

        this.state = {
            currentUser: user,
            selectedFiles: undefined,
            progressInfos: [],
            message: [],
            fileInfos: [],
            dragEnter: false,
            links: links,
            icons: icons,
            titles: titles,
            positions: positions,
            icon: icon,
            open: false
        };
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    
    deleteElement(index) {
        let files = [...this.state.selectedFiles];
        files.splice(index, 1);
        if (files.length === 0) files = undefined
        this.setState({
            selectedFiles: files,
        });
    }

    selectFiles() {
        this.fileInput.current.click();
    }

    handleFiles(e) {
        let selectedFiles = []
        let files = [...e.target.files]
        let errorMessage = []
        if (this.state.selectedFiles !== undefined) selectedFiles = [...this.state.selectedFiles]
        files.map(file => {
            selectedFiles.push(file)
        })
        if (selectedFiles.length === 0) {
            selectedFiles = undefined;
            errorMessage = ["Произошла ошибка, попробуйте выбрать файлы снова"]
        } 
        this.setState({
            progressInfos: [],
            selectedFiles: selectedFiles,
            message: errorMessage,
        });
    }

    dropHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        let selectedFiles = []
        let files = [...e.dataTransfer.files]
        let errorMessage = []
        if (this.state.selectedFiles !== undefined) selectedFiles = [...this.state.selectedFiles]
        files.map(file => {
            selectedFiles.push(file)
        })
        if (selectedFiles.length === 0) {
            selectedFiles = undefined
            errorMessage = ["Произошла ошибка, попробуйте перетащить файлы снова"]
        } 
        this.setState({
            progressInfos: [],
            selectedFiles: selectedFiles,
            message: errorMessage,
            dragEnter: false,
        });
    }

    dragEnterHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            dragEnter: true,
        });
    }

    dragLeaveHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            dragEnter: false,
        });

    }

    uploadFiles() {
        const selectedFiles = this.state.selectedFiles;

        let _progressInfos = [];

        for (let i = 0; i < selectedFiles.length; i++) {
            _progressInfos.push({percentage: 0, fileName: selectedFiles[i].name});
        }

        this.setState(
            {
                progressInfos: _progressInfos,
                message: [],
            },
            () => {
                for (let i = 0; i < selectedFiles.length; i++) {
                    this.upload(i, selectedFiles[i]);
                }
            }
        );
    }

    drawListFiles(classes, selectedFiles) {
        return <TableContainer component={Paper}>
                    <Table sx={{ width: '100%' }} aria-label="spanning table">
                        <TableHead>
                            <TableRow>
                            <TableCell>№</TableCell>
                            <TableCell align="left" >Наименование файла</TableCell>
                            <TableCell align="center">Отмена</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {[...selectedFiles].map((file, i) =>
                            <TableRow key={i}>
                                <TableCell>{i+1}</TableCell>
                                <TableCell align="left"> <span className={classes.fileCell}>{file.name}</span></TableCell>
                                <TableCell align="center">
                                    <span as="button" 
                                        key={file.id} 
                                        style={{cursor: "pointer", '&:hover': {color: "#fff",},}} 
                                        onClick={() => this.deleteElement(i)}>
                                            <HighlightOffIcon/>
                                        </span>
                                    </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
    }

    async upload(idx, file) {
        let _progressInfos = [...this.state.progressInfos];
        let _currentUser = this.state.currentUser;

        let isDicom = file.name.includes(".dcm");
        if (isDicom) {
            try {
                var dicomContAndUID = await DicomAnonymizerService.anonymizeInstance(file);
                var anonymizedDicomBlob = dicomContAndUID.dicom;
                var UID = dicomContAndUID.UID;
            } catch (error) {
                console.log(error)
                _progressInfos[idx].percentage = 0;
                this.setState((prev) => {
                    let nextMessage = [...prev.message, "Не удалось загрузить файл: " + file.name + ". \n Отсутствует Transfer Syntax tag (0002, 0010)"];
                    return {
                        progressInfos: _progressInfos,
                        message: nextMessage
                    };
                });
                return;
            }
        }

        let toSend = isDicom ? anonymizedDicomBlob : file;

        AttachmentService.uploadAttachment(toSend, file.name, isDicom, UID,
            (event) => {
                _progressInfos[idx].percentage = Math.round((100 * event.loaded) / event.total);
                this.setState({
                    _progressInfos,
                });
            })
            .then(() => {
                this.setState((prev) => {
                    let nextMessage = [...prev.message, "Успешно загружен файл: " + file.name];
                    return {message: nextMessage};
                });
                return AttachmentService.getAttachmentsInfoForUser(_currentUser.username);
            })
            .then((files) => {
                this.setState({fileInfos: files.data,});
            })
            .catch(() => {
                _progressInfos[idx].percentage = 0;
                this.setState((prev) => {
                    let message
                    if (file.size > 0) message = "Не удалось загрузить файл: " + file.name + ". Превышен максимальный размер 5 МБ"
                    else message = "Не удалось загрузить файл: " + file.name;
                    let nextMessage = [...prev.message, message];
                    return {
                        progressInfos: _progressInfos,
                        message: nextMessage
                    };
                });
            });
    }

    render() {
        const {selectedFiles, progressInfos, message, dragEnter} = this.state;
        const {classes} = this.props;
        const msgText = message.join(' ')
        
        return (
                <Grid container  className={classes.mainGrid} justifyContent="center">
                    <Grid item xs={9} md={8} lg={6}>
                        <Card className={classes.paper}>
                            <Grid className={classes.grid}>
                                <h3><strong>Загрузка файлов</strong></h3>
                            </Grid>

                            {progressInfos &&
                            progressInfos.map((progressInfo, index) => (
                                <div className="mb-2 center-horizontal" style={{textAlign: "center"}} key={index}>
                                    <span  style={{textAlign: "center", display: 'inline-block',  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',}}>{progressInfo.fileName}</span>
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-bar-info color-orange"
                                            role="progressbar"
                                            aria-valuenow={progressInfo.percentage}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            style={{width: progressInfo.percentage + "%"}}
                                        >
                                            {progressInfo.percentage}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Hidden mdUp>
                                <Grid className={classes.gridInput} style={{width: "30px", marginLeft: "auto", marginRight: "auto",}} justifyContent="center" alignContent="center" as="button" variant="contained" onClick={this.selectFiles}>
                                    <AttachFileIcon />
                                    <input type="file" 
                                        style={{ display: "none" }} 
                                        ref={this.fileInput} 
                                        multiple onChange={(e) => this.handleFiles(e)}/>
                                </Grid>
                            </Hidden>
                            <Hidden smDown>
                                <Card className={classes.paperGrey}>
                                    <div className={classes.dropZone} 
                                        onDragEnter={this.dragEnterHandler} 
                                        onDragLeave={this.dragLeaveHandler} 
                                        onDragOver={this.dragEnterHandler} 
                                        onDrop={(e) => this.dropHandler(e)}>
                                        <Grid className={classes.gridContent}>
                                            { !dragEnter ? (
                                                <Grid>
                                                    <p><strong>Перетащите сюда</strong> файлы или нажмите на кнопку ниже</p>
                                                </Grid>
                                            ) : (
                                                <Grid>
                                                    <p><strong>Отпустите файлы</strong></p>
                                                </Grid>
                                            )}

                                            <Grid className={classes.gridInput} as="button" variant="contained" onClick={this.selectFiles}>
                                                <AttachFileIcon />
                                                <input type="file" 
                                                    style={{ display: "none" }} 
                                                    ref={this.fileInput} 
                                                    multiple onChange={(e) => this.handleFiles(e)}/>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Card>
                            </Hidden>
                            
                            <Grid container direction="column">
                                <Grid container item className={classes.infoTab} direction="column">
                                    <Grid item className={classes.grid}>
                                        <h3>Загружаемые файлы: </h3>
                                    </Grid>
                                    {selectedFiles ? (
                                        <>
                                            <Hidden xsDown>
                                                {this.drawListFiles(classes, selectedFiles)}
                                            </Hidden>
                                            <Hidden smUp>
                                                <Button
                                                variant="contained"
                                                onClick={this.handleOpen}
                                                className={classes.buttonModal}
                                                >
                                                    Список файлов
                                                </Button>
                                                <Modal show={this.state.open} closeAfterTransition centered='true' aria-labelledby="contained-modal-title-vcenter">
                                                    <Modal.Header>
                                                        <Modal.Title id="contained-modal-title-vcenter">
                                                            Текущий список файлов
                                                        </Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        {this.drawListFiles(classes, selectedFiles)}
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button onClick={this.handleClose}>
                                                            Назад
                                                        </Button>
                                                    </Modal.Footer>

                                                </Modal>
                                            </Hidden>
                                       </>
                                    ) : (
                                        <span style={{marginRight: "auto", marginLeft: "auto",}}>Нет выбранных файлов</span>
                                    )}
                                </Grid>
                                    <Button
                                        className={classes.buttonUpload}
                                        variant="contained"
                                        disabled={!selectedFiles}
                                        onClick={this.uploadFiles}
                                        fullWidth
                                    >
                                        Загрузить
                                    </Button>
                            </Grid>

                            {message.length > 0 && (
                                <Grid container direction="column" alignItems="center" className={"alert alert-success"} style={{display: "flex", justifyContent: "center"}} role="alert" >
                                    {message.map((item, i) => {
                                                    return <span className={classes.alertMessage } key={i}>{item}</span>;
                                    })}
                                </Grid>
                            )}
                        </Card>
                    </Grid>
                    <Grid item>
                        <Hidden lgUp >
                            <div className={classes.listIcon}>
                                <ButtonDrawer links={this.state.links} icons={this.state.icons} titles={this.state.titles} positions={this.state.positions} icon={this.state.icon}/>
                            </div>
                        </Hidden>
                        <Hidden mdDown >
                            <Card className={classes.paper2}>
                                <Grid className={classes.grid}>
                                    <Link to={"/profile/" + AuthService.getCurrentUser().username} style={{textDecoration: 'none'}}>
                                        <Button className={classes.button}>
                                            Профиль
                                        </Button>
                                    </Link>
                                    <Link to={"/files/view"} style={{textDecoration: 'none'}}>
                                        <Button className={classes.button}>
                                            Мои файлы
                                        </Button>
                                    </Link>
                                </Grid>
                            </Card>
                        </Hidden>
                        
                    </Grid>
                </Grid>
        );
    }
}

export default withStyles(useStyles)(UploadAttachmentsComponent)