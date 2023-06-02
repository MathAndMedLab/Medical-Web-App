import React, {Component} from "react";
import AuthService from "../../services/auth.service";
import PipelineJobService from "../../services/pipelinejob.service"
import AttachmentService from "../../services/attachment.service"
import {
    Card,
    Divider,
    Typography,
    withStyles
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";
import ViewListIcon from '@material-ui/icons/ViewList';
import ButtonDrawer from "../ButtonDrawer";
import {Hidden} from "@material-ui/core"
import CachedIcon from '@material-ui/icons/Cached';
import clsx from "clsx"

const useStyles = theme => ({
    results: {
        display: 'inline-block', 
        wordWrap: 'break-word',
    },
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
        },
        fontsize: 2,
    },
    button1: {
        height: 30,
    },
    mainGrid: {
        display: 'flex',
    },
    paper: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
        padding: theme.spacing(2),
        color: "black",
        minHeight: 400,
    },
    paper2: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
        color: "black",
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
})

class PipelineResultsComponent extends Component {
    constructor(props) {
        super(props);

        this.download = this.download.bind(this);
        // this.delete = this.delete.bind(this);
        this.updatePipelineResults = this.updatePipelineResults.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        const user = AuthService.getCurrentUser();

        const links = ["/pipelines/create"];
        const icons = [ <CachedIcon style={{ color: '#f50057' }}/>]
        const titles = [ 'Запустить анализ']
        const positions = ['right']
        const icon = <ViewListIcon style={{ color: '#f50057' }} fontSize="large"/>
        this.state = {
            currentUser: user,
            pipelineJobs: [],
            message: "",
            open: false,
            links: links,
            icons: icons,
            titles: titles,
            positions: positions,
            icon: icon,
        };
    }

    componentDidMount() {
        this.updatePipelineResults();
        setInterval(() => this.updatePipelineResults(), 3000);
    }

    updatePipelineResults() {
        PipelineJobService.getPipelineJobsForUser(AuthService.getCurrentUser().username).then(
            response => {
                let jobs = [];
                response.data.forEach(el => {
                    let inputFileName = (el.inputFiles !== undefined && el.inputFiles !== null && el.inputFiles.length > 0)
                        ? el.inputFiles[0].initialName : "";
                    let outputFileName = el.outputFile !== undefined && el.outputFile !== null ? el.outputFile.initialName : "";
                    let outputFileId = el.outputFile !== undefined && el.outputFile !== null ? el.outputFile.id : "";
                    let pipelineDescription = el.pipeline !== undefined && el.pipeline !== null ? el.pipeline.description : "";
                    let job = {
                        id: el.id,
                        pipelineName: pipelineDescription,
                        status: el.executionStatus,
                        inputName: inputFileName,
                        outputName: outputFileName,
                        outputId: outputFileId
                    };
                    jobs.push(job);
                })

                this.setState({
                    pipelineJobs: jobs
                });
            },
            error => {
                this.setState({
                    content: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
    }

    download(fileId, initialFileName) {
        AttachmentService.downloadAttachment(fileId, initialFileName).then();
    }

    // delete(pipelineJobId, fileId) {
    //     this.setState({open: false, pipelineJobId: this.state.pipelineJobs.filter(el => el.id !== pipelineJobId)})
    //     PipelineJobService.deletePipelineJob(AuthService.getCurrentUser().username, pipelineJobId, fileId).then();
    //     this.updatePipelineResults();
    // }

    translateStatus(status) {
        if (status === 'COMPLETED_ERROR') {
            return 'Ошибка';
        }
        if (status === 'COMPLETED_OK') {
            return 'Успешно';
        }
        if (status === 'IN_PROGRESS') {
            return 'Выполняется';
        }
    }

    handleClickOpen() {
        this.setState({open: true})
    }

    handleClose() {
        this.setState({open: false})
    }

    render() {
        const {pipelineJobs} = this.state;
        const {classes} = this.props
        return (
                <Grid container className={classes.mainGrid} justifyContent="center">
                    <Grid item xs={9} md={8} lg={6} >
                        <Card className={classes.paper}>
                            <div className="row">
                                <div className={clsx("col-sm-12 align-content-center top-buffer-10", classes.results)}>
                                    <Typography component="h1" className={classes.title} variant="h4">
                                        Результаты:
                                    </Typography>
                                    <div style={{marginLeft: 8, marginRight: 8}}>
                                        <Divider/>

                                        <div style={{marginTop: 10}}>
                                            {pipelineJobs.map(el => (
                                                <div key={el.id} className="row top-buffer-10">

                                                    <div className="col-sm-3"
                                                         style={{wordWrap: "break-word"}}>{el.pipelineName}</div>
                                                    <div className="col-sm-3"
                                                         style={{wordWrap: "break-word"}}>{el.inputName}</div>
                                                    <div className="col-sm-2">{this.translateStatus(el.status)}</div>
                                                    <div className="col-sm-3">
                                                        <Button
                                                            className={classes.button1}
                                                            variant="contained"
                                                            color="primary"
                                                            disabled={el.status !== 'COMPLETED_OK'}
                                                            onClick={() => this.download(el.outputId, el.outputName)}
                                                        >
                                                            <i className="fa fa-download"/>
                                                            <Typography variant="button"
                                                                        style={{marginLeft: 5}}>Скачать</Typography>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Card>
                    </Grid>
                    <Grid item >
                        <Hidden lgUp >
                            <div className={classes.listIcon}>
                                <ButtonDrawer links={this.state.links} icons={this.state.icons} titles={this.state.titles} positions={this.state.positions} icon={this.state.icon}/>
                            </div>
                        </Hidden>
                        <Hidden mdDown>
                            <Card className={classes.paper2}>
                                <Grid className={classes.grid}>
                                    <Link to={"/pipelines/create"} style={{textDecoration: 'none'}}>
                                        <Button className={classes.button}>
                                            Запустить анализ
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

export default withStyles(useStyles)(PipelineResultsComponent)