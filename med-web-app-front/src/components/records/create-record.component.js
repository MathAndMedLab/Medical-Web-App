import React, {Component} from 'react'
import RecordService from "../../services/record.service"
import AttachmentService from "../../services/attachment.service"
import AuthService from "../../services/auth.service"
import TopicService from "../../services/topic.service"
import DicomAnonymizerService from "../../services/dicom-anonymizer.service"
import {Card, withStyles} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Input from '@material-ui/core/Input'
import Container from '@material-ui/core/Container'
import Chip from '@material-ui/core/Chip'
import FormControl from "@material-ui/core/FormControl"
import InputLabel from '@material-ui/core/InputLabel'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import AttachFileIcon from "@mui/icons-material/AttachFile"
import Modal from 'react-bootstrap/Modal'

/**
 * Стили для компонентов mui и react.
 */

const useStyles = theme => ({
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
        },
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: 0,
        backgroundColor: '#3f51b5',
    },
    uploadMenuButton: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(2, 0, 2, 0),
        width: '100%',
        backgroundColor: '#3f51b5',
        color: '#fff',
        borderRadius: '5px',
        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
    },
    root: {
        "& .MuiFormLabel-root": {
            margin: 0
        }
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    formControl: {
        "& .MuiFormLabel-root": {
            margin: 0
        },
        width: '100%',
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    buttonUpload: {
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
        margin: theme.spacing(3, 0, 3, 0),
        padding: theme.spacing(1),
        height: "30vh",
        borderRadius: 20,
        backgroundColor: "#eeeeee",
    },
    gridContent: {
        height: "100%",
        display: 'flex',
        fontSize: '14px',
        flexDirection: 'column',
        borderRadius: 20,
        border: "dashed gray 2px",
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
    uploadGrid: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderRadius: "15px",
        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
    },
})

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

class CreateRecordComponent extends Component {
    constructor(props) {
        super(props);

        this.selectFiles = this.selectFiles.bind(this);
        this.handleFiles = this.handleFiles.bind(this);
        this.handleSubmitRecord = this.handleSubmitRecord.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);
        this.handleTopics = this.handleTopics.bind(this);
        this.fileHandler = this.fileHandler.bind(this);
        this.onClickUpload = this.onClickUpload.bind(this);
        this.dragEnterHandler = this.dragEnterHandler.bind(this);
        this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.delFilesDevice = this.delFilesDevice.bind(this);
        this.delFilesProfile = this.delFilesProfile.bind(this);
        this.fileInput = React.createRef();
        this.handleCloseModalDevice = this.handleCloseModalDevice.bind(this);
        this.handleCloseModalProfile = this.handleCloseModalProfile.bind(this);

        this.state = {
            content: "",
            title: "",
            contentPresence: false,
            contentCorrect: "",
            availableFiles: [],
            selectedFilesId: null,
            selectedFilesValue: [],
            availableTopics: [],
            selectedTopicsID: null,
            selectedTopicsValue: [],
            submittedSuccessfully: false,
            message: null,
            selectedFilesUpload: undefined,
            modalShowUploadDevice: false,
            modalShowUploadProfile: false,
            uploadMenuState: true,
            dragEnter: false,
        };
    }

    /**
     * Удаление прикрепленных файлов к посту
     * @param index 
     */
    delFilesDevice(index) {
        let files = [...this.state.selectedFilesUpload]
        files.splice(index, 1)
        if(files.length === 0) files = undefined
        this.setState({
            selectedFilesUpload: files,
        })
    }

    delFilesProfile(index) {
        let filesIds = [...this.state.selectedFilesId]
        let filesValue = [...this.state.selectedFilesValue]
        filesIds.splice(index, 1)
        filesValue.splice(index, 1)
        if(filesIds.length === 0 && filesValue.lnegth === 0) {
            filesIds = null
            filesValue = []
        }
        this.setState({
            selectedFilesId: filesIds,
            selectedFilesValue: filesValue,
        })
    }

    /**
     * 
     */
    selectFiles() {
        this.fileInput.current.click()
    }

    fileHandler(e) {
        let filesValue = []
        let files = [...e.target.files]
        files.map(file => {
            if(this.state.selectedFilesUpload !== undefined){
                filesValue = this.state.selectedFilesUpload
            } 
            filesValue.push(file)
        });
        this.setState({
            selectedFilesUpload: filesValue,
        })
    }

    dropHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        let filesValue = []
        let files = [...e.dataTransfer.files]
        let errorMessage = null
        if(files.length === 0) {
            files = undefined
            errorMessage = ["Произошла ошибка попробуйте перетащить файлы снова"]
        }
        files.map(file => {
            if(this.state.selectedFilesUpload !== undefined){
                filesValue = this.state.selectedFilesUpload
            } 
            filesValue.push(file)
        })
        this.setState({
            selectedFilesUpload: filesValue,
            dragEnter: false,
        })
    }

    /**
     * Обработчики состояний для перетаскивания файлов в поле загрузки
     * @param e 
     */
    dragEnterHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
            dragEnter: true,
        })
    }

    dragLeaveHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        this.setState({
            dragEnter: false,
        })
    }

    /**
     * Метод отвечает за открытие модальных окон 
     */
    handleOpen() {
        this.setState({
            modalShow: true,
        })
    }

    /**
     * Методы отвечают за закрытие модальных окон 
     */
    handleCloseModalDevice() {
        this.setState({
            selectedFilesUpload: undefined,
            modalShowUploadDevice: false,
        })
    }

    handleCloseModalProfile() {
        this.setState({
            selectedFilesId: null,
            selectedFilesValue: [],
            modalShowUploadProfile: false,
        })
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeContent(e) {
        let str = e.target.value
        str = str.replace(/ {2,}/g, ' ').trim();
        str = str.replace(/[\n\r ]{3,}/g, '\n\r\n\r');
        if (str.charCodeAt(0) > 32) {
            this.setState({
                content: e.target.value,
                contentCorrect: str,
                contentPresence: true
            });
        } else {
            this.setState({
                content: e.target.value,
                contentCorrect: str,
                contentPresence: false
            });
        }
    }

    /**
     * Метод принимает выбранные теги из списка тегов
     * @param e 
     */
    handleTopics(e) {
        let topicIds = [];
        this.state.availableTopics.map(topic => {
            if (e.target.value.find(x => x.value === topic.value)) {
                topicIds.push(topic.value)
            }
        });

        this.setState({
            selectedTopicsId: topicIds,
            selectedTopicsValue: e.target.value
        })

    }

    /**
     * Метод принимает выбранные файлы из списка файлов, которые загружены в профиль
     * @param e 
     */
    handleFiles(e) {
        let filesIds = [];
        this.state.availableFiles.map(file => {
            if (e.target.value.find(x => x.value === file.value)) {
                filesIds.push(file.value)
            }
        });
        this.setState({
            selectedFilesId: filesIds,
            selectedFilesValue: e.target.value
        })
    }

    /**
     * Метод отвечает за сворачивание меню загрузки файлов
     */
    onClickUpload() {
        this.setState({
            uploadMenuState: false,
        })
    }

    /**
     * Метод отвечает за создание постов
     * @param e 
     */
    async handleSubmitRecord(e) {
        e.preventDefault();

        let fileNameUidAndStringBase64 = []
        let fileNameUidBase64
        
        // Для прикрепления не загруженных файлов в профиль, нужно перевести их в строку base64
        if(this.state.selectedFilesUpload !== undefined) {
            let uid = null
            let selectedFiles = [...this.state.selectedFilesUpload]
            for (let i = 0; i < selectedFiles.length; i++) {
                if (selectedFiles[i].name.endsWith(".dcm")) {
                    // Изображения формата .dcm должны быть анонимизированы.
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
                    // Для отправления файлов по websocket, необходимо перевести их в строку base64.
                    const fileStringBase64 = await readerPromise;
                    fileNameUidBase64 = {fileName: selectedFiles[i].name, fileContent: fileStringBase64 , uid: uid}
                } else {
                    let readerPromise = new Promise((resolve, reject) => {
                        let reader = new FileReader();
                        reader.onload = () => {
                            resolve(reader.result);
                        };
                        reader.onerror = reject;
                        reader.readAsDataURL(selectedFiles[i]);
                    })
                    // Для отправления файлов по websocket, необходимо перевести их в строку base64.
                    const fileStringBase64 = await readerPromise;
                    fileNameUidBase64 = {fileName: selectedFiles[i].name, fileContent: fileStringBase64, uid: uid}
                }
                fileNameUidAndStringBase64.push(fileNameUidBase64)
            }
        }

        RecordService.saveRecord(this.state.title, this.state.contentCorrect, this.state.selectedTopicsId, this.state.selectedFilesId, fileNameUidAndStringBase64).then(
            () => {
                this.setState({
                    submittedSuccessfully: true,
                    message: "Успешно опубликовано",
                    content: "",
                    contentCorrect: "",
                    contentPresence: false,
                    title: "",
                    selectedFilesId: [],
                    selectedFilesValue: [],
                    selectedFilesUpload: [],
                    selectedTopicsId: [],
                    selectedTopicsValue: [],
                });
            },
            error => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

                this.setState({
                    submittedSuccessfully: false,
                    message: resMessage,
                    contentCorrect: "",
                    contentPresence: false,
                });
            }
        );

    }

    componentDidMount() {
        AttachmentService.getAttachmentsForUser(AuthService.getCurrentUser().username)
            .then(response => {
                    let filteredDicomsForSelect = response.data.map(el => {
                        return {value: el.id, name: el.initialName};
                    })
                    this.setState({
                        availableFiles: filteredDicomsForSelect
                    });
                },
                error => {
                    console.log(error);
                }
            );

        TopicService.getAllTopics()
            .then(response => {
                    let topicsForSelect = response.data.topics.map(el => {
                        return {value: el.id, label: el.name};
                    })
                    this.setState({
                        availableTopics: topicsForSelect
                    });
                },
                error => {
                    console.log(error);
                }
            );
    }

    render() {
        const {classes} = this.props;

        return (
            <Container component="main">
                <main className={classes.layout}>
                    <Paper className={classes.paper}>

                        <Typography variant="h6" gutterBottom>
                            Создание поста
                        </Typography>

                        <form className={classes.form}
                              onSubmit={this.handleSubmitRecord}
                        >
                            <TextField
                                className={classes.root}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="title"
                                label="Заголовок"
                                name="title"
                                autoComplete="off"
                                autoFocus
                                value={this.state.title}
                                onChange={this.onChangeTitle}
                            />

                            <TextField
                                className={classes.root}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="content"
                                label="Содержание"
                                multiline
                                name="content"
                                autoComplete="off"
                                rows={7}
                                value={this.state.content}
                                onChange={this.onChangeContent}
                            />

                            <FormControl className={classes.formControl}>
                                <InputLabel id="selected-topics">Выбрать ключевые слова</InputLabel>
                                <Select
                                    className={classes.root}
                                    multiple
                                    title={"Прикрепить тэги"}
                                    labelId="selected-topics"
                                    value={this.state.selectedTopicsValue}
                                    onChange={this.handleTopics}
                                    input={<Input id="select-multiple-chip-for-topics"/>}
                                    renderValue={(selected) => (
                                        <div className={classes.chips}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value.label} className={classes.chip}/>
                                            ))}
                                        </div>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {this.state.availableTopics.map(x => (
                                        <MenuItem key={x.value} value={x} id={x.value}>
                                            {x.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            { this.state.uploadMenuState ? (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.uploadMenuButton}
                                    title = {"Загрузить файлы"}
                                    onClick={this.onClickUpload}
                                >
                                    Прикрепить файлы <KeyboardArrowDownIcon />
                                </Button>
                            ) : (
                                <div className={classes.dropZone}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.uploadMenuButton}
                                        title = {"Закрыть меню"}
                                        onClick={() => this.setState({uploadMenuState: true,})}
                                    >
                                        Закрыть <KeyboardArrowUpIcon />
                                    </Button>
                                    
                                    <Grid container spacing={2} className={classes.uploadGrid}>
                                        <Grid item xs={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => this.setState({modalShowUploadDevice: true,})}
                                            >
                                                С устройства
                                            </Button>
                                            <Modal
                                                show={this.state.modalShowUploadDevice}
                                                centered="true"
                                                aria-labelledby="contained-modal-title-vcenter"
                                                onHide={this.handleCloseModalDevice}
                                            >
                                                <Modal.Header>
                                                    <Modal.Title id="contained-modal-title-vcenter">
                                                        Выберите изображения с устройства
                                                    </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                <Card className={classes.paperGrey}>
                                                    <div className={classes.dropZone} onDragEnter={this.dragEnterHandler} onDragLeave={this.dragLeaveHandler} onDragOver={this.dragEnterHandler} onDrop={(e) => this.dropHandler(e)}>
                                                    <Grid className={classes.gridContent}>
                                                            { !this.state.dragEnter ? (
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
                                                                <input type="file" style={{ display: "none" }} ref={this.fileInput} multiple onChange={(e) => this.fileHandler(e)}/>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </Card>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button onClick={() => this.setState({modalShowUploadDevice: false,})} >Принять</Button>
                                                    <Button onClick={() => this.handleCloseModalDevice()}>Отменить</Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => this.setState({modalShowUploadProfile: true,})}
                                            >
                                                Из профиля
                                            </Button>
                                            <Modal
                                                show={this.state.modalShowUploadProfile}
                                                centered="true"
                                                aria-labelledby="contained-modal-title-vcenter"
                                                onHide={this.handleCloseModalProfile}
                                            >
                                                <Modal.Header>
                                                    <Modal.Title id="contained-modal-title-vcenter">
                                                        Выберите изображения из профиля
                                                    </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel id="selected-files">Прикрепить файлы</InputLabel>
                                                    <Select
                                                        className={classes.root}
                                                        multiple
                                                        labelId="selected-files"
                                                        value={this.state.selectedFilesValue}
                                                        title={"Прикрепить файлы"}
                                                        onChange={this.handleFiles}
                                                        input={<Input id="select-multiple-chip-for-files"/>}
                                                        renderValue={(selected) => (
                                                            <div className={classes.chips}>
                                                                {selected.map((value) => (
                                                                    <Chip key={value} label={value.name} className={classes.chip}/>
                                                                ))}
                                                            </div>
                                                        )}
                                                        MenuProps={MenuProps}
                                                    >

                                                        {this.state.availableFiles.map(x => (
                                                            <MenuItem key={x.value} value={x} id={x.value}>
                                                                {x.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button onClick={() => this.setState({modalShowUploadProfile: false,})} >Принять</Button>
                                                    <Button onClick={() => this.handleCloseModalProfile()}>Отменить</Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </Grid>
                                    </Grid>
                                </div>                  
                            )}
                            
                            <Grid>
                                {this.state.selectedFilesUpload && [...this.state.selectedFilesUpload].map((file, i) => 
                                    <div>
                                        <span>{file.name}  {"\n"}</span>
                                        <span as="button" key={i} style={{cursor: "pointer", '&:hover': {color: "#fff",},}} onClick={() => this.delFilesDevice(i)}><HighlightOffIcon/></span>
                                    </div>
                                )}

                                {this.state.selectedFilesValue && [...this.state.selectedFilesValue].map((file, i) => 
                                    <div>
                                        <span>{file.name}  {"\n"}</span>
                                        <span as="button" key={i} style={{cursor: "pointer", '&:hover': {color: "#fff",},}} onClick={() => this.delFilesProfile(i)}><HighlightOffIcon/></span>
                                    </div>
                                )}
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                disabled={!this.state.contentPresence}
                                title = {"Опубликовать"}
                            >
                                Опубликовать
                            </Button>
                            {this.state.message && (
                                <div className="form-group">
                                    <div
                                        className={
                                            this.state.submittedSuccessfully
                                                ? "alert alert-success"
                                                : "alert alert-danger"
                                        }
                                        role="alert"
                                    >
                                        {this.state.message}
                                    </div>
                                </div>
                            )}
                        </form>
                    </Paper>
                </main>
            </Container>
        )
    }
}

export default withStyles(useStyles)(CreateRecordComponent)