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
    paper: {
        margin: theme.spacing(3),
        borderRadius: 20,
        backgroundColor: "#eeeeee"
    },
    hMargin: {
        margin: 0
    },
    content: {
        display: 'inline-block', 
        wordWrap: 'break-word',
        maxWidth: "80%",
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

          
            <Grid spacing={1}>
                <Card className={classes.paper}>
                    <Grid className={classes.mainGrid} alignItems="center">
                        <Grid item>
                            <Link to={"/profile/" + this.topic.creator.username}
                                    style={{textDecoration: 'none', color: 'dark-blue'}}>
                                <h6 className={classes.hMargin}> {this.topic.creator.username}</h6>
                            </Link>

                        </Grid>
                        <Grid item className={classes.content}>
                            <Typography variant="body1" >
                                {this.topic.name}
                            </Typography>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        )

    }
}

export default withStyles(useStyles)(TopicCard)