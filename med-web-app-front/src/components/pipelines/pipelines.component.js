import React, {Component} from "react";
import Select from 'react-select';
import AuthService from "../../services/auth.service";
import PipelineService from "../../services/pipeline.service"
import PipelineJobService from "../../services/pipelinejob.service"
import AttachmentService from "../../services/attachment.service"
import {Button, Divider, FormControl, Grid, Paper, Typography, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";

const useStyles = theme => ({
    paper: {
        marginTop: theme.spacing(3),
        //padding: theme.spacing(1),
        //display: 'flex',
        flexGrow: 1,
        [theme.breakpoints.down("xs")]: {
            width: "250px",
            marginLeft: "5%",
        },
        "@media (min-width: 424px)": {
            width: "80%",
            marginLeft: theme.spacing(5)
        }
    },
    paper2: {
        margin: theme.spacing(3),
        padding: theme.spacing(3),

    },
    mainGrid: {
        display: 'flex',
        minWidth: 1000,


    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: 0,
        backgroundColor: '#3f51b5',
    },
    buttons: {
        width: 200,
        margin: theme.spacing(1),
        backgroundColor: '#f50057',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
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
    grid: {
        margin: theme.spacing(1),
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',

    },
    title: {
        padding: theme.spacing(3),
    },
    content: {
        //margin: theme.spacing(1),
        padding: theme.spacing(1),
        marginLeft: 7,
    },
    CenterContainer: {
        spacing: theme.spacing(3),
        justifyContent: "center",
        // paddingLeft : theme.spacing(4),
        "@media (max-width: 768px)": {
            justifyContent: "flex-start"
        },

    }
})

function rightSideRender(classes) {
    if (window.innerWidth >= 958) {
        return (<Grid item xs={4}>
            <Paper className={classes.paper2}>
                <Grid className={classes.grid}>
                    <Link to={"/files/view"} style={{textDecoration: 'none'}}>
                        <Button className={classes.buttons} title={"Мои файлы"}>
                            Мои файлы
                        </Button>
                    </Link>

                    <Link to={"/files/upload"} style={{textDecoration: 'none'}}>
                        <Button className={classes.buttons} title={"Загрузить файл"}>
                            Загрузить файл
                        </Button>
                    </Link>

                    <Link to={"/pipelines/results"} style={{textDecoration: 'none'}}>
                        <Button className={classes.buttons} title={"Результаты"}>
                            Результаты
                        </Button>
                    </Link>

                    <Link to={"/pipelines/save"} style={{textDecoration: 'none'}}>
                        <Button className={classes.buttons}>
                            Сохранить конфигурацию
                        </Button>
                    </Link>


                    {/*For admin board:
                                <a href={"http://localhost:3000"} target="_blank"
                                   style={{textDecoration: 'none'}}>
                                    <Button className={classes.buttons}>
                                        Все файлы в OHIF
                                    </Button>
                                </a>

                                For admin board:
                                {this.state.currentUser !== null && this.state.currentUser.username === "admin" &&
                                (<Link to={"/pipelines/save"} style={{textDecoration: 'none'}}>
                                    <Button className={classes.buttons}>
                                        Сохранить конфигурацию
                                    </Button>
                                </Link>)

                                }*/}
                </Grid>
            </Paper>
        </Grid>);
    }
}


class PipelinesComponent extends Component {


    constructor(props) {
        super(props);

        const user = AuthService.getCurrentUser();

        this.createSelectPipelineItems = this.createSelectPipelineItems.bind(this);
        this.onPipelineDropdownSelected = this.onPipelineDropdownSelected.bind(this);
        this.onFileDropdownSelected = this.onFileDropdownSelected.bind(this);
        this.submitPipeline = this.submitPipeline.bind(this);

        this.state = {
            currentUser: user,
            pipelines: [],
            files: [],
            message: [],
            selectedFile: null,
            selectedPipeline: null,
            submitted: false
        };
    }

    componentDidMount() {
        PipelineService.getAllPipelines().then(
            response => {
                let pipelinesForSelect = response.data.map(el => {
                    return {value: el.id, label: el.description};
                })
                this.setState({
                    pipelines: pipelinesForSelect
                });
            },
            error => {
                this.setState({
                    content: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );

        AttachmentService.getAttachmentsForUser(AuthService.getCurrentUser().username).then(
            response => {
                let filteredDicoms = response.data.filter(function (file) {
                    return file.initialName.includes(".dcm");
                });

                let filteredDicomsForSelect = filteredDicoms.map(el => {
                    return {value: el.id, label: el.initialName};
                })
                this.setState({
                    files: filteredDicomsForSelect
                });
            },
            error => {
                this.setState({
                    content: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
    }

    createSelectPipelineItems() {
        let items = [];
        if (this.state !== undefined && this.state.pipelines !== undefined && this.state.pipelines.length > 0) {
            for (let i = 0; i <= this.state.pipelines.length; i++) {
                items.push(<option key={i} value={this.state.pipelines[i].id}>
                    {this.state.pipelines[i].description}
                </option>);
            }
        }
        return items;
    }

    onPipelineDropdownSelected(selectedValue) {
        this.setState({selectedPipeline: selectedValue.value});
    }

    onFileDropdownSelected(selectedValue) {
        this.setState({selectedFile: selectedValue.value});
    }

    submitPipeline() {
        PipelineJobService.sendRequestForPipelineJob(this.state.currentUser.username,
            this.state.selectedPipeline, this.state.selectedFile).then(
            response => {
            },
            error => {
                this.setState({
                    content: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        )
        this.setState({submitted: true});
    }


    render() {
        const {pipelines, files, selectedFile, selectedPipeline, submitted} = this.state;
        const {classes} = this.props;

        return (
            <Grid className={classes.mainGrid}>
                <Grid container className={classes.CenterContainer}>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <Typography className={classes.title} variant="h5">
                                Автоматический анализ снимка
                            </Typography>
                            <Divider/>

                            <form className={classes.form}
                                  onSubmit={this.submitPipeline}
                            >
                                <FormControl className={classes.formControl}>
                                    <Typography className={classes.content} color="inherit" noWrap>
                                        Проанализировать снимок на
                                    </Typography>
                                    <Select className="col-9 col-offset-4"
                                            onChange={this.onPipelineDropdownSelected}
                                            options={pipelines}
                                            autoFocus={true}
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <Typography className={classes.content} color="inherit" noWrap>
                                        Выберите файл
                                    </Typography>
                                    <Select className="col-9 col-offset-4"
                                            onChange={this.onFileDropdownSelected}
                                            options={files}
                                    />
                                </FormControl>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    disabled={selectedFile == null || selectedPipeline == null || submitted}
                                    className={classes.button}
                                    title={"Запустить"}
                                >
                                    Запустить
                                </Button>
                            </form>


                            {this.state.submitted && (
                                <div className="form-group">
                                    <div
                                        className="alert alert-success top-buffer-10"
                                        role="alert">
                                        Отправлено исполняться <br/> Результаты можно посмотреть на вкладке
                                        "Запущенные
                                        конвейеры"
                                    </div>
                                </div>
                            )}
                        </Paper>
                    </Grid>

                    {/*<rightSideRender classes = {classes}/>*/}
                    {rightSideRender(classes)}

                    {/*<Grid item xs={4}>*/}
                    {/*    <Paper className={classes.paper2}>*/}
                    {/*        <Grid className={classes.grid}>*/}
                    {/*            <Link to={"/files/view"} style={{textDecoration: 'none'}}>*/}
                    {/*                <Button className={classes.buttons}>*/}
                    {/*                    Мои файлы*/}
                    {/*                </Button>*/}
                    {/*            </Link>*/}

                    {/*            <Link to={"/files/upload"} style={{textDecoration: 'none'}}>*/}
                    {/*                <Button className={classes.buttons}>*/}
                    {/*                    Загрузить файл*/}
                    {/*                </Button>*/}
                    {/*            </Link>*/}

                    {/*            <Link to={"/pipelines/results"} style={{textDecoration: 'none'}}>*/}
                    {/*                <Button className={classes.buttons}>*/}
                    {/*                    Результаты*/}
                    {/*                </Button>*/}
                    {/*            </Link>*/}

                    {/*            /!*TODO сделать так же, как в record-card*!/*/}
                    {/*            <a href={"http://localhost:3000/local"} target="_blank"*/}
                    {/*                  style={{textDecoration: 'none'}}>*/}
                    {/*                <Button className={classes.buttons}>*/}
                    {/*                    Открыть DICOM-файл*/}
                    {/*                </Button>*/}
                    {/*            </a>*/}


                    {/*            /!*For admin board:*!/*/}
                    {/*            /!*<a href={"http://localhost:3000"} target="_blank"*!/*/}
                    {/*            /!*   style={{textDecoration: 'none'}}>*!/*/}
                    {/*            /!*    <Button className={classes.buttons}>*!/*/}
                    {/*            /!*        Все файлы в OHIF*!/*/}
                    {/*            /!*    </Button>*!/*/}
                    {/*            /!*</a>*!/*/}

                    {/*            /!*For admin board:*!/*/}
                    {/*            {this.state.currentUser !== null && this.state.currentUser.username === "admin" &&*/}
                    {/*            (<Link to={"/pipelines/save"} style={{textDecoration: 'none'}}>*/}
                    {/*                <Button className={classes.buttons}>*/}
                    {/*                    Сохранить конфигурацию*/}
                    {/*                </Button>*/}
                    {/*            </Link>)*/}

                    {/*            }*/}
                    {/*        </Grid>*/}
                    {/*    </Paper>*/}
                    {/*</Grid>*/}
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(useStyles)(PipelinesComponent)