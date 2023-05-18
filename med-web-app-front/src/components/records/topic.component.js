import React, {Component} from "react";
import TopicService from "../../services/topic.service";
import TopicCard from "./topic-card.component";
import {Card, Grid, Hidden, withStyles} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {ArrowBack} from "@material-ui/icons";
import {IconButton} from "@material-ui/core"


const useStyles = theme => ({
    root: {
        width: 635,
        marginRight: theme.spacing(1),
        "& .MuiFormLabel-root": {
            margin: 0,
            color: "black"
        },
    },
    submit: {
        width: 50,
        height: 73,
        backgroundColor: '#f50057',
    },
  
    mainGrid: {
        minWidth: 400,
        justifyContent: "center",
        display:"center",
    },
    grid: {
        margin: theme.spacing(1),
        display: 'flex',
        minWidth: 240,
    },
    paper: {
        marginTop: theme.spacing(5),
        padding: theme.spacing(1),
        color: "black",
        minWidth: 280,
        

        "@media (min-width : 0px)":{
            marginLeft: theme.spacing(4)
        },
        "@media (min-width : 576px)":{
            marginLeft: theme.spacing(2)
        },
        "@media (min-width : 600px)":{
            marginLeft: theme.spacing(8)
        },
        "@media (min-width : 690px)":{
            marginLeft: theme.spacing(4)
        },
        "@media (min-width : 768px)":{
            marginLeft: theme.spacing(2),
            maxWidth: 450,
        },
        "@media (min-width : 874px)":{
            maxWidth: 600,
            marginLeft: theme.spacing(9)
        },
        "@media (min-width : 1025px)":{
            marginLeft: theme.spacing(8)
        },
       
        "@media (min-width : 1100px)":{
            marginLeft: theme.spacing(0),
        },
    },

  
    backButtonStyle: {
        position: "fixed",
        zIndex: 2500,
        top: theme.spacing(13),
        [theme.breakpoints.down("xs")]: {
            left: "0%",
        },
        "@media (min-width : 600px)": {
            left: "12%",
        },
        "@media (min-width : 960px)": {
            left: "13%",
        },
        "@media (min-width : 1280px)": {
            left: "12%",
        },
    },
    backButtonIcon: {
        [theme.breakpoints.down("xs")]: {
            fontSize: "24px"
        },
        "@media (min-width : 600px)": {
            fontSize: "35px"
        },
    }
})

class TopicComponent extends Component {
    constructor(props) {
        super(props);

        this.handleSubmitTopic = this.handleSubmitTopic.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.getTopics = this.getTopics.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.refreshList = this.refreshList.bind(this);

        this.state = {
            topics: [],
            name: "",
            submittedSuccessfully: false,
            message: null,
        };
    }


    handleSubmitTopic(e) {
        e.preventDefault();
        TopicService.saveTopic(this.state.name).then(
            () => {
                this.setState({
                    submittedSuccessfully: true,
                    message: "Успешно опубликовано",
                    name: "",
                });
                this.getTopics();
            },
            error => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

                this.setState({
                    submittedSuccessfully: false,
                    message: resMessage
                });
            }
        )
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value
        });
    }

    componentDidMount() {
        this.getTopics();
    }

    getTopics() {
        TopicService.getAllTopics()
            .then(response => {
                const {topics} = response.data;
                this.refreshList();
                this.setState({topics: topics})
            })
            .catch((e) => {
                console.log(e);
            });
    }

    refreshList() {
        this.setState({
            topics: [],
        });
    }

    render() {
        const {classes} = this.props;
        const {open} = this.props;
        return (
                <Grid container xs={12} classes={classes.mainGrid} alignItems="flex-start" justifyContent="center">
                    <IconButton title={"Назад к постам"} component={Link} to={"/records/view"} disabled={open} className={classes.backButtonStyle}>
                        { !open && (<ArrowBack color={"secondary"} className={classes.backButtonIcon}/>)}
                    </IconButton>
                    <Card className={classes.paper}>
                        <div>
                            <form className={classes.form}
                                  onSubmit={this.handleSubmitTopic}
                            >
                                <Grid className={classes.grid}>
                                    <TextField
                                        className={classes.root}
                                        multiline
                                        minRows={2}
                                        maxRows={10}
                                        variant="outlined"
                                        fullWidth
                                        id="name"
                                        label="Создать тэг"
                                        name="name"
                                        autoComplete="off"
                                        value={this.state.name}
                                        onChange={this.onChangeName}
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        // onClick={this.handleRegister}
                                        className={classes.submit}
                                        disabled={!this.state.name}
                                    >
                                        <DoneOutlineIcon/>
                                    </Button>
                                </Grid>

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
                        </div>
                        <Grid>
                            {this.state.topics &&
                            this.state.topics.map((topic, index) => (
                                <Grid
                                    style={{listStyleType: "none"}}
                                    key={index}
                                >
                                    <TopicCard topic={topic}/>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Grid>
        )
    }
}

export default withStyles(useStyles)(TopicComponent)