import React, {Component} from "react";
import AuthService from "../../services/auth.service";
import '../../styles/Record.css'
import {Card, Grid, withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";


const useStyles = theme => ({
    mainGrid: {
        display: 'flex',
        margin:10,
    },
    grid: {
        display: 'flex',
    },
    paper: {
        margin: theme.spacing(3),
        borderRadius: 20,
        backgroundColor: "#eeeeee"
    },
    hMargin: {
        margin: 0
    },
    content: {
        wordWrap: 'break-word',
        maxWidth: 400,
        marginLeft: 10,
    },
})

class TopicCard extends Component {
    constructor(props) {
        super(props);

        this.formatTime = this.formatTime.bind(this);
        this.getOffsetBetweenTimezonesForDate = this.getOffsetBetweenTimezonesForDate.bind(this);
        this.convertDateToAnotherTimeZone = this.convertDateToAnotherTimeZone.bind(this);

        this.state = {
            currentUser: AuthService.getCurrentUser(),
        };

        this.topic = this.props.topic;
        this.creationTime = this.formatTime();

    }

    getOffsetBetweenTimezonesForDate(date, timezone1, timezone2) {
        const timezone1Date = this.convertDateToAnotherTimeZone(date, timezone1);
        const timezone2Date = this.convertDateToAnotherTimeZone(date, timezone2);
        return timezone1Date.getTime() - timezone2Date.getTime();
    }

    convertDateToAnotherTimeZone(date, timezone) {
        const dateString = date.toLocaleString('en-US', {
            timeZone: timezone
        });
        return new Date(dateString);
    }

    formatTime() {
        let timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone)
        const difsTimeZones = this.getOffsetBetweenTimezonesForDate(new Date(), this.topic.timeZone, timeZone)
        return (new Date(new Date(this.topic.creationTime).getTime() - difsTimeZones))
    }

    render() {
        const {classes} = this.props;
        return (

            /*<div className="row color-light-blue topic-card top-buffer-10">
                <div className="col-sm ">
                    <div className="topic-info-box align-content-center">
                        <div className="center-vertical">
                            <h6> {this.topic.creator.username}</h6>
                            <h6> {new Date(this.topic.creationTime).toLocaleDateString()}</h6>
                            <h6>{this.creationTime}</h6>
                        </div>
                    </div>
                </div>

                <div className="col-sm ">
                    <header className="record-jumbotron align-center bottom-buffer-10 line-break">
                        <div className="bottom-buffer-10"> {this.topic.name}</div>
                    </header>
                </div>
            </div>*/
            <Grid spacing={1}>
                <Card className={classes.paper}>
                    <Grid className={classes.mainGrid}>
                        <Grid className={classes.grid}>
                            <Grid className={classes.grid}>
                                <Link to={"/profile/" + this.topic.creator.username}
                                      style={{textDecoration: 'none', color: 'dark-blue'}}>
                                    <h6 className={classes.hMargin}> {this.topic.creator.username}</h6>
                                </Link>

                            </Grid>
                            {/*<Grid item>
                            <Typography variant={"subtitle1"}>
                                {new Date(this.topic.creationTime).toLocaleDateString()}
                            </Typography>

                        </Grid>
                        <Grid item>
                            <Typography variant={"subtitle1"}>
                                {this.creationTime}
                            </Typography>
                        </Grid>*/}
                            {/*</Grid>*/}
                            <Grid>
                                <Typography variant="body1" className={classes.content}>{/*gutterBottom*/}
                                    {this.topic.name}
                                </Typography>

                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        )

    }
}

export default withStyles(useStyles)(TopicCard)