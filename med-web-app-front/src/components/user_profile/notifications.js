import {Card, TextField, withStyles} from "@material-ui/core";
import NotificationService from "../../services/notification.service"
import Button from "@material-ui/core/Button";
import AuthService from "../../services/auth.service";
import Grid from "@material-ui/core/Grid";
import React, {useEffect, useState} from "react";
import GetUser from "../../requests_and_responses/getUser-request"
import CreatableSelect from "react-select/creatable";
import specialtiesList from "../../specialties-of-doctors-and-diagnoses/specialties-of-doctors";
import diagnosesList from "../../specialties-of-doctors-and-diagnoses/diagnoses";
import CreatableSelectSpecialties from "../../specialties-of-doctors-and-diagnoses/creatable-select-specialties";
import CreatableSelectDiagnoses from "../../specialties-of-doctors-and-diagnoses/creatable-select-diagnoses";
import NotificationCard from "./notification-card.component"


const useStyles = theme => ({
   
});

const creatableSelectStyle = {
    control: base => ({
        ...base,
        height: 55,
        minHeight: 55
    })
};


function UserNotifications(props) {
    const {classes} = props;
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState(null);
    const [notificationCards, setNotificationCards] = useState(null);
    useEffect(() => {
        let username1 = AuthService.getCurrentUser().username;
        getCurrentUser(username1);
    }, [])

    function getCurrentUser(username) {
        GetUser(username).then((result) => {
            setUser(result);
            NotificationService.getAllNotifications(result.id)
                .then((r) => {
                    setNotifications(r.data);
            })
                .catch((e) => console.log(e));
        })
    }

    return (
        user && notifications &&
            <Grid container direction="column" alignItems="center">
                <h5>Уведомления</h5>
                {notifications.slice(0).reverse().map((n) => (
                    <NotificationCard notification={n}/>
                ))}
            </Grid>
    );
}

export default withStyles(useStyles)(UserNotifications)