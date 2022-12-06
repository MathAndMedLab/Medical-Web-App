import {Card, TextField, withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AuthService from "../../services/auth.service";
import Grid from "@material-ui/core/Grid";
import React, {useEffect, useState} from "react";
import GetUser from "../../requests_and_responses/getUser-request"

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
});

function EditProfile(props) {
    const {classes} = props
    const [user, setUser] = useState(null)
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [patronymic, setPatronymic] = useState("");

    // Only for doctors.
    const [specialization, setSpecialization] = useState(null);
    const [workplace, setWorkplace] = useState(null);
    const [education, setEducation] = useState(null);
    const [experience, setExperience] = useState(null);

    useEffect(() => {
        let username1 = AuthService.getCurrentUser().username;
        getCurrentUser(username1);
    }, [])


    function editProfilePost() {
        let initials
        if (patronymic !== "") {
            initials = lastname + " " + firstname + " " + patronymic
        } else {
            initials = lastname + " " + firstname
        }
        if (!isFieldsCorrect()) {
            return;
        }
        AuthService.editProfile(user.username, firstname, lastname, patronymic, initials, specialization, experience, workplace, education).then(
            async response => {
                console.log(response.data.message)
            })
            .catch((e) => {
                console.log(e);
            });
    }

    function getCurrentUser(username) {
        GetUser(username).then((result) => {
            setUser(result);
        })
    }

    function getFieldsForDoctor() {
        if (user.role === "Пользователь") {
            return;
        }
        return (<Grid item container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="specialization"
                        label="Специализация"
                        name="specialization"
                        autoComplete="on"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="experience"
                        label="Стаж"
                        name="experience"
                        autoComplete="on"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="workplace"
                        label="Место работы"
                        name="workplace"
                        autoComplete="on"
                        value={workplace}
                        onChange={(e) => setWorkplace(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="education"
                        label="Образование"
                        name="education"
                        autoComplete="on"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                    />
                </Grid>
            </Grid>
        )
    }

    function isFieldsCorrect() {
        if (firstname === "" || lastname === "") {
            return false;
        }
        if (user.role === "Пользователь") {
            return true;
        }
        if (isNaN(Number(experience))) {
            return false;
        }
        if (experience <= 0 || experience > 100) {
            return false;
        }
        if (specialization === "" || workplace === "" || education === ""
            || specialization === null || workplace === null || education === null) {
            return false;
        }
        return true;
    }

    function getInfoAboutFieldsCorrectness() {
        if (!isFieldsCorrect() && user.role === "Врач") {
            return (<div>Заполните все обязательные поля и укажите корректный стаж.</div>)
        }
        if (!isFieldsCorrect() && user.role === "Пользователь") {
            return (<div>Заполните все обязательные поля.</div>)
        }
    }

    return (
        user &&
            <Card>
                <div className={classes.paper}>
            <Grid item container spacing={2}>
                <Grid xs={12} item style={{fontSize: "17px"}}>
                    Редактирование профиля:
                </Grid>
                <Grid xs={12} item>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="firstname"
                        label="Имя"
                        name="firstname"
                        autoComplete="on"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                </Grid>
                <Grid xs={12} item>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="lastname"
                        label="Фамилия"
                        name="lastname"
                        autoComplete="on"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                </Grid>
                <Grid xs={12} item>
                    <TextField
                        variant="outlined"
                        fullWidth
                        id="patronymic"
                        label="Отчество"
                        name="patronymic"
                        autoComplete="on"
                        value={patronymic}
                        onChange={(e) => setPatronymic(e.target.value)}
                    />
                </Grid>
                {getFieldsForDoctor()}
                <Grid xs={12} item style={{textAlign: 'center'}}>
                    <Button className={classes.button} onClick={editProfilePost}> Сохранить все изменения </Button>
                </Grid>
                <Grid xs={12} item style={{textAlign: 'center'}}>
                    {getInfoAboutFieldsCorrectness()}
                </Grid>
            </Grid>

                </div>
            </Card>
    );

}

export default withStyles(useStyles)(EditProfile)