import React, {Component} from "react";
import RecordService from "../../services/record.service";
import RecordCard from "./record-card.component";
import ReplyRecordForm from "./reply-record.component";
import {Card, Grid, withStyles} from "@material-ui/core";
import ReviewCard from "../review-card.component";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import DropUpOnRecordThread from "./DropUpOnRecordThread";
import {ListItemButton} from "@mui/material";
import {ArrowBack} from "@material-ui/icons";
import {IconButton} from "@material-ui/core"

const useStyles = theme => ({
    mainGrid: {
        [theme.breakpoints.down("xs")]: {
            width: 270,
        },
        "@media (min-width : 414px)": {
            marginLeft: theme.spacing(0),
        },
        "@media (min-width : 451px)": {
            width: 325,
        },
        "@media (min-width : 600px)": {
            marginLeft: theme.spacing(7),
            width: 375,
        },
        "@media (min-width : 768px)": {
           marginLeft: theme.spacing(18),
        },
        "@media (min-width : 960px)": {
            marginLeft: theme.spacing(3),
            width: 550
        },
        "@media (min-width : 992px)": {
            marginLeft: theme.spacing(15),
        },
        "@media (min-width : 1000px)": {
            marginLeft: theme.spacing(-10),
        },
        "@media (min-width : 1025px)": {
            marginLeft: theme.spacing(-5),
        },
        "@media (min-width : 1110px)": {
            width: 650,
            marginLeft: theme.spacing(5),
        },
        "@media (min-width : 1200px)": {
            marginLeft: theme.spacing(0),
        },
        "@media (min-width : 1280px)": {
            width: 800,
        },
        display: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    paper2: {
        margin: theme.spacing(3),
        padding: theme.spacing(3),
        color: "black",
    },
    grid: {
        margin: theme.spacing(1),
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    },
    paper: {
        marginLeft: theme.spacing(0),
        marginRight: "auto",
        padding: theme.spacing(1),
        color: "black",
        [theme.breakpoints.down("xs")]: {
            width: 270,
        },
        "@media (min-width : 451px)": {
            width: 325,
        },
        "@media (min-width : 600px)": {
            width: 375,
        },
        "@media (min-width : 960px)": {
            width: 650,
        },
        "@media (min-width : 1280px)": {
            width: 800,
        },

        justifyContent: 'center'
    },
    Grid: {
        marginTop: theme.spacing(5),
        [theme.breakpoints.down("xs")]: {
            width: 268,
            justifyContent: "flex-start",
            marginLeft: "auto",
            marginRight: "auto"
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 800,
            justifyContent: "flex-start",
            marginLeft: theme.spacing(2)
        },
        "@media (min-width : 1000px)": {
            width: 1100,
            justifyContent: "center"

        },
        display: "flex",

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
    divAddButtonStyle: {
        position: "fixed",
        [theme.breakpoints.down("xs")]: {
            left: "81%",
            top: "90%"
        },
        [theme.breakpoints.between("sm", "md")]: {
            left: "91.5%",
            top: "90%"
        },
        "@media (min-width : 1000px)": {
            left: "85%",
            top: "90%"
        },
    },
    backButtonStyle: {
        position: "fixed",
        zIndex: 2500,
        [theme.breakpoints.down("xs")]: {
            left: "0%",
        },
        "@media (min-width : 600px)": {
            left: "14%",
        },
        "@media (min-width : 960px)": {
            left: "13%",
        },
        "@media (min-width : 1280px)": {
            left: "12%",
        },
    },


});

class RecordThreadComponent extends Component {
    constructor(props) {
        super(props);

        this.refreshAnswers = this.refreshAnswers.bind(this);

        this.state = {
            recordId: props.recordId,
            //recordId: this.props.match.params.recordId,
            record: null,
            answers: [],
        };
    }

    componentDidMount() {
        RecordService.getRecord(this.state.recordId)
            .then(response => {
                    this.setState({record: response.data});
                }
            )
            .catch(error => {
                console.log(error);
            });

        this.refreshAnswers();
    }

    refreshAnswers() {
        RecordService.getAnswers(this.state.recordId)
            .then(response => {
                this.setState({answers: []});
                this.setState({answers: response.data});
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        const {classes} = this.props;
        const {open} = this.props;
        const {answers} = this.state;
        return (
            <Grid container xs={12} alignItems="flex-start" justifyContent="center" className={classes.Grid}>
                <IconButton title={"Назад к постам"} component={Link} to={"/records/view"} disabled={open } className={classes.backButtonStyle}>
                    { !open  && (<ArrowBack color={"secondary"} fontSize={"large"}/>)}
                </IconButton>
                
                <Grid container item direction="column" className={classes.mainGrid}>

                    {this.state.record &&
                    (<RecordCard record={this.state.record} isPreview={false} isReply={false}/>)
                    }
                    <Card className={classes.paper}>

                        <ReplyRecordForm
                            refreshRecords={this.refreshAnswers}
                            parentId={this.state.recordId}/>

                        <ul className="list-group">
                            {answers !== undefined && this.state.answers !== null &&
                            this.state.answers.map((record, index) => (
                                <li
                                    style={{
                                        listStyleType: "none",
                                        width: "100%",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        marginTop: "1"
                                    }}
                                    key={index}
                                >
                                    <ReviewCard review={record} isPreview={false} isReply={true}/>
                                </li>

                            ))}
                        </ul>
                    </Card>
                </Grid>
               
                {/*<Grid xs={4} item>
                    <Card className={classes.paper2}>
                        <Grid className={classes.grid}>
                            <Link to={"/records/create"} className="nav-link card-link-custom color-orange">
                                Создать пост
                            </Link>
                            <Link to={"/records/view"} className="nav-link card-link-custom color-orange">
                                Обратно к постам
                            </Link>
                            <Button >
                                <Link  to={"/records/create"} style={{ textDecoration: 'none' }}>
                                    <Button className={classes.button}>
                                    Создать пост
                                    </Button>
                                </Link>
                            </Button>
                            <Button >
                                <Link to={"/records/view"} style={{ textDecoration: 'none' }}>
                                    <Button className={classes.button}>
                                    Обратно к постам
                                    </Button>
                                </Link>
                            </Button>
                        </Grid>
                    </Card>
                </Grid>*/}


            </Grid>
        );
    }
}

export default withStyles(useStyles)(RecordThreadComponent)