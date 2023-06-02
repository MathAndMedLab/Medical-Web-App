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
    paper: {
        margin: theme.spacing(3, 5, 3, 5),
    },
    button: {
        width: 300,
        margin: theme.spacing(1),
        backgroundColor: '#f50058',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
    },
    gridCreatableSelectStyle: {
        zIndex: 999999,
    },
    nextGridCreatableSelectStyle: {
        zIndex: 999998,
    }
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
            <div>
                <h5>Уведомления</h5>
                {notifications.slice(0).reverse().map((n) => (
                    <NotificationCard notification={n}/>
                ))}
            </div>
    );
}

export default withStyles(useStyles)(UserNotifications)