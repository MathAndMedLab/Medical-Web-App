import React, {Component} from "react";
import AuthService from "../services/auth.service";
import {Link} from "react-router-dom";
import {Card, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

const useStyles = theme => ({
    hMargin: {
        margin: 0
    },
    mainGrid: {
        display: 'flex',
    },
    grid: {
        margin: theme.spacing(1.5, 0, 0, 1),
        display: 'flex',
    },
    gridContent: {
        margin: theme.spacing(2),
    },
    avatar: {
        width: 30,
        height: 30,
        margin: theme.spacing(2, 0, 0, 2),
    },
    paper: {
        margin: theme.spacing(3),
        marginLeft : theme.spacing(1),
        borderRadius: 20,
        backgroundColor: "#eeeeee"
    },
    content: {
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
    },
});

class ReviewCard extends Component {
    constructor(props) {
        super(props);

        this.formatTime = this.formatTime.bind(this);
        this.getContent = this.getContent.bind(this);
        this.replyToReview = this.replyToReview.bind(this);
        this.getOffsetBetweenTimezonesForDate = this.getOffsetBetweenTimezonesForDate.bind(this);
        this.convertDateToAnotherTimeZone = this.convertDateToAnotherTimeZone.bind(this);

        this.state = {
            currentUser: AuthService.getCurrentUser(),
            replyToReview: false,
        };

        this.review = this.props.review;
        this.isPreview = this.props.isPreview;
        this.isReply = this.props.isReply;

        this.creationTime = this.formatTime();
    }

    replyToReview() {
        this.setState({
            replyToReview: true
        })
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

    getContent(content) {
        if (this.props.isPreview && content != null && content.length > 1000) {
            return content.substring(0, 1000) + '...';
        }
        return content;
    }

    formatTime() {
        let timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone)
        const difsTimeZones = this.getOffsetBetweenTimezonesForDate(new Date(), this.review.timeZone, timeZone)
        return (new Date(new Date(this.review.creationTime).getTime() - difsTimeZones))
    }

    render() {
        const {classes} = this.props;
        return (
            <Grid>
                <Card className={classes.paper}>
                    <Grid className={classes.mainGrid}>
                        <Grid>
                            <Avatar className={classes.avatar}>
                                Photo
                            </Avatar>
                        </Grid>
                        <Grid className={classes.grid}>
                            <Grid className={classes.grid} title={this.review.creator.username}>
                                <Link to={"/profile/" + this.review.creator.username} style={{ textDecoration: 'none', color: 'dark-blue'}}>
                                    <h6 className={classes.hMargin}> {this.review.creator.username}</h6>
                                </Link>
                            </Grid>
                            <Grid className={classes.grid}>
                                <h6 className={classes.hMargin}> {
                                    (((new Date(this.creationTime).getHours() < 10 && "0" + new Date(this.creationTime).getHours())
                                            || (new Date(this.creationTime).getHours() >= 10 && new Date(this.creationTime).getHours())) + ":"
                                        + ((new Date(this.creationTime).getMinutes() < 10 && "0" + new Date(this.creationTime).getMinutes())
                                            || (new Date(this.creationTime).getMinutes() >= 10 && new Date(this.creationTime).getMinutes())
                                        )) + "    " + (
                                        ((new Date(this.creationTime).getDate() < 10 && "0" + new Date(this.creationTime).getDate()) || (new Date(this.creationTime).getDate() >= 10 && new Date(this.creationTime).getDate()))
                                        + "."
                                        + (((new Date(this.creationTime).getMonth() + 1) < 10 && "0" + (new Date(this.creationTime).getMonth() + 1)) || (((new Date(this.creationTime).getMonth() + 1) >= 10 && (new Date(this.creationTime).getMonth() + 1))))
                                        + "." + new Date(this.creationTime).getFullYear()
                                    )}</h6>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid className={classes.gridContent}>
                        <Typography className={classes.content}>
                            {this.getContent(this.review.content)}
                        </Typography>
                    </Grid>
                </Card>
            </Grid>
        )
    }
}

export default withStyles(useStyles)(ReviewCard)