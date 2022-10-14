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
    /*form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },*/
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
        marginTop: theme.spacing(3),
        "@media (min-width: 425px)":{
            marginLeft: "20%"
        },
        "@media (min-width : 768px)":{
            marginLeft: "40%"
        },
        marginRight: "auto",
        padding: theme.spacing(1),
        color: "black",
        minWidth: 280,
        // display: 'flex',
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
            /*<div className="row align-left color-light-blue">
                    <Form
                        onSubmit={this.handleSubmitTopic}
                        ref={c => {
                            this.inputForm = c;
                        }}
                    >
                        <div className="mt-3">
                            <div className="form-group">
                                <div style={{marginRight: "17px"}}>{"Создать тэг: "}</div>
                                <textarea className="form-control"
                                          id="exampleFormControlTextarea1"
                                          rows="1"
                                          onChange={this.onChangeName}
                                          value={this.state.name}
                                          autoComplete="off"
                                >
                    </textarea>
                            </div>
                        </div>

                        <div className="form-group top-buffer-10">
                            <button
                                className="btn btn-primary btn-block color-dark-blue"
                                disabled={!this.state.name}
                            >
                                <span>Сохранить</span>
                            </button>
                        </div>

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

                        <CheckButton
                            style={{display: "none"}}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />

                    </Form>
                </div>

                <ul className="list-group">
                    {this.state.topics &&
                    this.state.topics.map((topic, index) => (
                        <li
                            style={{listStyleType: "none"}}
                            key={index}
                        >
                            <TopicCard topic={topic}/>
                        </li>
                    ))}
                </ul>

            </div>*/
            <Grid item xs={8}>
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