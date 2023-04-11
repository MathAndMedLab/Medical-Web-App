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

const useStyles = theme => ({
    paper: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
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
        minWidth: 1000,
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
        width: 100,
        backgroundColor: '#f50057',
        margin: theme.spacing(2, 3, 3, 5),
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
        margin: theme.spacing(0, 5, 0, 5),
    },
    grid: {
        margin: theme.spacing(1),
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

        this.state = {
            currentUser: user,
            selectedFiles: undefined,
            progressInfos: [],
            message: [],
            fileInfos: [],
            dragEnter: false,
        };
    }

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
        return (

            <div>
                <Grid>
                    <Grid itemxs={12}  className={classes.mainGrid}>
                        <Grid  item xs={8} >
                            <Card className={classes.paper}>
                                <Grid className={classes.grid}>
                                    <h3><strong>Загрузка файлов</strong></h3>
                                </Grid>

                                {progressInfos &&
                                progressInfos.map((progressInfo, index) => (
                                    <div className="mb-2 center-horizontal width-600" key={index}>
                                        <span>{progressInfo.fileName}</span>
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
                                <Grid>
                                    <Grid className={classes.infoTab}>
                                        <h3>Загружаемые файлы: </h3>
                                        {selectedFiles ? (
                                            <TableContainer component={Paper}>
                                                <Table sx={{ width: '100%' }} aria-label="spanning table">
                                                <TableHead>
                                                    <TableRow>
                                                    <TableCell>№</TableCell>
                                                    <TableCell align="left">Наименование файла</TableCell>
                                                    <TableCell align="center">Отмена</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {[...selectedFiles].map((file, i) =>
                                                    <TableRow key={i}>
                                                        <TableCell>{i+1}</TableCell>
                                                        <TableCell align="left">{file.name}</TableCell>
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
                                        ) : (
                                            <span>Нет выбранных файлов</span>
                                        )}
                                    </Grid>
                                    <Grid>
                                        <Button
                                            className={classes.buttonUpload}
                                            variant="contained"
                                            disabled={!selectedFiles}
                                            onClick={this.uploadFiles}
                                        >
                                            Загрузить
                                        </Button>
                                    </Grid>
                                </Grid>

                                {message.length > 0 && (
                                    <div className="alert alert-success" role="alert">
                                        <ul>
                                            {message.map((item, i) => {
                                                return <li key={i}>{item}</li>;
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </Card>
                        </Grid>
                        <Grid xs={4} item>
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
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(useStyles)(UploadAttachmentsComponent)