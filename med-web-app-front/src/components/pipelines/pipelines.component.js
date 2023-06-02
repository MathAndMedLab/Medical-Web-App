import React, {Component} from "react";
import Select from 'react-select';
import AuthService from "../../services/auth.service";
import PipelineService from "../../services/pipeline.service"
import PipelineJobService from "../../services/pipelinejob.service"
import AttachmentService from "../../services/attachment.service"
import {Button, Divider, FormControl, Grid, Paper, Typography, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import ViewListIcon from '@material-ui/icons/ViewList';
import FolderIcon from '@mui/icons-material/Folder';
import ButtonDrawer from "../ButtonDrawer";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import {Hidden} from "@material-ui/core";

const useStyles = theme => ({
    listIcon: {
        marginTop: theme.spacing(3),
    },
    paper: {
        marginTop: theme.spacing(3),
        //padding: theme.spacing(1),
        //display: 'flex',
        flexGrow: 1,
      
    },
    paper2: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),

    },
    mainGrid: {
        display: 'flex',
        height: "calc(100vh - 80px)",
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
        textAlign: "center"
    },
    content: {
        //margin: theme.spacing(1),
        display: 'inline-block', 
        wordWrap: 'break-word',
        padding: theme.spacing(1),
        marginLeft: 7,
    },
    select: {
        margin: theme.spacing(1),
        display: 'inline-block', 
        wordWrap: 'break-word',
    },
    viewList: {
         [theme.breakpoints.down("xs")]: {
            width: '28px', // изменяем ширину иконки
            height: '28px'
        },
        [theme.breakpoints.up("sm")]:{
            width: '35px', // изменяем ширину иконки
            height: '35px'
        },
    }
})



class PipelinesComponent extends Component {


    constructor(props) {
        super(props);

        const user = AuthService.getCurrentUser();

        this.createSelectPipelineItems = this.createSelectPipelineItems.bind(this);
        this.onPipelineDropdownSelected = this.onPipelineDropdownSelected.bind(this);
        this.onFileDropdownSelected = this.onFileDropdownSelected.bind(this);
        this.submitPipeline = this.submitPipeline.bind(this);

        const links = ["/files/view", "/files/upload", "/pipelines/results", "/pipelines/save"];
        const icons = [ <FolderIcon style={{ color: '#f50057' }}/>, <FileDownloadIcon style={{ color: '#f50057' }}/>, <DataUsageIcon style={{ color: '#f50057' }}/>,<SaveAltIcon style={{ color: '#f50057' }}/>,]
        const titles = [ 'Мои файлы', 'Загрузить файл', "Результаты" , "Сохранить конфигурацию"]
        const positions = ['right']
        const icon = <ViewListIcon style={{ color: '#f50057' }} className={this.props.classes.viewList}/>
        this.state = {
            currentUser: user,
            pipelines: [],
            files: [],
            message: [],
            selectedFile: null,
            selectedPipeline: null,
            submitted: false,
            links: links,
            icons: icons,
            titles: titles,
            positions: positions,
            icon: icon,
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
            <Grid container className={classes.mainGrid} justifyContent="center">
                <Grid xs={9} md={8} lg={6} item>
                    <Paper className={classes.paper}>
                        <Typography className={classes.title} variant="h5">
                            Автоматический анализ снимка
                        </Typography>
                        <Divider/>

                        <form className={classes.form}
                                onSubmit={this.submitPipeline}
                        >
                            <FormControl className={classes.formControl}>
                                <Typography className={classes.content} color="inherit">
                                    Проанализировать снимок на
                                </Typography>
                                <Select className={classes.select}
                                        onChange={this.onPipelineDropdownSelected}
                                        options={pipelines}
                                        autoFocus={true}
                                        fullWidth
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <Typography className={classes.content} color="inherit" noWrap>
                                    Выберите файл
                                </Typography>
                                <Select className={classes.select}
                                        onChange={this.onFileDropdownSelected}
                                        options={files}
                                        fullWidth
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

                <Grid item>
                    <Hidden lgUp >
                        <div className={classes.listIcon}>
                            <ButtonDrawer links={this.state.links} icons={this.state.icons} titles={this.state.titles} positions={this.state.positions} icon={this.state.icon}/>
                        </div>
                    </Hidden>
                    <Hidden mdDown>
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
                            </Grid>
                        </Paper>
                    </Hidden>
                    
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(useStyles)(PipelinesComponent)