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

const useStyles = theme => ({
    mainGrid: {
        marginTop: theme.spacing(3),
        [theme.breakpoints.down("xs")]: {
            width: 280,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 650
        },
        "@media (min-width : 1280px)": {
            width: 800,
        },
        display: "center",
        justifyContent: "flex-start",
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
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(0),
        marginRight: "auto",
        padding: theme.spacing(1),
        color: "black",
        [theme.breakpoints.down("xs")]: {
            width: 268,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 650
        },
        "@media (min-width : 1280px)": {
            width: 800,
        },

        justifyContent: 'center'
    },
    Grid: {
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
    divBackButtonStyle: {
        position: "fixed",
        padding: "auto",
        top: "12%",
        "@media (max-width: 320px)": {
            left: "3%"
        },
        "@media (min-width : 321 px, max-width: 426px)": {
            left: "15%",
        },
        [theme.breakpoints.between("sm", "md")]: {
            left: "8%",
        },
        "@media (min-width : 1000px)": {
            left: "5%"
        },
    },


});

class RecordThreadComponent extends Component {
    constructor(props) {
        super(props);

        this.refreshAnswers = this.refreshAnswers.bind(this);

        this.state = {
            //recordId: null,
            recordId: this.props.match.params.recordId,
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
        const {answers} = this.state;
        return (
            <Grid item xs={12} className={classes.Grid}>
                <div className={classes.divAddButtonStyle}>
                    {/*<DropUpOnRecordThread/>*/}
                </div>
                <div className={classes.divBackButtonStyle}>
                    <ListItemButton component={Link} to={"/records/view"} style={{
                        padding: 0,
                        margin: 0
                    }} title={"Назад к постам"}>
                        <ArrowBack color={"secondary"} fontSize={"large"}/>
                    </ListItemButton>
                </div>
                <Grid item xs={8} style={{justifyContent: "center", alignItems: "center"}}>
                    <Grid className={classes.mainGrid}>

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