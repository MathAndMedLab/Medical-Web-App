import React, {useState} from "react";
import AuthService from "../../services/auth.service";
import {Grid, Paper, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationService from "../../services/notification.service";

const useStyles = theme => ({
    paper: {
        padding: theme.spacing(2),
        borderColor: "#e9e9e9",
        borderRadius: 10,
        [theme.breakpoints.down("xs")]: {
            width: 270,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 650
        },
        "@media (min-width : 1280px)": {
            width: 900,
        },
        margin: theme.spacing(1.5, 0, 0, 1),
    },
    notificationType: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        "& .MuiTypography-root": {
            color: "black",
        },
        fontWeight: '500',
        fontSize: '16px'
    },
    gridContent: {
        margin: theme.spacing(1, 1, 0, 0),
        [theme.breakpoints.down("xs")]: {
            width: 209,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 620
        },
        "@media (min-width : 1280px)": {
            width: 1000,
        },
    },
    content: {
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        [theme.breakpoints.down("xs")]: {
            width: 240,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 620
        },
        "@media (min-width : 1280px)": {
            width: 770,
        },
    },
    gridStyleBold: {
        margin: theme.spacing(1, 1, 0, 0),
        fontWeight: '450',
        fontSize: '16px'
    },
})

function NotificationCard(props) {
    const {classes} = props
    const {notification} = props
    const creationTime = formatTime()
    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser())
    const [isDeleted, setIsDeleted] = useState(false);
    function formatTime() {
        let timeZone = (Intl.DateTimeFormat().resolvedOptions().timeZone)
        const difsTimeZones = getOffsetBetweenTimezonesForDate(new Date(), notification.timeZone, timeZone)
        return (new Date(new Date(notification.creationTime).getTime() - difsTimeZones))
    }

    function getOffsetBetweenTimezonesForDate(date, timezone1, timezone2) {
        const timezone1Date = convertDateToAnotherTimeZone(date, timezone1);
        const timezone2Date = convertDateToAnotherTimeZone(date, timezone2);
        return timezone1Date.getTime() - timezone2Date.getTime();
    }

    function convertDateToAnotherTimeZone(date, timezone) {
        const dateString = date.toLocaleString('en-US', {
            timeZone: timezone
        });
        return new Date(dateString);
    }

    function deleteNotification() {
        NotificationService.deleteNotification(currentUser.id, notification.id)
            .then(() => {setIsDeleted(true)})
            .catch((e) => console.log(e))
    }

    function returnNotificationCard() {
        if (!isDeleted) {
            return (<Paper className={classes.paper} variant="outlined">
                <Grid className={classes.notificationType}>
                    {notification.notificationType}
                </Grid>
                <Grid>
                    {
                        <Typography variant={"subtitle3"}>
                            {
                                (((new Date(creationTime).getHours() < 10 && "0" + new Date(creationTime).getHours())
                                        || (new Date(creationTime).getHours() >= 10 && new Date(creationTime).getHours())) + ":"
                                    + ((new Date(creationTime).getMinutes() < 10 && "0" + new Date(creationTime).getMinutes())
                                        || (new Date(creationTime).getMinutes() >= 10 && new Date(creationTime).getMinutes())
                                    )) + "    " + (
                                    ((new Date(creationTime).getDate() < 10 && "0" + new Date(creationTime).getDate()) ||
                                        (new Date(creationTime).getDate() >= 10 && new Date(creationTime).getDate()))
                                    + "."
                                    + (((new Date(creationTime).getMonth() + 1) < 10 && "0" +
                                        (new Date(creationTime).getMonth() + 1)) || (((new Date(creationTime).getMonth() + 1) >= 10 && (new Date(creationTime).getMonth() + 1))))
                                    + "." + new Date(creationTime).getFullYear()
                                )}
                        </Typography>
                    }
                    <DeleteIcon onClick={() => deleteNotification()} className={classes.deleteIcon}/>
                </Grid>
                <Grid className={classes.gridContent}>
                    <Typography variant="body1" className={classes.content}>
                        {notification.data}
                    </Typography>
                </Grid>
                <Grid className={classes.gridStyleBold}>
                    <Link style={{color: "black"}} to={notification.notificationLink}>
                        {'Перейти к обсуждению:'} <span className="fa fa-comments"></span>
                    </Link>
                </Grid>
            </Paper>)
        }
        else {
            return (
                <Paper className={classes.paper} variant="outlined">
                    <Grid>
                        <Typography variant="body1" className={classes.content}>
                            Уведомление успешно удалено!
                        </Typography>
                    </Grid>
                </Paper>)
        }
    }
    return (currentUser &&
            <span>
                {returnNotificationCard()}
            </span>
    );
}

export default withStyles(useStyles)(NotificationCard)