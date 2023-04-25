import React, {Component} from "react";
import TopicService from "../../services/topic.service";
import TopicCard from "./topic-card.component";
import {Card, Grid, withStyles} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import Button from "@material-ui/core/Button";

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

        "@media (min-width : 451px)":{
            marginLeft: theme.spacing(5)
        },
        "@media (min-width : 600px)":{
            marginLeft: theme.spacing(12)
        },
        "@media (min-width : 690px)":{
            marginLeft: theme.spacing(2)
        },
        "@media (min-width : 768px)":{
            marginLeft: theme.spacing(20)
        },
        "@media (min-width : 769px)":{
            marginLeft: theme.spacing(30)
        },
        "@media (min-width : 874px)":{
            marginLeft: theme.spacing(10)
        },
        "@media (min-width : 960px)":{
            marginLeft: theme.spacing(25)
        },
        "@media (min-width : 992px)":{
            marginLeft: theme.spacing(35)
        },
        "@media (min-width : 1025px)":{
            marginLeft: theme.spacing(25)
        },
        "@media (min-width : 1039px)":{
            marginLeft: theme.spacing(15)
        },
        "@media (min-width : 1280px)":{
            marginLeft: theme.spacing(20)
        },
    },
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
        return (
            <Grid item xs={11} sm={10} md={9} lg={8}>
                <Grid classes={classes.mainGrid}>
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
            </Grid>
        )
    }
}

export default withStyles(useStyles)(TopicComponent)