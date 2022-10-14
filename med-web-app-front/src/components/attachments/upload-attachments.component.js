import React, {Component} from "react";
import AuthService from "../../services/auth.service";
import AttachmentService from "../../services/attachment.service";
import DicomAnonymizerService from "../../services/dicom-anonymizer.service"
import Button from "@material-ui/core/Button";
import {Card, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";

const useStyles = theme => ({
    paper: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
        padding: theme.spacing(1),
        color: "black",
        // display: 'flex',
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
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
    },
    buttonUpload: {
        width: 100,
        backgroundColor: '#f50057',
        marginLeft: theme.spacing(3),
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        },
        '&:disabled': {
            backgroundColor: '#819ca9',
        },
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
        borderRadius: 20,
        backgroundColor: "#eeeeee"
    },
    gridContent: {
        margin: theme.spacing(2),
        display: 'flex'
    },
    gridInput: {
        marginRight: theme.spacing(25),
    },
})

class UploadAttachmentsComponent extends Component {
    constructor(props) {
        super(props);

        this.selectFiles = this.selectFiles.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.upload = this.upload.bind(this);

        const user = AuthService.getCurrentUser();

        this.state = {
            currentUser: user,
            selectedFiles: undefined,
            progressInfos: [],
            message: [],

            fileInfos: [],
        };
    }

    selectFiles(event) {
        this.setState({
            progressInfos: [],
            selectedFiles: event.target.files,
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
                    let message: String;
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
        const {selectedFiles, progressInfos, message} = this.state;
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
                                    <Grid className={classes.gridContent}>
                                        <Grid className={classes.gridInput}>
                                            <label>
                                                <input type="file" multiple onChange={this.selectFiles}/>
                                            </label>
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


                                </Card>
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